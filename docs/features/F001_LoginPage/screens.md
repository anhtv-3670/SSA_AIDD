---
status: implemented
authored_by: takumi
created: 2026-06-23
fcode: F001
lang: vi
---

# F001_LoginPage — Screens

## Screen List

| Code | Tên | Route | Mô tả |
|------|-----|-------|-------|
| SCR-login | Đăng nhập | `/login` | Form email/mật khẩu + nút OAuth (Google, GitHub), link tới `/signup`. |

> Nguồn thiết kế: MoMorph screen `GzbNeVGJHz` (fileKey `9ypp4enmFmdK3YAFJLIu6C`).
> UI hiện thực ở giai đoạn này là **tạm thời** — giá trị thị giác (màu, font, spacing, layout chi tiết)
> sẽ đối chiếu với thiết kế MoMorph khi MCP đọc được. KHÔNG đoán giá trị pixel.

### SCR-login — thành phần (tạm thời)

- Tiêu đề "Đăng nhập" + mô tả chào mừng.
- Trường Email (`type=email`, required, giữ lại giá trị khi lỗi).
- Trường Mật khẩu (`type=password`, required).
- Nút "Đăng nhập" (submit, disabled khi pending, hiển thị "Đang đăng nhập…").
- Vùng thông báo lỗi chung (`role="alert"`, `aria-live="polite"`) — theo `useActionState`.
- Thông báo lỗi per-field dưới mỗi input (`aria-live="polite"`).
- Divider "hoặc".
- Nút "Tiếp tục với Google", "Tiếp tục với GitHub" (Server Component — mỗi nút là một `<form>`).
- Link "Chưa có tài khoản? Đăng ký" → `/signup` (chưa hiện thực).

### UI States

- **idle**: form trống, sẵn sàng nhập.
- **pending**: đang gửi — nút disabled, hiển thị "Đang đăng nhập…".
- **error**: hiển thị thông báo lỗi, giữ lại email đã nhập.
- **success**: điều hướng tới `/` (không có trạng thái hiển thị riêng).

### Validation & Error Feedback

| Tình huống | Thông báo |
|-----------|-----------|
| Email sai định dạng (sau trim) | "Email không hợp lệ." |
| Mật khẩu rỗng | "Vui lòng nhập mật khẩu." |
| Sai thông tin đăng nhập (Supabase) | "Email hoặc mật khẩu không đúng." |
| OAuth thất bại (`?error=oauth`) | "Đăng nhập bằng nhà cung cấp thất bại. Vui lòng thử lại." |
| Lỗi khác | "Đã có lỗi xảy ra. Vui lòng thử lại." |

## User Journey

`/login` → (email/password submit | OAuth click) → server xác thực →
thành công: set cookie phiên → redirect `/` · thất bại: ở lại `/login` kèm thông báo lỗi.

Luồng OAuth có thêm bước: provider → `/auth/callback?code=...` → đổi code lấy session → redirect `/`.
Nếu OAuth bị hủy hoặc callback thiếu `code` → redirect `/login?error=oauth`.
