"use server";

// Server Action for opening a secret box — consumed by SecretBoxInner.
// Delegates to the data-layer RPC (open_secret_box) which atomically:
//   - decrements secret_boxes.unopened_count
//   - selects a badge by server-side weighted random
//   - inserts a badge_collections row
//   - returns the drawn badge
// Revalidates /sun-kudos (feed count chip) and /profile (badge collection).

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { openSecretBox } from "@/lib/data/secret-box";
import type { BadgeReward } from "@/lib/data/types";

export interface OpenBoxResult {
  badge: BadgeReward;
  /** New unopened count after this open (derived: callers decrement their local state). */
  newCount: number;
}

/**
 * Opens one secret box for the current user via the open_secret_box() RPC.
 * Returns the drawn badge and the updated unopened count.
 * Throws a user-readable Vietnamese message when count = 0 or on RPC error.
 */
export async function openBox(): Promise<OpenBoxResult> {
  const client = await createClient();

  // getSecretBoxState is called after to get the updated count in a single extra query,
  // but the RPC itself does not return the new count. We fetch it immediately after.
  const badge = await openSecretBox(client);

  // Fetch updated count (RPC already decremented atomically)
  const { data, error } = await client
    .from("secret_boxes")
    .select("unopened_count")
    .maybeSingle();

  if (error) throw new Error(`Không thể lấy số hộp: ${error.message}`);

  const newCount = data?.unopened_count ?? 0;

  revalidatePath("/sun-kudos");
  revalidatePath("/profile");

  return { badge, newCount };
}
