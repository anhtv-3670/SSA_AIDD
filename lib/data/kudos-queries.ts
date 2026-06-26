/**
 * Kudos feed query helpers.
 *
 * All functions accept a typed SupabaseClient so they are usable from any
 * server context (RSC, Server Action, Route Handler). The caller is
 * responsible for creating the cookie-bound client via createClient().
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import { mapKudosRow, type KudosRowWithJoins } from "./mappers";
import type { KudosEntry } from "./types";

type Client = SupabaseClient<Database>;

// ---------------------------------------------------------------------------
// PostgREST select string — documented here for discoverability
// ---------------------------------------------------------------------------
//
// kudos
//   sender:profiles!kudos_sender_id_fkey(*)    ← FK hint for sender_id
//   receiver:profiles!kudos_receiver_id_fkey(*) ← FK hint for receiver_id
//   kudos_hashtags(hashtags(tag))
//   kudos_images(url,sort_idx)
//   hearts(user_id)
//
// "liked-by-me" and likeCount are both derived from hearts[] in the mapper,
// so a single query covers both without a correlated subquery.

const KUDOS_SELECT = `
  id,
  created_at,
  message,
  is_anonymous,
  anonymous_name,
  danh_hieu,
  sender:profiles!kudos_sender_id_fkey(
    id, full_name, dept_code, avatar_initial, email, created_at
  ),
  receiver:profiles!kudos_receiver_id_fkey(
    id, full_name, dept_code, avatar_initial, email, created_at
  ),
  kudos_hashtags(
    hashtags(tag)
  ),
  kudos_images(url, sort_idx),
  hearts(user_id)
`.trim();

// ---------------------------------------------------------------------------
// Internal: load hero tiers catalog (cached within a request via caller)
// ---------------------------------------------------------------------------

async function loadTiers(client: Client) {
  const { data, error } = await client
    .from("hero_tiers")
    .select("*")
    .order("min_received", { ascending: true });

  if (error) throw new Error(`Failed to load hero_tiers: ${error.message}`);
  return data ?? [];
}

// ---------------------------------------------------------------------------
// Internal: resolve received-kudos counts for a set of profile IDs
// Returns a map of profileId → received count.
// ---------------------------------------------------------------------------

async function loadReceivedCounts(
  client: Client,
  profileIds: string[],
): Promise<Record<string, number>> {
  if (profileIds.length === 0) return {};

  const { data, error } = await client
    .from("kudos")
    .select("receiver_id")
    .in("receiver_id", profileIds);

  if (error) throw new Error(`Failed to load received counts: ${error.message}`);

  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    if (row.receiver_id) {
      counts[row.receiver_id] = (counts[row.receiver_id] ?? 0) + 1;
    }
  }
  return counts;
}

// ---------------------------------------------------------------------------
// Internal: get current user id (null if unauthenticated)
// ---------------------------------------------------------------------------

async function getCurrentUserId(client: Client): Promise<string | null> {
  const { data } = await client.auth.getUser();
  return data.user?.id ?? null;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface KudosFeedOptions {
  hashtag?: string;
  dept?: string;
  query?: string;
  limit?: number;
}

/**
 * Fetches the main kudos feed, joined with sender/receiver profiles,
 * hashtags, images, and hearts. Maps to KudosEntry[].
 *
 * Filters are applied server-side where possible:
 *   - hashtag: filters via kudos_hashtags join
 *   - dept: filters sender or receiver dept_code (client-side post-fetch — PostgREST
 *     does not support OR across embedded relations without a view)
 *   - query: client-side text search on message + names
 */
export async function getKudosFeed(
  client: Client,
  options: KudosFeedOptions = {},
): Promise<KudosEntry[]> {
  const { hashtag, dept, query, limit = 50 } = options;

  const [tiers, currentUserId] = await Promise.all([
    loadTiers(client),
    getCurrentUserId(client),
  ]);

  const qb = client
    .from("kudos")
    .select(KUDOS_SELECT)
    .order("created_at", { ascending: false })
    .limit(limit);

  const { data, error } = await qb;
  if (error) throw new Error(`getKudosFeed failed: ${error.message}`);

  const rows = (data ?? []) as unknown as KudosRowWithJoins[];

  // Collect all profile IDs to batch-load received counts
  const profileIds = new Set<string>();
  for (const row of rows) {
    if (row.sender?.id) profileIds.add(row.sender.id);
    if (row.receiver?.id) profileIds.add(row.receiver.id);
  }
  const receivedCounts = await loadReceivedCounts(client, [...profileIds]);

  let entries = rows.map((row) =>
    mapKudosRow(
      row,
      tiers,
      currentUserId,
      receivedCounts[row.sender?.id ?? ""] ?? 0,
      receivedCounts[row.receiver?.id ?? ""] ?? 0,
    ),
  );

  // Client-side hashtag filter.
  // PostgREST .eq() on an embedded relation filters the nested array but does NOT
  // exclude parent rows that lack the tag — it silently returns all rows. We filter
  // the mapped entries in-process instead (consistent with dept/query handling).
  if (hashtag) {
    const normalised = hashtag.startsWith("#") ? hashtag : `#${hashtag}`;
    entries = entries.filter((e) => e.hashtags.includes(normalised));
  }

  // Client-side dept filter (sender OR receiver in dept)
  if (dept) {
    entries = entries.filter(
      (e) => e.sender.dept === dept || e.receiver.dept === dept,
    );
  }

  // Client-side text search
  if (query) {
    const q = query.toLowerCase();
    entries = entries.filter(
      (e) =>
        e.message.toLowerCase().includes(q) ||
        e.sender.name.toLowerCase().includes(q) ||
        e.receiver.name.toLowerCase().includes(q),
    );
  }

  return entries;
}

/**
 * Returns only the top kudos by likeCount (for the highlight carousel).
 * Fetches the full feed then slices — suitable for the demo scale.
 */
export async function getHighlightKudos(
  client: Client,
  count = 5,
): Promise<KudosEntry[]> {
  const feed = await getKudosFeed(client, { limit: 100 });
  return [...feed].sort((a, b) => b.likeCount - a.likeCount).slice(0, count);
}

/**
 * Returns kudos sent or received by a specific user, mapped to KudosEntry[].
 */
export async function getProfileKudos(
  client: Client,
  uid: string,
  direction: "sent" | "received",
): Promise<KudosEntry[]> {
  const [tiers, currentUserId] = await Promise.all([
    loadTiers(client),
    getCurrentUserId(client),
  ]);

  const column = direction === "sent" ? "sender_id" : "receiver_id";

  const { data, error } = await client
    .from("kudos")
    .select(KUDOS_SELECT)
    .eq(column, uid)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) throw new Error(`getProfileKudos failed: ${error.message}`);

  const rows = (data ?? []) as unknown as KudosRowWithJoins[];

  const profileIds = new Set<string>();
  for (const row of rows) {
    if (row.sender?.id) profileIds.add(row.sender.id);
    if (row.receiver?.id) profileIds.add(row.receiver.id);
  }
  const receivedCounts = await loadReceivedCounts(client, [...profileIds]);

  return rows.map((row) =>
    mapKudosRow(
      row,
      tiers,
      currentUserId,
      receivedCounts[row.sender?.id ?? ""] ?? 0,
      receivedCounts[row.receiver?.id ?? ""] ?? 0,
    ),
  );
}
