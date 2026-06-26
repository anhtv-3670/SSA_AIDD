"use server";

/**
 * Server Action: create a new kudos.
 *
 * Handles:
 *   - Insert kudos row (sender_id = auth.uid(), RLS enforced)
 *   - Insert kudos_hashtags junction rows
 *   - Upload image files to Storage bucket "kudos-images"
 *   - Insert kudos_images rows with the resulting public URLs
 *   - Respects is_anonymous / anonymous_name
 *
 * On any failure the error is thrown — the caller (client component) should
 * catch and surface it to the user.
 */

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface CreateKudoInput {
  receiverId: string;
  message: string;
  /** Hashtag IDs (numeric) from the hashtags catalog */
  hashtagIds: number[];
  isAnonymous: boolean;
  anonymousName?: string;
  /** danh_hieu field — optional title text */
  danhHieu?: string;
}

export interface CreateKudoResult {
  kudosId: string;
}

/**
 * Inserts a kudos row with its hashtags and optional images.
 * Images are provided as a FileList-compatible iterable from FormData.
 * Pass null / empty when there are no image attachments.
 */
export async function createKudo(
  input: CreateKudoInput,
  imageFiles: File[] = [],
): Promise<CreateKudoResult> {
  const client = await createClient();

  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) throw new Error("Unauthenticated");

  // 1. Insert the kudos row — sender_id is always the authenticated user.
  const { data: kudosData, error: kudosError } = await client
    .from("kudos")
    .insert({
      sender_id: user.id,
      receiver_id: input.receiverId,
      message: input.message,
      is_anonymous: input.isAnonymous,
      anonymous_name: input.isAnonymous ? (input.anonymousName ?? null) : null,
      danh_hieu: input.danhHieu ?? null,
    })
    .select("id")
    .single();

  if (kudosError || !kudosData) {
    throw new Error(`Failed to insert kudos: ${kudosError?.message ?? "no data"}`);
  }

  const kudosId = kudosData.id;

  // 2. Insert hashtag junction rows (if any).
  if (input.hashtagIds.length > 0) {
    const { error: hashtagError } = await client.from("kudos_hashtags").insert(
      input.hashtagIds.map((hid) => ({ kudos_id: kudosId, hashtag_id: hid })),
    );
    if (hashtagError) {
      throw new Error(`Failed to insert kudos_hashtags: ${hashtagError.message}`);
    }
  }

  // 3. Upload images and insert kudos_images rows (if any).
  if (imageFiles.length > 0) {
    await uploadKudosImages(client, kudosId, imageFiles);
  }

  revalidatePath("/sun-kudos");

  return { kudosId };
}

// ---------------------------------------------------------------------------
// Internal: upload files to Storage and insert kudos_images rows
// ---------------------------------------------------------------------------

async function uploadKudosImages(
  client: Awaited<ReturnType<typeof createClient>>,
  kudosId: string,
  files: File[],
): Promise<void> {
  const imageRows: Array<{ kudos_id: string; url: string; sort_idx: number }> = [];

  const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
  const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      throw new Error(
        `File "${file.name}" has unsupported type "${file.type}". Allowed: JPEG, PNG, WebP.`,
      );
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new Error(
        `File "${file.name}" exceeds the 5 MB size limit (${(file.size / 1024 / 1024).toFixed(1)} MB).`,
      );
    }

    const ext = file.name.split(".").pop() ?? "jpg";
    const storagePath = `${kudosId}/${i}-${Date.now()}.${ext}`;

    const { error: uploadError } = await client.storage
      .from("kudos-images")
      .upload(storagePath, file, { upsert: false, contentType: file.type });

    if (uploadError) {
      throw new Error(`Image upload failed (${file.name}): ${uploadError.message}`);
    }

    const {
      data: { publicUrl },
    } = client.storage.from("kudos-images").getPublicUrl(storagePath);

    imageRows.push({ kudos_id: kudosId, url: publicUrl, sort_idx: i });
  }

  if (imageRows.length > 0) {
    const { error: imgRowError } = await client
      .from("kudos_images")
      .insert(imageRows);
    if (imgRowError) {
      throw new Error(`Failed to insert kudos_images: ${imgRowError.message}`);
    }
  }
}
