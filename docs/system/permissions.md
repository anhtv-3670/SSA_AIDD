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
| Đã đăng nhập | session Supabase hợp lệ (qua `getUser()` phía server) | được điều hướng khỏi `/login`; truy cập các route được bảo vệ (vd `/home`) |

> Lưu ý bảo mật: luôn dùng `supabase.auth.getUser()` (xác thực với server Supabase) để kiểm tra
> phiên ở phía server, KHÔNG dựa vào `getSession()` (chỉ đọc cookie, có thể bị giả mạo) cho quyết định bảo mật.

**Phương thức đăng nhập:** kể từ F001 re-implement, đường đăng nhập DUY NHẤT được hiển thị trên UI là **Google OAuth** (`signInWithOAuth('google')`). Form email/mật khẩu (`signInWithPassword`), `loginSchema`, `login-form.tsx` và toàn bộ test của chúng đã được gỡ khỏi sản phẩm. Backend OAuth (`signInWithOAuth`, `signOut`, `/auth/callback`) giữ nguyên — đây là backend final. Allowlist provider vẫn gồm `google` + `github` (validated trong `actions.ts`), nhưng chỉ `google` được surface trên UI.

## Quy tắc truy cập (hiện tại)

| Route | Khách | Đã đăng nhập |
|-------|-------|--------------|
| `/login` | Cho phép | Redirect về `/home` |
| `/` | Cho phép | Cho phép |
| `/auth/callback` | Cho phép (xử lý code) | Cho phép |
| `/home` | **Redirect về `/login`** | Cho phép (hiển thị trang chủ) |

Redirect `/login` → `/home` được thực thi ở hai lớp (cả hai dùng `/home`, khớp `POST_LOGIN_REDIRECT`):
1. `lib/supabase/proxy.ts` (`updateSession`) — chạy qua Proxy mọi request.
2. `app/login/page.tsx` — kiểm tra lại ở Server Component để đảm bảo.

Chốt bảo vệ `/home` đặt **ở cấp trang** (`app/home/page.tsx`): gọi `supabase.auth.getUser()` phía
server, nếu null → `redirect('/login')`. Không dựa vào proxy cho việc chặn `/home` — proxy chỉ làm
mới phiên và chuyển hướng người đã đăng nhập khỏi `/login`; tránh truy vấn nặng trong proxy.

## Mở rộng tương lai (chưa hiện thực)

- Thêm route được bảo vệ (vd `/dashboard`, `/settings`) theo cùng pattern cấp trang của `/home`.
- Vai trò/RBAC nếu cần (dựa trên `app_metadata.role` của Supabase).
- Không tạo mã `PERM###` ở giai đoạn này (chưa có hệ phân quyền chính thức).
- Điểm đến sau đăng nhập đã thống nhất là `/home` (proxy, page guard `/login`, và `/auth/callback` qua `next=/home`). Route `/` re-export trang `/home` nên hiển thị cùng nội dung.
