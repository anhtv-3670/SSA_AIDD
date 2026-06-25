---
status: implemented
authored_by: takumi
created: 2026-06-23
fcode: F002
lang: vi
---

# F002_HomePage — Edge Cases

| Scenario | Input | Expected | Severity |
|----------|-------|----------|----------|
| Chưa đăng nhập mở /home | không có cookie phiên | redirect `/login`, không lộ nội dung | high |
| Phiên hết hạn | cookie cũ/không hợp lệ | `getUser()` trả null → redirect `/login` | medium |
| Đã đăng nhập | phiên hợp lệ | hiển thị trang chủ + định danh (`email ?? phone ?? id`) | low |
| User không có email | phiên hợp lệ, `email` null | hiển thị `phone` nếu có, ngược lại hiển thị `id` | low |
| Bấm đăng xuất | người dùng hợp lệ | `signOut()` → redirect `/login` | low |
| Thiếu biến môi trường Supabase | `.env.local` chưa cấu hình | lỗi rõ ràng khi khởi tạo client (fail fast) | high |
| `NEXT_PUBLIC_EVENT_START_ISO` không hợp lệ | giá trị không phải ISO 8601 | `eventStartMs()` trả 0, countdown hiển thị `00/00/00`, lỗi log ra console | medium |
| Sự kiện đã qua | `now ≥ eventStartMs()` | countdown hiển thị `00/00/00` (không âm) | low |
