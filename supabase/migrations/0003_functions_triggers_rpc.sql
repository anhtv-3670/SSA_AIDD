-- =============================================================================
-- 0003: Functions, triggers, and RPC
-- All privileged functions use SECURITY DEFINER so they can bypass RLS when
-- performing server-authoritative mutations (box count, badge award).
-- =============================================================================

-- ---------------------------------------------------------------------------
-- handle_new_user()
-- Fires AFTER INSERT on auth.users.
-- Creates the matching profiles row and an empty secret_boxes row.
-- ON CONFLICT DO NOTHING makes it safe to re-run (idempotent seed re-insert).
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_full_name      text;
  v_avatar_initial text;
begin
  -- Extract full_name from raw_user_meta_data; fall back to email local-part.
  v_full_name := coalesce(
    nullif(trim(new.raw_user_meta_data->>'full_name'), ''),
    split_part(new.email, '@', 1)
  );

  -- Avatar initial: first character of the resolved full_name, upper-cased.
  v_avatar_initial := upper(left(v_full_name, 1));

  insert into public.profiles (id, email, full_name, avatar_initial)
  values (new.id, new.email, v_full_name, v_avatar_initial)
  on conflict (id) do nothing;

  insert into public.secret_boxes (user_id, unopened_count)
  values (new.id, 0)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

-- Attach trigger to auth.users (drop first for idempotency on repeated resets).
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- on_kudos_insert()
-- Fires AFTER INSERT on public.kudos.
-- Increments the receiver's secret_boxes.unopened_count by 1.
-- Uses UPSERT so a missing box row (shouldn't happen in normal flow) is
-- created rather than silently failing.
-- ---------------------------------------------------------------------------
create or replace function public.on_kudos_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.secret_boxes (user_id, unopened_count, updated_at)
  values (new.receiver_id, 1, now())
  on conflict (user_id) do update
    set unopened_count = secret_boxes.unopened_count + 1,
        updated_at     = now();

  return new;
end;
$$;

drop trigger if exists on_kudos_insert on public.kudos;
create trigger on_kudos_insert
  after insert on public.kudos
  for each row execute function public.on_kudos_insert();

-- ---------------------------------------------------------------------------
-- open_secret_box()
-- RPC called by authenticated clients to open one secret box.
-- SECURITY DEFINER: runs as the function owner (postgres), bypassing RLS for
-- the internal SELECT FOR UPDATE / UPDATE / INSERT operations.
-- Returns: the badge row that was drawn.
-- Raises:  'no_box'    when unopened_count = 0
--          'no_badges' when the badges catalog is empty (shouldn't happen)
-- Atomicity: the FOR UPDATE lock prevents concurrent double-spend.
-- ---------------------------------------------------------------------------
create or replace function public.open_secret_box()
returns public.badges
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid         uuid;
  v_count       int;
  v_total_weight numeric;
  v_rand         numeric;
  v_cumulative   numeric := 0;
  v_badge_id     text;
  v_badge        public.badges;
begin
  v_uid := auth.uid();

  -- 1. Lock the caller's box row for the duration of this transaction.
  select unopened_count
  into   v_count
  from   public.secret_boxes
  where  user_id = v_uid
  for update;

  -- 2. Guard: no box row or count is zero.
  if v_count is null or v_count <= 0 then
    raise exception 'no_box' using hint = 'unopened_count is zero or box does not exist';
  end if;

  -- 3. Decrement the count (CHECK constraint enforces >= 0 at commit).
  update public.secret_boxes
  set    unopened_count = unopened_count - 1,
         updated_at     = now()
  where  user_id = v_uid;

  -- 4. Weighted random draw over badges.weight (server-side, non-forgeable).
  --    Order is deterministic (weight desc, id asc) so ties resolve consistently.
  select sum(weight) into v_total_weight from public.badges;

  if v_total_weight is null or v_total_weight = 0 then
    raise exception 'no_badges' using hint = 'badges catalog is empty';
  end if;

  -- Scale a [0,1) random to total weight range.
  v_rand := random() * v_total_weight;

  -- Walk the cumulative distribution to find the winning badge.
  select id
  into   v_badge_id
  from   (
    select id,
           sum(weight) over (order by weight desc, id asc) as cumulative
    from   public.badges
  ) ranked
  where cumulative >= v_rand
  order by cumulative asc
  limit 1;

  -- Edge case: rounding pushed rand past all cumulative values; take the last badge.
  if v_badge_id is null then
    select id into v_badge_id
    from   public.badges
    order by weight desc, id asc
    limit 1;
  end if;

  -- 5. Record the won badge.
  insert into public.badge_collections (user_id, badge_id)
  values (v_uid, v_badge_id);

  -- 6. Return the full badge row to the caller.
  select * into v_badge from public.badges where id = v_badge_id;
  return v_badge;
end;
$$;

-- ---------------------------------------------------------------------------
-- current_hero_tier(received int)
-- Pure helper: maps a received-kudos count to the matching hero_tiers row.
-- received = 0 falls into New (min_received = 1 in seed? — use New tier for 0).
-- ---------------------------------------------------------------------------
create or replace function public.current_hero_tier(received int)
returns public.hero_tiers
language sql
stable
security definer
set search_path = public
as $$
  select *
  from   public.hero_tiers
  where  received >= min_received
    and  received <= coalesce(max_received, 2147483647)
  order  by min_received desc
  limit  1;
$$;

-- ---------------------------------------------------------------------------
-- profile_stats(uid uuid)
-- Returns aggregated stats for a given user plus their derived hero tier name.
-- SECURITY DEFINER lets it read across tables regardless of calling user's RLS.
-- ---------------------------------------------------------------------------
create or replace function public.profile_stats(uid uuid)
returns table (
  kudos_received  bigint,
  kudos_sent      bigint,
  hearts_received bigint,
  boxes_opened    bigint,
  boxes_unopened  int,
  hero_tier_name  text
)
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_received      bigint;
  v_sent          bigint;
  v_hearts        bigint;
  v_opened        bigint;
  v_unopened      int;
  v_tier_name     text;
begin
  select count(*) into v_received
  from   public.kudos
  where  receiver_id = uid;

  select count(*) into v_sent
  from   public.kudos
  where  sender_id = uid;

  select count(*) into v_hearts
  from   public.hearts h
  join   public.kudos  k on k.id = h.kudos_id
  where  k.receiver_id = uid;

  select count(*) into v_opened
  from   public.badge_collections
  where  user_id = uid;

  select unopened_count into v_unopened
  from   public.secret_boxes
  where  user_id = uid;

  select name into v_tier_name
  from   public.current_hero_tier(v_received::int);

  return query select
    v_received,
    v_sent,
    v_hearts,
    v_opened,
    coalesce(v_unopened, 0),
    v_tier_name;
end;
$$;
