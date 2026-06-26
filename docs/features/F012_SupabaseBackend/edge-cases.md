---
status: implemented
authored_by: takumi
created: 2026-06-25
fcode: F012
lang: vi
---

# F012_SupabaseBackend — Edge Cases

## RLS Negatives (proven)

| Scenario | Input | Expected | Severity | Verified |
|----------|-------|----------|----------|----------|
| Insert kudos hộ người khác | `sender_id != auth.uid()` | RLS policy `sender_id = auth.uid()` block — PostgREST 403 | high | psql verify |
| Sửa secret_boxes trực tiếp | `UPDATE secret_boxes SET unopened_count = 999` | REVOKE UPDATE on secret_boxes from authenticated (0007) → permission denied | high | psql verify |
| Gọi open_secret_box() khi chưa đăng nhập (anon) | anon role EXECUTE | REVOKE execute from public (0007) → permission denied | high | psql verify |
| Đọc badge_collections của user khác | SELECT với user_id khác auth.uid() | RLS `user_id = auth.uid()` → empty result (không lỗi, không lộ) | medium | policy check |
| Đọc secret_boxes của user khác | SELECT với user_id khác auth.uid() | RLS `user_id = auth.uid()` → empty result | medium | policy check |

## Box State & Race Conditions

| Scenario | Input | Expected | Severity |
|----------|-------|----------|----------|
| Mở box khi count = 0 | `open_secret_box()` với unopened_count = 0 | RPC raise exception `"no_box"`; client nhận error chứa `"no_box"` → hiển thị empty state | high |
| Double-spend (mở box đồng thời) | 2 requests cùng lúc với count = 1 | `SELECT FOR UPDATE` trong RPC serialise; một request thành công, một nhận `"no_box"` | high |
| count âm | trigger fail / count = 0 | CHECK constraint `unopened_count >= 0` trên bảng → không thể xảy ra | high |

## Upload Validation

| Scenario | Input | Expected | Severity |
|----------|-------|----------|----------|
| File không phải ảnh | `text/plain`, `application/pdf` | Server-side allowlist trong `uploadKudosImages` reject trước Storage.upload() | medium |
| File quá lớn | > 5 MB | Server-side size cap (5 × 1024 × 1024) reject với descriptive error | medium |
| Hơn 5 ảnh | > 5 files | UI block thêm file khi đủ 5; server không enforce riêng (defense-in-depth) | low |
| Storage upload thất bại | network error / bucket ACL | `createKudo` propagate error; kudos row đã insert không bị rollback (known limitation — partial state) | medium |

## Data Integrity

| Scenario | Input | Expected | Severity |
|----------|-------|----------|----------|
| Đăng ký user mới | insert vào auth.users | Trigger `handle_new_user` tự tạo profiles row + secret_boxes row (count 0) | high |
| Profile không tồn tại khi gửi kudos | sender_id orphan | FK constraint `kudos.sender_id → profiles.id` prevent | high |
| Kudo không có hashtag | submit không chọn hashtag | Validation phía client require 1–5; server không enforce (defense-in-depth) | medium |
| Anonymous kudo | is_anonymous = true | sender_id được lưu DB (toàn vẹn + RLS); mapper `mapAnonymousSender()` che identity khi render feed | medium |

## Documented Limitations (không phải bug)

| Limitation | Ghi chú |
|-----------|---------|
| `profile_stats(uid)` cross-user read | Authenticated user CÓ THỂ gọi `profile_stats(other_uid)`. Per-user profile visibility deferred. |
| Self-kudos allowed | Không có constraint ngăn `sender_id = receiver_id`. Deferred. |
| Per-user routes `/profile/[id]` | Ngoài scope — tất cả profile link trỏ `/profile` (profile bản thân). |
| Award winners | Bảng winners không có pass này. `awards` là catalog read-only. |
| Realtime subscriptions | Không có — feed refresh cần manual reload hoặc `revalidatePath`. |
| Hashtag filter in-process | `getKudosFeed` với hashtag filter apply post-map (PostgREST limitation). Phù hợp demo scale. |
| Partial upload rollback | Nếu Storage upload fail sau khi kudos row đã insert → kudos tồn tại không có image. |
| `supabase gen types` CLI regression | `supabase@2.107` fail `--local`; dùng `@2.90.x`. |
