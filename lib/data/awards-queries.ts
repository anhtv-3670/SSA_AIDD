/**
 * Awards catalog query helper.
 * Returns AwardDetail[] ordered by sort_idx ascending.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import { mapAward } from "./mappers";
import type { AwardDetail } from "./types";

type Client = SupabaseClient<Database>;

/**
 * Fetches all awards from the catalog, ordered by sort_idx.
 * This table is static (read-only) — safe to call from RSC with no auth guard.
 */
export async function getAwards(client: Client): Promise<AwardDetail[]> {
  const { data, error } = await client
    .from("awards")
    .select("*")
    .order("sort_idx", { ascending: true });

  if (error) throw new Error(`getAwards failed: ${error.message}`);

  return (data ?? []).map(mapAward);
}
