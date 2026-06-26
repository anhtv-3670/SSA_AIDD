/**
 * Canonical types for the Sun* Kudos data layer.
 *
 * These are the authoritative shapes shared by both mock data files and the
 * live Supabase data layer. Wiring phases import from here; mock files
 * re-export from here so the transition is purely a path swap.
 */

// ---------------------------------------------------------------------------
// Hero Tiers
// ---------------------------------------------------------------------------

export type TitleBadge = "New Hero" | "Rising Hero" | "Super Hero" | "Legend Hero";

export interface HeroTier {
  id: number;
  name: string;
  minReceived: number;
  maxReceived: number | null;
  color: string;
}

// ---------------------------------------------------------------------------
// Kudos feed shapes
// ---------------------------------------------------------------------------

export interface KudosPerson {
  id: string;
  name: string;
  dept: string;
  title: TitleBadge;
  initial: string;
}

export interface KudosEntry {
  id: string;
  sender: KudosPerson;
  receiver: KudosPerson;
  time: string;
  message: string;
  hashtags: string[];
  likeCount: number;
  liked?: boolean;
  images?: string[];
}

// ---------------------------------------------------------------------------
// Profile shapes
// ---------------------------------------------------------------------------

export interface ProfileStats {
  kudosReceived: number;
  kudosSent: number;
  hearts: number;
  boxOpened: number;
  boxUnopened: number;
}

export interface ProfileData {
  id: string;
  name: string;
  dept: string;
  title: string;
  avatarInitial: string;
  stats: ProfileStats;
}

export interface ProfileKudosEntry extends KudosEntry {
  spam?: boolean;
}

// ---------------------------------------------------------------------------
// Awards
// ---------------------------------------------------------------------------

export interface AwardDetail {
  id: string;
  name: string;
  description: string;
  quantity: string;
  prizeValue: string;
  ringColor: string;
  image: string;
}

// ---------------------------------------------------------------------------
// Badges / Secret Box
// ---------------------------------------------------------------------------

export interface BadgeReward {
  id: string;
  name: string;
  image: string;
}

export interface BadgeCollectionSlot {
  badge: BadgeReward;
  earnedAt: string | null;
  owned: boolean;
}
