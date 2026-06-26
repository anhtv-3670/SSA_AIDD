/**
 * Secret box query + Server Action.
 *
 * getSecretBoxState — reads unopened count for the current user.
 * openSecretBox     — Server Action that calls open_secret_box() RPC
 *                     (authoritative server-side random, atomic decrement,
 *                     inserts badge_collections row). Returns the won BadgeReward.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import { mapBadge } from "./mappers";
import type { BadgeReward } from "./types";

type Client = SupabaseClient<Database>;

// ---------------------------------------------------------------------------
// Query
// ---------------------------------------------------------------------------

export interface SecretBoxState {
  unopenedCount: number;
}

/**
 * Returns the number of unopened secret boxes for the current user.
 * Returns { unopenedCount: 0 } when no row exists yet (new user).
 */
export async function getSecretBoxState(client: Client): Promise<SecretBoxState> {
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) throw new Error("Unauthenticated");

  const { data, error } = await client
    .from("secret_boxes")
    .select("unopened_count")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) throw new Error(`getSecretBoxState failed: ${error.message}`);

  return { unopenedCount: data?.unopened_count ?? 0 };
}

// ---------------------------------------------------------------------------
// Server Action
// ---------------------------------------------------------------------------

/**
 * Opens one secret box by calling the open_secret_box() RPC.
 *
 * The RPC is SECURITY DEFINER and handles atomically:
 *   - decrementing secret_boxes.unopened_count
 *   - weighted-random badge selection (server-side, not client-side)
 *   - inserting a badge_collections row
 *   - returning the drawn badge row
 *
 * Throws when unopened_count is 0 or the RPC returns an error.
 */
export async function openSecretBox(client: Client): Promise<BadgeReward> {
  const { data, error } = await client.rpc("open_secret_box");

  if (error) {
    // The RPC raises 'no_box' (with underscore) when count = 0 — surface it clearly.
    if (error.message.includes("no_box")) {
      throw new Error("Không còn hộp quà nào để mở.");
    }
    throw new Error(`open_secret_box RPC failed: ${error.message}`);
  }

  // RPC returns a single badge row (SetofOptions isSetofReturn: false)
  const badge = data as Database["public"]["Functions"]["open_secret_box"]["Returns"] | null;
  if (!badge) throw new Error("open_secret_box returned no data");

  return mapBadge(badge);
}
