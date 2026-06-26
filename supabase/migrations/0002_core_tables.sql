-- =============================================================================
-- 0002: Core application tables (user-facing, FK to auth.users / catalogs)
-- =============================================================================

-- ---------------------------------------------------------------------------
-- profiles
-- 1-1 with auth.users. Created automatically by handle_new_user() trigger.
-- On cascade delete: removing auth.users row removes profile (GDPR-friendly).
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id             uuid        primary key references auth.users (id) on delete cascade,
  email          text,
  full_name      text,
  dept_code      text        references public.departments (code),
  avatar_initial text,
  created_at     timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- kudos
-- Core content table. sender_id / receiver_id both reference profiles.
-- is_anonymous: sender_id is stored for RLS / integrity but hidden in UI.
-- danh_hieu: free-text title the sender assigns (not the hero tier).
-- is_flagged: moderation flag (admin sets; no client policy to flip it).
-- ---------------------------------------------------------------------------
create table if not exists public.kudos (
  id             uuid        primary key default gen_random_uuid(),
  sender_id      uuid        references public.profiles (id),
  receiver_id    uuid        references public.profiles (id),
  danh_hieu      text,
  message        text        not null,
  is_anonymous   boolean     not null default false,
  anonymous_name text,
  is_flagged     boolean     not null default false,
  created_at     timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- kudos_hashtags  (junction)
-- Composite PK prevents duplicate tag on same kudos.
-- CASCADE on kudos delete cleans up automatically.
-- ---------------------------------------------------------------------------
create table if not exists public.kudos_hashtags (
  kudos_id   uuid     not null references public.kudos (id) on delete cascade,
  hashtag_id smallint not null references public.hashtags (id),
  primary key (kudos_id, hashtag_id)
);

-- ---------------------------------------------------------------------------
-- kudos_images
-- Each kudos can have multiple images stored in Storage bucket kudos-images.
-- sort_idx controls display order.
-- ---------------------------------------------------------------------------
create table if not exists public.kudos_images (
  id       uuid    primary key default gen_random_uuid(),
  kudos_id uuid    not null references public.kudos (id) on delete cascade,
  url      text    not null,
  sort_idx int     not null default 0
);

-- ---------------------------------------------------------------------------
-- hearts  (reactions / likes)
-- Composite PK enforces 1 heart per user per kudos.
-- DELETE policy lets users un-like.
-- ---------------------------------------------------------------------------
create table if not exists public.hearts (
  kudos_id uuid not null references public.kudos (id) on delete cascade,
  user_id  uuid not null references public.profiles (id),
  primary key (kudos_id, user_id)
);

-- ---------------------------------------------------------------------------
-- secret_boxes
-- One row per user, maintained by server-side triggers and RPC only.
-- CHECK prevents the count going negative (double-spend guard at DB level).
-- ---------------------------------------------------------------------------
create table if not exists public.secret_boxes (
  user_id        uuid        primary key references public.profiles (id) on delete cascade,
  unopened_count int         not null default 0,
  updated_at     timestamptz not null default now(),
  constraint secret_boxes_count_non_negative check (unopened_count >= 0)
);

-- ---------------------------------------------------------------------------
-- badge_collections
-- Earned badges per user. Rows inserted only by open_secret_box() RPC.
-- ---------------------------------------------------------------------------
create table if not exists public.badge_collections (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        not null references public.profiles (id),
  badge_id   text        not null references public.badges (id),
  awarded_at timestamptz not null default now()
);
