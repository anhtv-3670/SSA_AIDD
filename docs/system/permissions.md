---
status: implemented
authored_by: takumi
created: 2026-06-23
lang: vi
doc_layer: system
---

# Mô hình xác thực & phân quyền

## Trạng thái xác thực

Hệ thống hiện chỉ phân biệt hai trạng thái, chưa có vai trò (role) hay RBAC:

| Trạng thái | Cách xác định | Hệ quả |
|-----------|---------------|--------|
| Khách (anonymous) | không có session hợp lệ trong cookie | có thể xem trang công khai + `/login` |
| Đã đăng nhập | session Supabase hợp lệ (qua `getUser()` phía server) | được điều hướng khỏi `/login`; truy cập nội dung cần đăng nhập (sẽ thêm sau) |

> Lưu ý bảo mật: luôn dùng `supabase.auth.getUser()` (xác thực với server Supabase) để kiểm tra
> phiên ở phía server, KHÔNG dựa vào `getSession()` (chỉ đọc cookie, có thể bị giả mạo) cho quyết định bảo mật.

## Quy tắc truy cập (hiện tại)

| Route | Khách | Đã đăng nhập |
|-------|-------|--------------|
| `/login` | Cho phép | Redirect về `/` |
| `/` | Cho phép | Cho phép |
| `/auth/callback` | Cho phép (xử lý code) | Cho phép |

Redirect `/login` → `/` được thực thi ở hai lớp:
1. `lib/supabase/proxy.ts` (`updateSession`) — chạy qua Proxy mọi request.
2. `app/login/page.tsx` — kiểm tra lại ở Server Component để đảm bảo.

## Mở rộng tương lai (chưa hiện thực)

- Route được bảo vệ (vd `/dashboard`) chặn khách → redirect `/login`.
- Vai trò/RBAC nếu cần (dựa trên `app_metadata.role` của Supabase).
- Không tạo mã `PERM###` ở giai đoạn này (chưa có hệ phân quyền chính thức).
