"use server";

// Server Actions for loading write-kudo catalog data.
// Used by WriteKudoFab (pages that don't pre-fetch on the server boundary)
// so those pages stay propless — the FAB self-sources catalog on first open.

import { createClient } from "@/lib/supabase/server";
import { getHashtags, getDepartments } from "@/lib/data/catalog-queries";
import type { HashtagOption, DepartmentOption } from "@/lib/data/catalog-queries";
import type { RecipientOption } from "./write-kudo-modal";

export interface WriteCatalog {
  hashtags: HashtagOption[];
  departments: DepartmentOption[];
  recipients: RecipientOption[];
}

/**
 * Loads hashtags, departments, and recipient profiles in one round-trip.
 * Called lazily by WriteKudoFab on first modal open.
 */
export async function fetchWriteCatalog(): Promise<WriteCatalog> {
  const client = await createClient();

  const {
    data: { user },
  } = await client.auth.getUser();

  const [hashtags, departments, profilesResult] = await Promise.all([
    getHashtags(client),
    getDepartments(client),
    client
      .from("profiles")
      .select("id, full_name, dept_code, avatar_initial")
      .neq("id", user?.id ?? "")
      .order("full_name", { ascending: true }),
  ]);

  const recipients: RecipientOption[] = (profilesResult.data ?? []).map((p) => ({
    id: p.id,
    name: p.full_name ?? "",
    dept: p.dept_code ?? "",
    initial: p.avatar_initial ?? (p.full_name?.[0] ?? "?"),
  }));

  return { hashtags, departments, recipients };
}
