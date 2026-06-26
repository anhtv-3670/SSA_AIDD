/**
 * Pure row → shape mappers for the Supabase data layer.
 *
 * All functions here are pure (no I/O, no side effects) and fully unit-tested
 * in mappers.test.ts. Keep it that way — the query helpers call these, which
 * lets us test the mapping logic without a database.
 */

import type { Database } from "@/lib/supabase/database.types";
import type {
  AwardDetail,
  BadgeReward,
  KudosEntry,
  KudosPerson,
  TitleBadge,
} from "./types";

// ---------------------------------------------------------------------------
// Internal row types (inferred from generated DB types)
// ---------------------------------------------------------------------------

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type AwardRow = Database["public"]["Tables"]["awards"]["Row"];
type BadgeRow = Database["public"]["Tables"]["badges"]["Row"];
type HeroTierRow = Database["public"]["Tables"]["hero_tiers"]["Row"];

/**
 * The nested PostgREST row shape returned by the kudos feed query.
 * Sender/receiver are joined via !sender_id and !receiver_id FK hints.
 * Hearts, hashtag tags, and image URLs are embedded arrays.
 */
export interface KudosRowWithJoins {
  id: string;
  created_at: string;
  message: string;
  is_anonymous: boolean;
  anonymous_name: string | null;
  danh_hieu: string | null;
  sender: ProfileRow | null;
  receiver: ProfileRow | null;
  /** Array of { hashtags: { tag: string } } join rows */
  kudos_hashtags: Array<{ hashtags: { tag: string } | null }>;
  /** Array of image rows */
  kudos_images: Array<{ url: string; sort_idx: number }>;
  /** All hearts on this kudos (used for count + liked-by-me check) */
  hearts: Array<{ user_id: string }>;
}

// ---------------------------------------------------------------------------
// Hero tier derivation
// ---------------------------------------------------------------------------

/**
 * Maps a received-kudos count to a TitleBadge name.
 *
 * Tier thresholds (from seed data / hero_tiers table):
 *   New Hero    : 1–4   (min_received = 1,  max_received = 4)
 *   Rising Hero : 5–9   (min_received = 5,  max_received = 9)
 *   Super Hero  : 10–20 (min_received = 10, max_received = 20)
 *   Legend Hero : 21+   (min_received = 21, max_received = null)
 *
 * Falls back to "New Hero" for 0 received (below first tier).
 */
export function heroTierName(received: number, tiers: HeroTierRow[]): TitleBadge {
  const FALLBACK: TitleBadge = "New Hero";
  if (!tiers.length) return FALLBACK;

  const sorted = [...tiers].sort((a, b) => b.min_received - a.min_received);
  for (const tier of sorted) {
    if (received >= tier.min_received) {
      return tier.name as TitleBadge;
    }
  }
  return FALLBACK;
}

/**
 * Lightweight version when you already have the tier name from `profile_stats` RPC.
 * Casts to TitleBadge — safe because the DB tier names are the canonical values.
 */
export function castTitleBadge(name: string): TitleBadge {
  const known: TitleBadge[] = ["New Hero", "Rising Hero", "Super Hero", "Legend Hero"];
  if (known.includes(name as TitleBadge)) return name as TitleBadge;
  return "New Hero";
}

// ---------------------------------------------------------------------------
// Time formatting
// ---------------------------------------------------------------------------

/**
 * Formats an ISO timestamp to the UI format: "HH:mm - MM/DD/YYYY".
 * e.g. "2025-10-30T10:00:00Z" → "10:00 - 10/30/2025"
 */
export function formatKudosTime(isoTimestamp: string): string {
  const d = new Date(isoTimestamp);
  if (isNaN(d.getTime())) return isoTimestamp;

  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const year = d.getFullYear();

  return `${hh}:${mm} - ${month}/${day}/${year}`;
}

// ---------------------------------------------------------------------------
// Profile row → KudosPerson
// ---------------------------------------------------------------------------

/**
 * Maps a profiles row + derived hero tier to a KudosPerson shape.
 * Anonymous kudos must not call this for the sender — use mapAnonymousSender.
 */
export function mapProfileToKudosPerson(
  profile: ProfileRow,
  tiers: HeroTierRow[],
  receivedCount: number,
): KudosPerson {
  return {
    id: profile.id,
    name: profile.full_name ?? "",
    dept: profile.dept_code ?? "",
    title: heroTierName(receivedCount, tiers),
    initial: profile.avatar_initial ?? (profile.full_name?.[0] ?? "?"),
  };
}

/**
 * Returns the anonymous sender placeholder when is_anonymous = true.
 * Hides all identity: dept = "", initial = "?", title = "New Hero".
 */
export function mapAnonymousSender(anonymousName: string | null): KudosPerson {
  return {
    id: "anonymous",
    name: anonymousName ?? "Người giấu tên",
    dept: "",
    title: "New Hero",
    initial: "?",
  };
}

// ---------------------------------------------------------------------------
// Kudos row → KudosEntry
// ---------------------------------------------------------------------------

/**
 * Maps a fully-joined kudos DB row to the canonical KudosEntry shape.
 *
 * @param row     - the joined kudos row (see KudosRowWithJoins)
 * @param tiers   - hero_tiers catalog rows (used to derive sender/receiver titles)
 * @param currentUserId - auth.uid() of the viewing user (used for liked-by-me)
 * @param senderReceivedCount  - how many kudos the sender has received (for their tier)
 * @param receiverReceivedCount - how many kudos the receiver has received (for their tier)
 */
export function mapKudosRow(
  row: KudosRowWithJoins,
  tiers: HeroTierRow[],
  currentUserId: string | null,
  senderReceivedCount: number,
  receiverReceivedCount: number,
): KudosEntry {
  const sender: KudosPerson = row.is_anonymous
    ? mapAnonymousSender(row.anonymous_name)
    : mapProfileToKudosPerson(row.sender ?? stubProfile(), tiers, senderReceivedCount);

  const receiver: KudosPerson = mapProfileToKudosPerson(
    row.receiver ?? stubProfile(),
    tiers,
    receiverReceivedCount,
  );

  const hashtags = row.kudos_hashtags
    .map((kh) => (kh.hashtags ? `#${kh.hashtags.tag.replace(/^#/, "")}` : null))
    .filter((t): t is string => t !== null);

  const images = row.kudos_images
    .sort((a, b) => a.sort_idx - b.sort_idx)
    .map((img) => img.url);

  const likeCount = row.hearts.length;
  const liked = currentUserId
    ? row.hearts.some((h) => h.user_id === currentUserId)
    : false;

  return {
    id: row.id,
    sender,
    receiver,
    time: formatKudosTime(row.created_at),
    message: row.message,
    hashtags,
    likeCount,
    liked,
    images: images.length > 0 ? images : undefined,
  };
}

// ---------------------------------------------------------------------------
// Award row → AwardDetail
// ---------------------------------------------------------------------------

export function mapAward(row: AwardRow): AwardDetail {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? "",
    quantity: row.quantity ?? "",
    prizeValue: row.prize_value ?? "",
    ringColor: row.ring_color ?? "#FAE287",
    image: row.image ?? "",
  };
}

// ---------------------------------------------------------------------------
// Badge row → BadgeReward
// ---------------------------------------------------------------------------

export function mapBadge(row: BadgeRow): BadgeReward {
  return {
    id: row.id,
    name: row.name,
    image: row.image ?? "",
  };
}

// ---------------------------------------------------------------------------
// Profile stats RPC row → ProfileStats
// ---------------------------------------------------------------------------

export interface ProfileStatsRow {
  kudos_received: number;
  kudos_sent: number;
  hearts_received: number;
  boxes_opened: number;
  boxes_unopened: number;
  hero_tier_name: string;
}

export function mapProfileStats(row: ProfileStatsRow) {
  return {
    kudosReceived: row.kudos_received,
    kudosSent: row.kudos_sent,
    hearts: row.hearts_received,
    boxOpened: row.boxes_opened,
    boxUnopened: row.boxes_unopened,
    heroTierName: row.hero_tier_name,
  };
}

// ---------------------------------------------------------------------------
// Private helpers
// ---------------------------------------------------------------------------

/** Returns a minimal stub profile for the rare case a FK is null in the DB. */
function stubProfile(): ProfileRow {
  return {
    id: "unknown",
    full_name: "Unknown",
    dept_code: null,
    avatar_initial: "?",
    email: null,
    created_at: new Date().toISOString(),
  };
}
