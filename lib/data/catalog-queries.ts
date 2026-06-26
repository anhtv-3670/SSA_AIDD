/**
 * Catalog query helpers — static lookup tables used by write-kudo dropdowns,
 * filter UI, and the awards/hero tier pages.
 *
 * All tables here are read-only (INSERT/UPDATE blocked by RLS). Safe to call
 * from RSC or Server Actions.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import { mapBadge } from "./mappers";
import type { BadgeReward, HeroTier } from "./types";

type Client = SupabaseClient<Database>;

// ---------------------------------------------------------------------------
// Hashtags
// ---------------------------------------------------------------------------

export interface HashtagOption {
  id: number;
  tag: string;
  /** Normalised display label — always has leading # */
  label: string;
}

export async function getHashtags(client: Client): Promise<HashtagOption[]> {
  const { data, error } = await client
    .from("hashtags")
    .select("id, tag")
    .order("tag", { ascending: true });

  if (error) throw new Error(`getHashtags failed: ${error.message}`);

  return (data ?? []).map((row) => ({
    id: row.id,
    tag: row.tag,
    label: row.tag.startsWith("#") ? row.tag : `#${row.tag}`,
  }));
}

// ---------------------------------------------------------------------------
// Departments
// ---------------------------------------------------------------------------

export interface DepartmentOption {
  code: string;
  name: string;
}

export async function getDepartments(client: Client): Promise<DepartmentOption[]> {
  const { data, error } = await client
    .from("departments")
    .select("code, name")
    .order("code", { ascending: true });

  if (error) throw new Error(`getDepartments failed: ${error.message}`);

  return (data ?? []).map((row) => ({ code: row.code, name: row.name }));
}

// ---------------------------------------------------------------------------
// Hero tiers
// ---------------------------------------------------------------------------

export async function getHeroTiers(client: Client): Promise<HeroTier[]> {
  const { data, error } = await client
    .from("hero_tiers")
    .select("*")
    .order("min_received", { ascending: true });

  if (error) throw new Error(`getHeroTiers failed: ${error.message}`);

  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    minReceived: row.min_received,
    maxReceived: row.max_received,
    color: row.color,
  }));
}

// ---------------------------------------------------------------------------
// Badges catalog (for secret-box UI / badge collection display)
// ---------------------------------------------------------------------------

export async function getBadges(client: Client): Promise<BadgeReward[]> {
  const { data, error } = await client
    .from("badges")
    .select("*")
    .order("weight", { ascending: false });

  if (error) throw new Error(`getBadges failed: ${error.message}`);

  return (data ?? []).map(mapBadge);
}
