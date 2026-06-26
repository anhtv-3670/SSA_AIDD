-- =============================================================================
-- 0005: Storage — kudos-images bucket + object policies
-- =============================================================================

-- Create the bucket if it does not exist.
-- public = true means objects are readable without authentication via the
-- /storage/v1/object/public/... URL — no signed URL required for display.
insert into storage.buckets (id, name, public)
values ('kudos-images', 'kudos-images', true)
on conflict (id) do update set public = true;

-- ---------------------------------------------------------------------------
-- storage.objects RLS policies for kudos-images
-- ---------------------------------------------------------------------------

-- Public read: anyone (including unauthenticated) can view images in this bucket.
-- This is consistent with bucket.public = true and avoids generating signed URLs
-- for every kudos feed image render.
drop policy if exists "kudos_images_objects_public_select" on storage.objects;
create policy "kudos_images_objects_public_select"
  on storage.objects for select
  using (bucket_id = 'kudos-images');

-- Authenticated upload: any logged-in user may upload to this bucket.
-- KISS: no per-user path restriction this pass (path enforcement is phase-level
-- concern; RLS on kudos_images table already ties URLs to the sender's kudos).
drop policy if exists "kudos_images_objects_authenticated_insert" on storage.objects;
create policy "kudos_images_objects_authenticated_insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'kudos-images');

-- Authenticated update: allow replacing an existing object (e.g. re-upload).
drop policy if exists "kudos_images_objects_authenticated_update" on storage.objects;
create policy "kudos_images_objects_authenticated_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'kudos-images');
