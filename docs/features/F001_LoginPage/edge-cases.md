---
status: implemented
authored_by: takumi
created: 2026-06-23
fcode: F001
lang: vi
---

# F001_LoginPage — Edge Cases

| Scenario | Input | Expected | Severity |
|----------|-------|----------|----------|
| Email sai định dạng | `abc@` (hoặc có whitespace thừa) | Trim trước, rồi lỗi validate Zod — không gọi Supabase | low |
| Mật khẩu rỗng | email hợp lệ, password `""` | Lỗi validate, không gọi Supabase | low |
| Sai thông tin đăng nhập | email/mật khẩu không khớp | Thông báo "Email hoặc mật khẩu không đúng.", giữ email | medium |
| Supabase không phản hồi | mất kết nối local | Thông báo lỗi chung, không crash | medium |
| OAuth bị hủy giữa chừng | người dùng thoát ở provider | Quay lại `/login?error=oauth`, không có session, không lỗi nghiêm trọng | low |
| Callback thiếu `code` | mở `/auth/callback` không có `code` param | Điều hướng `/login?error=oauth`, không crash | medium |
| Callback `next` param không hợp lệ | `next=//evil.com` hoặc URL tuyệt đối | Fallback về `/` (open-redirect guard) | medium |
| Provider OAuth không được hỗ trợ | `provider` field giả mạo khác google/github | `isSupportedProvider` trả false → redirect `/login?error=oauth` | medium |
| Đã đăng nhập mở `/login` | có cookie phiên hợp lệ | Điều hướng về `/` (xử lý ở cả proxy và page) | low |
| Thiếu biến môi trường Supabase | `.env.local` chưa cấu hình | `getSupabaseEnv()` ném lỗi rõ ràng khi khởi tạo client (fail fast), ghi log | high |
