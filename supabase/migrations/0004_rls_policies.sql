-- =============================================================================
-- 0004: Row Level Security — enable + policies + explicit GRANTs
--
-- auto_expose_new_tables is unset in config.toml, so PostgREST does NOT
-- expose new tables to anon/authenticated automatically.
-- Every table needs explicit GRANTs in addition to RLS policies.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Enable RLS on all 12 public tables
-- ---------------------------------------------------------------------------
alter table public.profiles          enable row level security;
alter table public.departments       enable row level security;
alter table public.hashtags          enable row level security;
alter table public.hero_tiers        enable row level security;
alter table public.awards            enable row level security;
alter table public.badges            enable row level security;
alter table public.kudos             enable row level security;
alter table public.kudos_hashtags    enable row level security;
alter table public.kudos_images      enable row level security;
alter table public.hearts            enable row level security;
alter table public.secret_boxes      enable row level security;
alter table public.badge_collections enable row level security;

-- ---------------------------------------------------------------------------
-- profiles
-- SELECT: any authenticated user can read all profiles (public feed needs names).
-- INSERT: blocked — trigger only (no client INSERT policy intentionally).
-- UPDATE: own row only.
-- ---------------------------------------------------------------------------
drop policy if exists "profiles_select_authenticated" on public.profiles;
create policy "profiles_select_authenticated"
  on public.profiles for select
  to authenticated
  using (true);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (id = auth.uid());

-- ---------------------------------------------------------------------------
-- catalog tables: departments, hashtags, hero_tiers, awards, badges
-- Read-only for authenticated users; no INSERT/UPDATE/DELETE policies.
-- ---------------------------------------------------------------------------
drop policy if exists "departments_select_authenticated" on public.departments;
create policy "departments_select_authenticated"
  on public.departments for select
  to authenticated
  using (true);

drop policy if exists "hashtags_select_authenticated" on public.hashtags;
create policy "hashtags_select_authenticated"
  on public.hashtags for select
  to authenticated
  using (true);

drop policy if exists "hero_tiers_select_authenticated" on public.hero_tiers;
create policy "hero_tiers_select_authenticated"
  on public.hero_tiers for select
  to authenticated
  using (true);

drop policy if exists "awards_select_authenticated" on public.awards;
create policy "awards_select_authenticated"
  on public.awards for select
  to authenticated
  using (true);

drop policy if exists "badges_select_authenticated" on public.badges;
create policy "badges_select_authenticated"
  on public.badges for select
  to authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- kudos
-- SELECT: any authenticated user (public feed).
-- INSERT: sender_id must equal auth.uid() — callers cannot post on others' behalf.
-- UPDATE/DELETE: not permitted this pass (kudos are immutable once sent).
-- ---------------------------------------------------------------------------
drop policy if exists "kudos_select_authenticated" on public.kudos;
create policy "kudos_select_authenticated"
  on public.kudos for select
  to authenticated
  using (true);

drop policy if exists "kudos_insert_own_sender" on public.kudos;
create policy "kudos_insert_own_sender"
  on public.kudos for insert
  to authenticated
  with check (sender_id = auth.uid());

-- ---------------------------------------------------------------------------
-- kudos_hashtags
-- SELECT: any authenticated user.
-- INSERT: only when the parent kudos was sent by the current user.
-- ---------------------------------------------------------------------------
drop policy if exists "kudos_hashtags_select_authenticated" on public.kudos_hashtags;
create policy "kudos_hashtags_select_authenticated"
  on public.kudos_hashtags for select
  to authenticated
  using (true);

drop policy if exists "kudos_hashtags_insert_own_kudos" on public.kudos_hashtags;
create policy "kudos_hashtags_insert_own_kudos"
  on public.kudos_hashtags for insert
  to authenticated
  with check (
    exists (
      select 1 from public.kudos k
      where  k.id = kudos_id
        and  k.sender_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- kudos_images
-- SELECT: any authenticated user.
-- INSERT: only when the parent kudos was sent by the current user.
-- ---------------------------------------------------------------------------
drop policy if exists "kudos_images_select_authenticated" on public.kudos_images;
create policy "kudos_images_select_authenticated"
  on public.kudos_images for select
  to authenticated
  using (true);

drop policy if exists "kudos_images_insert_own_kudos" on public.kudos_images;
create policy "kudos_images_insert_own_kudos"
  on public.kudos_images for insert
  to authenticated
  with check (
    exists (
      select 1 from public.kudos k
      where  k.id = kudos_id
        and  k.sender_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- hearts
-- SELECT: any authenticated user (like count is public).
-- INSERT: user_id must match auth.uid() — cannot heart on behalf of another.
-- DELETE: own row only (un-like).
-- ---------------------------------------------------------------------------
drop policy if exists "hearts_select_authenticated" on public.hearts;
create policy "hearts_select_authenticated"
  on public.hearts for select
  to authenticated
  using (true);

drop policy if exists "hearts_insert_own" on public.hearts;
create policy "hearts_insert_own"
  on public.hearts for insert
  to authenticated
  with check (user_id = auth.uid());

drop policy if exists "hearts_delete_own" on public.hearts;
create policy "hearts_delete_own"
  on public.hearts for delete
  to authenticated
  using (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- secret_boxes
-- SELECT: own row only (box count is private).
-- UPDATE: own row only — but actual count mutations go through SECURITY DEFINER
--         trigger/RPC which bypass RLS entirely, so this policy is a safety net
--         for any direct client UPDATE attempts.
-- INSERT: blocked — trigger only.
-- ---------------------------------------------------------------------------
drop policy if exists "secret_boxes_select_own" on public.secret_boxes;
create policy "secret_boxes_select_own"
  on public.secret_boxes for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "secret_boxes_update_own" on public.secret_boxes;
create policy "secret_boxes_update_own"
  on public.secret_boxes for update
  to authenticated
  using (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- badge_collections
-- SELECT: own badges only.
-- INSERT: blocked — open_secret_box() RPC only (SECURITY DEFINER bypasses RLS).
-- ---------------------------------------------------------------------------
drop policy if exists "badge_collections_select_own" on public.badge_collections;
create policy "badge_collections_select_own"
  on public.badge_collections for select
  to authenticated
  using (user_id = auth.uid());

-- =============================================================================
-- Explicit GRANTs to PostgREST roles
-- Required because auto_expose_new_tables is not set.
-- =============================================================================

-- Catalog tables: SELECT only for authenticated (and anon for any future public pages).
grant select on public.departments    to authenticated;
grant select on public.hashtags       to authenticated;
grant select on public.hero_tiers     to authenticated;
grant select on public.awards         to authenticated;
grant select on public.badges         to authenticated;

-- profiles: select (all authenticated), update (own — RLS enforces).
grant select, update on public.profiles to authenticated;

-- kudos + related: insert allowed; RLS enforces who can insert what.
grant select, insert on public.kudos          to authenticated;
grant select, insert on public.kudos_hashtags to authenticated;
grant select, insert on public.kudos_images   to authenticated;

-- hearts: select, insert, delete (un-like).
grant select, insert, delete on public.hearts to authenticated;

-- secret_boxes: select + update (RLS restricts to own row; mutations via RPC).
grant select, update on public.secret_boxes to authenticated;

-- badge_collections: select only for clients (insert via RPC which is DEFINER).
grant select on public.badge_collections to authenticated;

-- Functions callable by authenticated users.
grant execute on function public.open_secret_box()                 to authenticated;
grant execute on function public.profile_stats(uuid)               to authenticated;
grant execute on function public.current_hero_tier(int)            to authenticated;
