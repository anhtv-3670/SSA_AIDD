---
status: implemented
authored_by: takumi
created: 2026-06-23
fcode: F002
lang: vi
---

# F002_HomePage — Business Context

## Why It Matters

Trang chủ sau đăng nhập là nơi người dùng "đáp xuống" sau khi xác thực — điểm khởi đầu cho mọi
hành trình trong ứng dụng. Nó cũng là chốt phân quyền đầu tiên: chỉ người đã đăng nhập mới thấy
nội dung. Dựng `/home` hoàn thiện vòng đăng nhập → trang riêng tư mà tầng auth F001 đã chuẩn bị.

## Who Uses It

- **Người dùng đã đăng nhập**: xem trang chủ, thông tin tài khoản, và đăng xuất khi cần.

## What They Do

1. Điều hướng tới `/home` (trực tiếp hoặc qua ứng dụng — sau đăng nhập `/auth/callback` redirect về `/home`).
2. Thấy lời chào kèm định danh tài khoản (`email`, hoặc `phone`, hoặc `id` nếu thiếu email/phone), hero section với đồng hồ đếm ngược sống và ngày sự kiện.
3. Bấm "ABOUT AWARDS" để tìm hiểu hệ thống giải → `/he-thong-giai`; bấm "ABOUT KUDOS" để xem bảng Kudos → `/sun-kudos`.
4. Bấm "Đăng xuất" khi muốn kết thúc phiên → quay về `/login`.
5. Nếu phiên hết hạn / chưa đăng nhập mà mở `/home` → được đưa về `/login`.
