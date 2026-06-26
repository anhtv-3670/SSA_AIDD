"use server";

/**
 * Server Actions for kudos heart (like/unlike) reactions.
 *
 * Both actions are idempotent — liking twice or unliking a non-liked kudos
 * does not produce an error (Postgres unique constraint + soft-ignore on
 * delete-nothing).
 *
 * RLS enforces user_id = auth.uid() server-side, so callers never supply
 * a user_id — it is always derived from the session.
 */

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

/**
 * Insert a heart for the current user on the given kudos.
 * Idempotent: if the row already exists (unique PK), the conflict is ignored.
 */
export async function likeKudo(kudosId: string): Promise<void> {
  const client = await createClient();

  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) throw new Error("Unauthenticated");

  const { error } = await client
    .from("hearts")
    .insert({ kudos_id: kudosId, user_id: user.id });

  // Ignore unique-constraint violation (already liked) — any other error rethrows.
  if (error && !error.message.includes("duplicate key")) {
    throw new Error(`likeKudo failed: ${error.message}`);
  }

  revalidatePath("/sun-kudos");
}

/**
 * Delete the current user's heart on the given kudos.
 * Idempotent: if the row does not exist, delete is a no-op.
 */
export async function unlikeKudo(kudosId: string): Promise<void> {
  const client = await createClient();

  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) throw new Error("Unauthenticated");

  const { error } = await client
    .from("hearts")
    .delete()
    .eq("kudos_id", kudosId)
    .eq("user_id", user.id);

  if (error) throw new Error(`unlikeKudo failed: ${error.message}`);

  revalidatePath("/sun-kudos");
}
