"use server";

// Server Action wrapper for kudos creation — consumed by WriteKudoModal.
// Re-exports createKudo from the data layer so the modal calls a single
// import that is already marked "use server".

import { createKudo } from "@/lib/data/kudos-mutations";
import type { CreateKudoInput, CreateKudoResult } from "@/lib/data/kudos-mutations";

export type { CreateKudoInput, CreateKudoResult };

/**
 * Submit a new kudos from the write-kudo modal.
 * Images arrive as File[] (uploaded client-side before this call — the
 * data layer handles Storage upload + kudos_images rows internally).
 */
export async function submitKudo(
  input: CreateKudoInput,
  imageFiles: File[] = [],
): Promise<CreateKudoResult> {
  return createKudo(input, imageFiles);
}
