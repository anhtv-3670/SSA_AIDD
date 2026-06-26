-- =============================================================================
-- 0006: Performance indexes
-- All indexes use IF NOT EXISTS for idempotency across db resets.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- kudos — hot paths: feed (order by created_at), per-user sent/received feeds
-- ---------------------------------------------------------------------------
create index if not exists idx_kudos_receiver_id
  on public.kudos (receiver_id);

create index if not exists idx_kudos_sender_id
  on public.kudos (sender_id);

-- Feed ordering: most recent first.
create index if not exists idx_kudos_created_at_desc
  on public.kudos (created_at desc);

-- Combined index for per-user received feed with ordering (covers profile page query).
create index if not exists idx_kudos_receiver_created_at
  on public.kudos (receiver_id, created_at desc);

-- Combined index for per-user sent feed.
create index if not exists idx_kudos_sender_created_at
  on public.kudos (sender_id, created_at desc);

-- ---------------------------------------------------------------------------
-- hearts — like-count aggregation and "liked-by-me" lookup
-- ---------------------------------------------------------------------------
create index if not exists idx_hearts_kudos_id
  on public.hearts (kudos_id);

-- Lookup "did this user heart this kudos" (used in feed rendering).
create index if not exists idx_hearts_user_kudos
  on public.hearts (user_id, kudos_id);

-- ---------------------------------------------------------------------------
-- kudos_hashtags — tag filtering on the feed
-- ---------------------------------------------------------------------------
create index if not exists idx_kudos_hashtags_kudos_id
  on public.kudos_hashtags (kudos_id);

create index if not exists idx_kudos_hashtags_hashtag_id
  on public.kudos_hashtags (hashtag_id);

-- ---------------------------------------------------------------------------
-- kudos_images — images for a given kudos
-- ---------------------------------------------------------------------------
create index if not exists idx_kudos_images_kudos_id
  on public.kudos_images (kudos_id);

-- ---------------------------------------------------------------------------
-- badge_collections — per-user badge gallery
-- ---------------------------------------------------------------------------
create index if not exists idx_badge_collections_user_id
  on public.badge_collections (user_id);

-- ---------------------------------------------------------------------------
-- profiles — dept filtering (future use; cheap to add now)
-- ---------------------------------------------------------------------------
create index if not exists idx_profiles_dept_code
  on public.profiles (dept_code);
