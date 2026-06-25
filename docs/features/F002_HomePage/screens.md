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
| SCR-home | Trang chủ | `/home` | Landing sau đăng nhập: hero section (đếm ngược sống, ngày sự kiện từ config, CTA điều hướng), lời chào + định danh tài khoản, nút đăng xuất. |

> Nguồn thiết kế: MoMorph screen `i87tDx10uM` (fileKey `9ypp4enmFmdK3YAFJLIu6C`).
> UI hiện thực là **tạm thời** — giá trị thị giác đối chiếu với thiết kế MoMorph khi MCP đọc được. KHÔNG đoán pixel.

### SCR-home — thành phần

- Header: định danh người dùng (`user.email ?? user.phone ?? user.id`) + nút "Đăng xuất".
- Hero (`HomeHero`, Server Component):
  - Nhãn "Coming soon" + đồng hồ đếm ngược sống (`HomeCountdown`, Client Component) — DAYS / HOURS / MINUTES / SECONDS.
  - "Thời gian": ngày sự kiện từ `formatEventDate()` (không hardcode).
  - CTA "ABOUT AWARDS" → `Link` tới `/he-thong-giai`.
  - CTA "ABOUT KUDOS" → `Link` tới `/sun-kudos`.
- Vùng nội dung còn lại (tạm thời — chờ thiết kế MoMorph `i87tDx10uM`).

### UI States

- **authed**: hiển thị trang chủ đầy đủ.
- **unauthed**: không render (đã redirect về `/login` trước khi hiển thị — xử lý ở cấp trang).

## User Journey

(đã đăng nhập) mở `/home` → server `getUser()` → có user: render trang chủ (hero + countdown sống) · không user: redirect `/login`.
Bấm "ABOUT AWARDS" → `/he-thong-giai`. Bấm "ABOUT KUDOS" → `/sun-kudos`.
Bấm "Đăng xuất" → `signOut()` → redirect `/login`.
