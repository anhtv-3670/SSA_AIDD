---
status: implemented
authored_by: takumi
created: 2026-06-25
fcode: F012
lang: vi
---

# F012_SupabaseBackend — Entity Model & Frontend Wiring

> Backend-only feature — không có màn hình UI riêng. Tài liệu này ghi lại entity model và bản đồ
> wiring từ từng tính năng frontend vào backend F012.

## Entity Model (12 bảng public)

| Bảng | Loại | Mô tả |
|------|------|-------|
| `profiles` | per-user | 1-1 với auth.users; id, email, full_name, dept_code FK, avatar_initial, created_at. Auto-tạo qua trigger `handle_new_user`. |
| `departments` | catalog (static) | code PK, name. Seed: CECV10, CEVC10, DXD01, PMG02, HRD01. |
| `hashtags` | catalog (static) | id, tag (unique). Seed 9 tag: #Dedicated, #Inspiring, #Teamwork, #Leadership, #Technical, #Communication, #Mentoring, #Innovation, #Supportive. |
| `hero_tiers` | catalog (static) | id, name, min_received, max_received, color. 4 bậc: New Hero (1-4), Rising Hero (5-9), Super Hero (10-20), Legend Hero (21+). |
| `awards` | catalog (static, read-only) | id, name, description, quantity, prize_value, ring_color, image, sort_idx. Seed 6 giải F003. |
| `badges` | catalog (static) | id, name, image, weight (numeric). Seed 6 badge với tổng weight = 1.00. |
| `kudos` | transactional | id, sender_id FK, receiver_id FK, danh_hieu, message, is_anonymous, anonymous_name, is_flagged, created_at. |
| `kudos_hashtags` | junction | kudos_id FK, hashtag_id FK (PK kép). |
| `kudos_images` | per-kudos | id, kudos_id FK, url, sort_idx. URL trỏ Storage bucket `kudos-images`. |
| `hearts` | reaction | kudos_id FK, user_id FK (PK kép — 1 ❤️/user/kudos). |
| `secret_boxes` | per-user | user_id PK FK, unopened_count int default 0, updated_at. |
| `badge_collections` | per-user earned | id, user_id FK, badge_id FK, awarded_at. |

## Per-Feature Wiring Map

| Feature | Bảng đọc | Bảng ghi / RPC | Ghi chú |
|---------|----------|----------------|---------|
| **F002 Home** | `awards` | — | `getAwards()` thay `award-data.ts` tĩnh |
| **F003 Award System** | `awards` | — | `getAwards()` thay `award-data.ts` tĩnh |
| **F005 Kudos Live Board** | `kudos` + joins (profiles, hashtags, images, hearts), `profiles` (stats) | `hearts` (INSERT/DELETE) | Feed real; like/unlike optimistic; filter post-map |
| **F006 Write Kudo** | `profiles` (recipients), `hashtags` (catalog) | `kudos`, `kudos_hashtags`, `kudos_images` (Storage upload) | Server Action `createKudo`; trigger on_kudos_insert kích hoạt secret_boxes |
| **F007 Profile** | `profiles`, `kudos` (sent/received), `hearts`, `secret_boxes`, `badge_collections`, `hero_tiers` | — | `getProfile()` + `profile_stats()` RPC |
| **F011 Secret Box** | `secret_boxes` | `open_secret_box()` RPC → `badge_collections` | Authoritative server-side random; `draw-badge.ts` giữ lại chỉ để test |

## Kept-Decorative Mock

Các hằng số sau giữ lại trong code với comment `// presentational — not backed by DB this pass`:

- `spotlightNames`, `tickerEntries` trong `app/sun-kudos/kudos-data.ts` — không có bảng tương ứng.
- `giftRecipients` deprecated stub — chỉ để `kudos-filter.test.ts` không break.

## Storage

Bucket `kudos-images`: public read, authenticated write. URL được lưu trong bảng `kudos_images.url`.
Upload xảy ra trong Server Action `createKudo` (sau khi insert row kudos để lấy `kudos_id`).

## User Journey

```
Người dùng gửi kudos (F006)
  → Server Action createKudo: insert kudos + hashtags + upload images
  → trigger on_kudos_insert: secret_boxes.unopened_count += 1 cho receiver

Người nhận mở secret box (F011)
  → Server Action openBox → open_secret_box() RPC
    → atomic: unopened_count -= 1; weighted-random badge insert badge_collections
    → trả BadgeReward về UI
```
