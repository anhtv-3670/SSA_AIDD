/**
 * Profile query helpers.
 *
 * getProfile returns the full ProfileData shape the profile page consumes,
 * including stats from the profile_stats RPC, derived hero tier, sent/received
 * kudos feeds, and the user's badge collection (6-slot display).
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import {
  mapProfileStats,
  mapBadge,
  castTitleBadge,
  type ProfileStatsRow,
} from "./mappers";
import { getProfileKudos } from "./kudos-queries";
import type { ProfileData, ProfileStats, BadgeCollectionSlot } from "./types";

type Client = SupabaseClient<Database>;

// ---------------------------------------------------------------------------
// Stats
// ---------------------------------------------------------------------------

/**
 * Calls the profile_stats(uid) RPC and maps the result to ProfileStats.
 * Returns zeroed stats when the RPC returns no rows (new user).
 */
export async function getProfileStats(
  client: Client,
  uid: string,
): Promise<ProfileStats & { heroTierName: string }> {
  const { data, error } = await client.rpc("profile_stats", { uid });

  if (error) throw new Error(`profile_stats RPC failed: ${error.message}`);

  const row = (data as ProfileStatsRow[] | null)?.[0];
  if (!row) {
    return {
      kudosReceived: 0,
      kudosSent: 0,
      hearts: 0,
      boxOpened: 0,
      boxUnopened: 0,
      heroTierName: "New Hero",
    };
  }

  return mapProfileStats(row);
}

// ---------------------------------------------------------------------------
// Badge collection
// ---------------------------------------------------------------------------

/**
 * Returns the user's badge collection as a 6-slot array.
 * Slots correspond to the 6 badge catalog entries ordered by weight desc.
 * Each slot indicates whether the badge has been earned and when.
 */
export async function getBadgeCollection(
  client: Client,
  uid: string,
): Promise<BadgeCollectionSlot[]> {
  // Load the full badge catalog (ordered by weight desc = rarest last)
  const { data: catalogData, error: catalogError } = await client
    .from("badges")
    .select("*")
    .order("weight", { ascending: false });

  if (catalogError) throw new Error(`Failed to load badges: ${catalogError.message}`);

  // Load this user's earned badges
  const { data: collectionData, error: collectionError } = await client
    .from("badge_collections")
    .select("badge_id, awarded_at")
    .eq("user_id", uid);

  if (collectionError) {
    throw new Error(`Failed to load badge_collections: ${collectionError.message}`);
  }

  // Build a lookup: badge_id → earliest awarded_at
  const earned = new Map<string, string>();
  for (const row of collectionData ?? []) {
    const existing = earned.get(row.badge_id);
    if (!existing || row.awarded_at < existing) {
      earned.set(row.badge_id, row.awarded_at);
    }
  }

  return (catalogData ?? []).map((badge): BadgeCollectionSlot => ({
    badge: mapBadge(badge),
    earnedAt: earned.get(badge.id) ?? null,
    owned: earned.has(badge.id),
  }));
}

// ---------------------------------------------------------------------------
// Full profile
// ---------------------------------------------------------------------------

/**
 * Returns the full ProfileData for a given user, defaulting to the
 * currently authenticated user when uid is not supplied.
 *
 * Includes: profile fields, stats, hero tier, sent/received kudos feeds,
 * and badge collection.
 */
export async function getProfile(
  client: Client,
  uid?: string,
): Promise<ProfileData & {
  heroTierName: string;
  sentKudos: Awaited<ReturnType<typeof getProfileKudos>>;
  receivedKudos: Awaited<ReturnType<typeof getProfileKudos>>;
  badgeCollection: BadgeCollectionSlot[];
}> {
  // Resolve uid → current user if not provided
  let resolvedUid = uid;
  if (!resolvedUid) {
    const { data: { user } } = await client.auth.getUser();
    if (!user) throw new Error("Unauthenticated");
    resolvedUid = user.id;
  }

  // Fetch profile row, stats, kudos feeds, and badge collection in parallel
  const [profileResult, stats, sentKudos, receivedKudos, badgeCollection] =
    await Promise.all([
      client
        .from("profiles")
        .select("id, full_name, dept_code, avatar_initial")
        .eq("id", resolvedUid)
        .single(),
      getProfileStats(client, resolvedUid),
      getProfileKudos(client, resolvedUid, "sent"),
      getProfileKudos(client, resolvedUid, "received"),
      getBadgeCollection(client, resolvedUid),
    ]);

  if (profileResult.error) {
    throw new Error(`Failed to load profile: ${profileResult.error.message}`);
  }

  const p = profileResult.data;

  return {
    id: p.id,
    name: p.full_name ?? "",
    dept: p.dept_code ?? "",
    title: castTitleBadge(stats.heroTierName),
    avatarInitial: p.avatar_initial ?? (p.full_name?.[0] ?? "?"),
    stats: {
      kudosReceived: stats.kudosReceived,
      kudosSent: stats.kudosSent,
      hearts: stats.hearts,
      boxOpened: stats.boxOpened,
      boxUnopened: stats.boxUnopened,
    },
    heroTierName: stats.heroTierName,
    sentKudos,
    receivedKudos,
    badgeCollection,
  };
}
