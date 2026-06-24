---
status: implemented
authored_by: takumi
created: 2026-06-23
fcode: F002
lang: vi
---

# F002_HomePage — Screens

## Screen List

| Code | Tên | Route | Mô tả |
|------|-----|-------|-------|
| SCR-home | Trang chủ | `/home` | Landing sau đăng nhập: lời chào + định danh tài khoản, nút đăng xuất, vùng nội dung (tạm thời). |

> Nguồn thiết kế: MoMorph screen `i87tDx10uM` (fileKey `9ypp4enmFmdK3YAFJLIu6C`).
> UI hiện thực là **tạm thời** — giá trị thị giác đối chiếu với thiết kế MoMorph khi MCP đọc được. KHÔNG đoán pixel.

### SCR-home — thành phần (tạm thời)

- Header: định danh người dùng (`user.email ?? user.phone ?? user.id`) + nút "Đăng xuất".
- Tiêu đề trang "Trang chủ".
- Vùng nội dung placeholder (chờ thiết kế MoMorph).

### UI States

- **authed**: hiển thị trang chủ đầy đủ.
- **unauthed**: không render (đã redirect về `/login` trước khi hiển thị — xử lý ở cấp trang).

## User Journey

(đã đăng nhập) mở `/home` → server `getUser()` → có user: render trang chủ · không user: redirect `/login`.
Bấm "Đăng xuất" → `signOut()` → redirect `/login`.
