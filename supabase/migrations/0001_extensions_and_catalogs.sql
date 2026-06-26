-- =============================================================================
-- 0001: Extensions + static catalog tables
-- No FK to auth.users here; catalogs are standalone and seeded in phase 02.
-- =============================================================================

-- pgcrypto provides gen_salt / crypt used in seed.sql (already available in
-- Supabase's bundled extensions, but explicit creation is idempotent).
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- departments
-- Static lookup: code is the natural PK (e.g. 'CECV10').
-- ---------------------------------------------------------------------------
create table if not exists public.departments (
  code text primary key,
  name text not null
);

-- ---------------------------------------------------------------------------
-- hashtags
-- Leading '#' stored in tag to match display values (e.g. '#Dedicated').
-- ---------------------------------------------------------------------------
create table if not exists public.hashtags (
  id   smallint generated always as identity primary key,
  tag  text     not null unique
);

-- ---------------------------------------------------------------------------
-- hero_tiers
-- Four tiers ordered by received-kudos threshold.
-- max_received null = unbounded (Legend tier).
-- ---------------------------------------------------------------------------
create table if not exists public.hero_tiers (
  id           smallint primary key,
  name         text     not null,
  min_received int      not null,
  max_received int      null,  -- null = no upper bound
  color        text     not null
);

-- ---------------------------------------------------------------------------
-- awards
-- Static catalog of year-end awards (read-only this pass).
-- id is a human-readable slug, e.g. 'top-talent'.
-- ---------------------------------------------------------------------------
create table if not exists public.awards (
  id          text primary key,
  name        text not null,
  description text,
  quantity    text,
  prize_value text,
  ring_color  text,
  image       text,
  sort_idx    int  not null default 0
);

-- ---------------------------------------------------------------------------
-- badges
-- Secret-box badges drawn by weighted random.
-- weight values sum to 1.00 (enforced by application seed, not DB constraint).
-- ---------------------------------------------------------------------------
create table if not exists public.badges (
  id     text    primary key,
  name   text    not null,
  image  text,
  weight numeric not null,
  constraint badges_weight_positive check (weight >= 0)
);
