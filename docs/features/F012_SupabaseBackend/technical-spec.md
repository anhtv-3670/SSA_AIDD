---
status: implemented
authored_by: takumi
created: 2026-06-25
fcode: F012
lang: vi
---

# F012_SupabaseBackend — Technical Spec

## Overview

Backend Supabase đầy đủ cho SAA Kudos: 12 bảng Postgres + RLS + triggers + RPC + seed + Storage;
data-access layer `lib/data/*`; wiring toàn bộ frontend từ mock → dữ liệu thật. Target: local
Supabase (API http://127.0.0.1:54321, DB postgresql://postgres:postgres@127.0.0.1:54322/postgres).

## Polymorphic Behavior

None — backend infrastructure.

## Cross-Cutting Logic

### Requirements

- FR-1: 12 bảng public tồn tại với đúng columns, FKs, CHECKs; `supabase db reset` exit 0.
- FR-2: RLS bật trên toàn bộ 12 bảng; mọi bảng có ít nhất 1 policy.
- FR-3: Trigger `on_auth_user_created` tự tạo `profiles` + `secret_boxes` row khi user đăng ký.
- FR-4: Trigger `on_kudos_insert` tự cộng +1 `secret_boxes.unopened_count` cho receiver.
- FR-5: RPC `open_secret_box()` (SECURITY DEFINER): atomic decrement + weighted-random badge + insert `badge_collections`; error nếu count = 0.
- FR-6: `profile_stats(uid)` RPC/view trả `kudos_received`, `kudos_sent`, `hearts_received`, `boxes_opened`, `boxes_unopened`, `hero_tier_name`.
- FR-7: `current_hero_tier(count)` function suy ra hero tier từ số kudos nhận — không lưu cứng vào profile.
- FR-8: Seed đủ: 5 departments, 9 hashtags, 4 hero_tiers, 6 awards, 6 badges; 6 profiles; 15 kudos demo; 13 hearts.
- FR-9: `lib/supabase/database.types.ts` generated (12 tables + RPCs); tsc --noEmit exit 0.
- FR-10: `lib/data/*` (9 modules) — typed adapters từ DB rows → existing mock shapes; 36 mapper unit tests green.
- FR-11: F002/F003 awards đọc `awards` bảng qua `getAwards()`; không còn dùng `award-data.ts`.
- FR-12: F005 feed gọi `getKudosFeed()`; like/unlike gọi Server Actions `likeKudo`/`unlikeKudo`; optimistic UI với rollback.
- FR-13: F006 submit gọi Server Action `createKudo`: insert kudos + hashtags + upload Storage + `kudos_images` rows.
- FR-14: F007 profile đọc `getProfile()` + `profile_stats()` — stats thật, hero tier suy ra, badge collection thật.
- FR-15: F011 secret box count từ `secret_boxes`; mở gọi `open_secret_box()` RPC (authoritative).

### Business Rules

- BR-1: `sender_id` luôn được lưu trong `kudos` dù `is_anonymous = true` — toàn vẹn dữ liệu + RLS chính xác; mapper `mapAnonymousSender()` che identity ở tầng hiển thị.
- BR-2: Hero tier suy ra (không lưu cứng): `current_hero_tier(received_count)` tra `hero_tiers` catalog. Vocabulary: New Hero / Rising Hero / Super Hero / Legend Hero.
- BR-3: Badge weight sum = 1.00 (stay-gold .30 / flow-to-horizon .25 / touch-of-light .20 / beyond-the-boundary .10 / revival .10 / root-further .05). Random authoritative phía server, không tin client roll.
- BR-4: Kudo immutable sau khi tạo (pass này) — không có UPDATE/DELETE policy trên `kudos`.
- BR-5: 1 heart/user/kudos (PK kép). Un-like = DELETE own row.
- BR-6: `secret_boxes.unopened_count` chỉ thay đổi qua trigger (insert kudos) hoặc RPC (`open_secret_box`). Authenticated role KHÔNG có EXECUTE trực tiếp UPDATE trên cột này.

### Decision Logic

- Hashtag filter áp dụng in-process sau map (không dùng embedded `.eq()` của PostgREST — không hỗ trợ OR across embedded relations mà không có view).
- `hearts[]` embed trong kudos query: một round-trip duy nhất; mapper tính `likeCount = hearts.length` và `liked = hearts.some(h => h.user_id === currentUserId)`.

### State Machines

None (RPC `open_secret_box` là atomic DB transaction, không phải state machine app).

### Algorithms

- ALG-hero-tier: `current_hero_tier(n)` tra `hero_tiers` → `WHERE n BETWEEN min_received AND max_received` (max_received = NULL cho Legend Hero nghĩa là unbounded).
- ALG-open-secret-box: `open_secret_box()` SECURITY DEFINER — (1) SELECT FOR UPDATE secret_boxes WHERE user_id = auth.uid() AND unopened_count > 0; (2) UPDATE unopened_count -= 1; (3) random() weighted draw qua `badges.weight` cumulative; (4) INSERT badge_collections; (5) RETURN badge record.
- ALG-weighted-draw: server-side `random()` so với cumulative weight thứ tự badges → badge đầu tiên có `cumulative > roll` được chọn.

### External Integrations

- INT-supabase-db: Postgres 15 local (`:54322`). Schema in `supabase/migrations/*.sql`.
- INT-supabase-storage: bucket `kudos-images`, public read / authenticated write. Upload trong `kudos-mutations.ts` — MIME allowlist (jpeg/png/webp), max 5 MB.
- INT-supabase-rpc: `open_secret_box()`, `profile_stats(uid)`, `current_hero_tier(n)` — EXECUTE chỉ granted cho `authenticated` role.

### Verification

- `supabase db reset` exit 0; 12 tables; RLS = t; 19 policies; 2 triggers; 5 functions; kudos-images bucket public.
- `npx tsc --noEmit` exit 0; 457 tests green (vitest run); build clean.

## Schema & Migrations

| File | Nội dung |
|------|----------|
| `0001_extensions_and_catalogs.sql` | pgcrypto; tables: departments, hashtags, hero_tiers, awards, badges |
| `0002_core_tables.sql` | profiles, kudos, kudos_hashtags, kudos_images, hearts, secret_boxes, badge_collections |
| `0003_functions_triggers_rpc.sql` | handle_new_user(), on_kudos_insert(), open_secret_box() RPC, current_hero_tier(), profile_stats() |
| `0004_rls_policies.sql` | ENABLE ROW LEVEL SECURITY trên 12 bảng; 19 named policies; GRANTs to authenticated |
| `0005_storage_bucket.sql` | kudos-images bucket (public=true); storage.objects policies |
| `0006_indexes.sql` | 13 indexes (kudos feed, hearts, hashtags, images, badge_collections, profiles.dept_code) |
| `0007_least_privilege.sql` | REVOKE execute on 3 SECURITY DEFINER functions from public; REVOKE UPDATE secret_boxes from authenticated |

## Data-Access Layer (`lib/data/`)

| Module | Exports chính |
|--------|--------------|
| `types.ts` | TitleBadge, HeroTier, KudosPerson, KudosEntry, ProfileStats, ProfileData, AwardDetail, BadgeReward, BadgeCollectionSlot |
| `mappers.ts` | heroTierName, castTitleBadge, mapKudosRow, mapProfileStats, mapAward, mapBadge, … (pure functions, unit-tested) |
| `kudos-queries.ts` | getKudosFeed(client, opts?), getHighlightKudos(client, count?), getProfileKudos(client, uid, direction) |
| `hearts-mutations.ts` | likeKudo(kudosId), unlikeKudo(kudosId) — Server Actions |
| `kudos-mutations.ts` | createKudo(input, imageFiles?) — Server Action; upload + insert |
| `profile-queries.ts` | getProfileStats(client, uid), getBadgeCollection(client, uid), getProfile(client, uid?) |
| `secret-box.ts` | getSecretBoxState(client), openSecretBox(client) — gọi open_secret_box() RPC |
| `awards-queries.ts` | getAwards(client) |
| `catalog-queries.ts` | getHashtags, getDepartments, getHeroTiers, getBadges |

Generated types: `lib/supabase/database.types.ts` (564 lines, 12 tables + RPCs, via `npx supabase@2.90.x gen types typescript --local`).

## RLS Summary (per-table)

Xem `docs/system/permissions.md` § Per-table policy cho đầy đủ. Tóm tắt:

- Catalogs (departments, hashtags, hero_tiers, awards, badges): SELECT authenticated; no writes.
- profiles: SELECT authenticated; UPDATE own.
- kudos / kudos_hashtags / kudos_images: SELECT authenticated; INSERT với sender = auth.uid().
- hearts: SELECT authenticated; INSERT/DELETE own.
- secret_boxes: SELECT/ops own; writes via trigger/RPC only.
- badge_collections: SELECT own; INSERT via RPC only.

## User Stories

### US-1 — Gửi kudos persist thật
Là người dùng đã đăng nhập, tôi gửi kudos → row được ghi DB, hashtags junction được tạo, ảnh upload
Storage, trigger cộng 1 secret box cho receiver, feed hiển thị kudos mới.
- FR: FR-13, FR-4 — Acceptance: AC2 (spec).

### US-2 — Like kudos persist + optimistic
Là người dùng, tôi bấm ❤️ → hearts INSERT ngay (optimistic); likeCount tăng; unlike → DELETE + giảm.
- FR: FR-12 — Acceptance: AC3 (spec).

### US-3 — Profile hiển thị stats thật
Là người dùng, tôi xem profile → thấy số kudos nhận/gửi/hearts thật; hero tier đúng ngưỡng.
- FR: FR-14, FR-7 — Acceptance: AC4 (spec).

### US-4 — Mở secret box authoritative
Là người dùng, tôi mở secret box → RPC atomic trừ count + draw badge server-side; count = 0 thì chặn.
- FR: FR-15, FR-5 — Acceptance: AC5 (spec).

### Edge Cases

See edge-cases.md.

## Key Entities

Xem entity model đầy đủ ở screens.md (§ Entity Model).

## Artifact References

- Screens/entity model: screens.md.
- System docs: `docs/system/architecture.md` (data layer section), `docs/system/permissions.md` (RLS model).
- Spec nguồn: `plans/260625-1613-supabase-backend/spec/supabase-backend/spec.md`.
- Reports: `plans/reports/implementer-260625-1629-backend-foundation.md`, `implementer-260625-1635-seed-types.md`, `implementer-260625-1649-data-layer.md`, `implementer-260625-1656-wire-sun-kudos.md`, `reviewer-260625-1726-supabase-backend.md`, `implementer-260625-1729-review-fixes.md`.

## Source Code References

| Vai trò | Đường dẫn |
|---------|-----------|
| Migrations | `supabase/migrations/0001_*.sql` … `0007_*.sql` |
| Seed | `supabase/seed.sql` |
| Generated DB types | `lib/supabase/database.types.ts` |
| Data-access layer | `lib/data/` (9 modules) |
| Supabase clients | `lib/supabase/server.ts`, `lib/supabase/client.ts`, `lib/supabase/env.ts` |
| Awards wiring (F002/F003) | `app/home/page.tsx`, `app/he-thong-giai/page.tsx` |
| Kudos board wiring (F005) | `app/sun-kudos/page.tsx`, `app/sun-kudos/kudos-client-shell.tsx`, `app/sun-kudos/kudos-card.tsx` |
| Write-kudo Server Actions | `app/sun-kudos/write-kudo/write-kudo-actions.ts`, `write-kudo-catalog-actions.ts` |
| Secret-box Server Action | `app/sun-kudos/secret-box/secret-box-actions.ts` |
| FAB catalog load | `components/write-kudo-fab.tsx` |

## Unresolved Questions

- `kudos-queries.ts` (241 lines) — légèrement au-dessus de la limite 200 lignes; identifié pour code-simplifier pass.
- `dept` + `query` filters s'appliquent in-process post-fetch (limitation PostgREST sans view). Optimisation future: `kudos_feed` view avec colonnes calculées.
- `supabase gen types --local` nécessite `supabase@2.90.x` (régression CLI 2.107). Relancer avec `npx supabase@2.90.x gen types typescript --local` après chaque changement de schéma.
- Profile cross-user read (`profile_stats` d'un autre user) non restreint — voir edge-cases.md.

## Spec Documents

- [x] technical-spec.md
- [x] business-context.md
- [x] screens.md
- [x] edge-cases.md
