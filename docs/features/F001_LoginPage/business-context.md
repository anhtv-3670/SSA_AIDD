---
status: implemented
authored_by: takumi
created: 2026-06-23
fcode: F001
lang: vi
---

# F001_LoginPage — Business Context

## Why It Matters

Xác thực là cánh cổng của ứng dụng: không có đăng nhập thì không thể có nội dung cá nhân hóa,
dữ liệu riêng tư hay phân quyền. `/login` là điểm chạm đầu tiên với người dùng quay lại và là
nền tảng để xây các tính năng yêu cầu danh tính sau này. Dùng Supabase giúp giảm rủi ro tự xây
hệ thống mật khẩu/phiên và tận dụng OAuth sẵn có.

## Who Uses It

- **Khách truy cập đã có tài khoản**: nhập email/mật khẩu hoặc OAuth để vào lại.
- **Người dùng ưa OAuth**: đăng nhập nhanh bằng Google/GitHub, không cần mật khẩu riêng.

## What They Do

1. Mở `/login`.
2. Hoặc nhập email + mật khẩu rồi bấm "Đăng nhập"; hoặc bấm nút "Tiếp tục với Google/GitHub".
3. Nếu thành công → có phiên và được đưa về trang chủ (`/`).
4. Nếu sai thông tin → thấy thông báo lỗi rõ ràng và thử lại (email đã nhập được giữ lại).
5. Khi muốn kết thúc, người dùng đăng xuất để xóa phiên và về `/login`.
