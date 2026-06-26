---
status: implemented
authored_by: takumi
created: 2026-06-25
fcode: F012
lang: vi
---

# F012_SupabaseBackend — Business Context

## Why It Matters

Trước F012, mọi tính năng (F002–F011) đều chạy trên mock tĩnh: dữ liệu hardcode, không persistence,
không kiểm soát quyền. F012 thay thế toàn bộ lớp mock bằng Postgres backend thực sự (Supabase local),
đưa ứng dụng từ prototype sang một hệ thống có trạng thái thực — kudos được ghi vào DB, likes được
persist, secret box mở bằng RPC phía server, profile hiển thị số liệu thật.

Phạm vi rộng nhất trong mọi tính năng: chạm vào schema, RLS, trigger, RPC, seed data, data-access
layer, và từng điểm wiring trên frontend. Mọi tính năng đã ship đều được cập nhật.

## Who Uses It

Đây là tính năng backend/infrastructure — không có người dùng end-user trực tiếp. Hưởng lợi gián
tiếp:

- **Người dùng đã đăng nhập** (mọi feature): thấy dữ liệu thật, tương tác persist.
- **Người gửi kudos** (F006): kudo được lưu DB, trigger kích hoạt secret box cho người nhận.
- **Người nhận kudos** (F011): nhận box thực, mở box gọi RPC authoritative, badge được record.
- **Người xem profile** (F007): thấy stats thật (received/sent/hearts), hero tier suy ra từ dữ liệu.

## What Changed

1. **Schema + RLS**: 12 bảng public, RLS bật toàn bộ, 7 migration files (0001–0007).
2. **Seed**: catalog tĩnh (departments/hashtags/hero_tiers/awards/badges) + demo profiles + kudos
   mẫu — đủ để demo ngay sau `supabase db reset`.
3. **Data-access layer** (`lib/data/*`): 9 module typed helpers, adapter từ DB row → mock shapes
   hiện có; 36 unit test mapper.
4. **Frontend wiring**: F002/F003 awards đọc DB; F005 board + likes real; F006 submit insert DB +
   Storage; F007 profile stats + tiers + badges thật; F011 secret box gọi RPC.
5. **Least-privilege** (migration 0007): revoke public execute trên 3 SECURITY DEFINER functions;
   revoke direct UPDATE trên secret_boxes từ authenticated.

## Scope

- **Trong scope**: local Supabase (API :54321, DB :54322); tất cả tính năng đã ship (F002–F011 trừ F001/F004/F008/F009/F010 không cần data).
- **Ngoài scope**: award winners/admin panel, per-user profile routes `/profile/[id]`, notifications,
  realtime subscriptions, spam-report UI, pagination vô hạn, production deployment.
- **Auth (F001)**: đã là backend thật — không rebuild trong F012.
