-- =============================================================================
-- 0007: Least-privilege hardening
--
-- Removes EXECUTE grants from the 'public' (anon) role for all SECURITY DEFINER
-- functions. The 0004 migration already grants these to 'authenticated'; we keep
-- those and only revoke from 'public'.
--
-- Also revokes the UPDATE grant on secret_boxes from 'authenticated'. All count
-- mutations go through SECURITY DEFINER triggers/RPCs which bypass RLS, so no
-- legitimate client code needs direct UPDATE access. SELECT is preserved so the
-- getSecretBoxState query can still read unopened_count.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Revoke SECURITY DEFINER functions from the anon (public) role
-- ---------------------------------------------------------------------------
revoke execute on function public.open_secret_box()       from public;
revoke execute on function public.profile_stats(uuid)     from public;
revoke execute on function public.current_hero_tier(int)  from public;

-- ---------------------------------------------------------------------------
-- Remove direct UPDATE on secret_boxes for authenticated clients.
-- Mutations are authoritative through the RPC/trigger (SECURITY DEFINER),
-- so no client should ever UPDATE this table directly.
-- SELECT remains so clients can read their own unopened_count.
-- ---------------------------------------------------------------------------
revoke update on public.secret_boxes from authenticated;
