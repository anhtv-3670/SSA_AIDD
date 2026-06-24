---
status: draft
authored_by: takumi
created: 2026-06-24
fcode: F003
lang: vi
---

# F003_AwardSystem — Screens

## Screen List

| Code | Tên | Route | Mô tả |
|------|-----|-------|-------|
| SCR-award-system | Hệ thống giải | `/he-thong-giai` | Trang chỉ-đọc giới thiệu hệ thống giải thưởng SAA 2025: hero, menu 6 hạng mục, 6 thẻ giải, banner Sun* Kudos. |

> Nguồn thiết kế: MoMorph screen `zFYDgyj_pD` (fileKey `9ypp4enmFmdK3YAFJLIu6C`). Giá trị thị giác lấy từ thiết kế — KHÔNG đoán pixel.

### SCR-award-system — thành phần (theo thứ tự dọc)

1. **Header** (chrome dùng chung): logo, nav (About SAA 2025 / Award Information [active] / Sun* Kudos), chọn ngôn ngữ, chuông thông báo, user menu.
2. **Hero / Key Visual** (item 3): ảnh nền campaign (cover, center-crop), tiêu đề "ROOT FURTHER", phụ đề "Sun* Annual Award 2025". Trang trí, không click.
3. **Tiêu đề mục** (item A): phụ đề "Sun* annual awards 2025" (nhỏ, nhạt) + tiêu đề chính "Hệ thống giải thưởng SAA 2025" (lớn, vàng).
4. **Khu hệ thống giải** (item B): bố cục 2 cột —
   - **Menu trái** (item C, sticky): 6 mục Top Talent / Top Project / Top Project Leader / Best Manager / Signature 2025 - Creator / MVP. Active = vàng + underline.
   - **Danh sách thẻ giải** (items D.1–D.6): mỗi thẻ = ảnh giải (336×336px) + nội dung (tiêu đề, mô tả, "Số lượng giải thưởng: …", "Giá trị giải thưởng: …").
5. **Banner Sun* Kudos** (item D1): label "Phong trào ghi nhận", tiêu đề "Sun* Kudos", mô tả, logo Kudos (phải), CTA "Chi tiết" → `/sun-kudos`.
6. **Footer** (chrome dùng chung): About SAA 2025 / Award Information / Sun* Kudos / Tiêu chuẩn chung / Bản quyền thuộc về Sun*.

### UI States

- **authed**: render đầy đủ trang.
- **unauthed**: không render (đã redirect `/login` ở cấp trang trước khi hiển thị).
- **nav active**: đúng 1 mục active; đổi theo click hoặc scroll-spy.
- **nav hover**: mục được highlight khi rê chuột.

## User Journey

(đã đăng nhập) mở `/he-thong-giai` → server `getUser()` →
- có user: render hero → tiêu đề → menu + 6 thẻ giải → banner Kudos.
- không user: redirect `/login`.

Click mục menu → smooth scroll tới hạng mục + set active. Cuộn tay → active bám section (scroll-spy).
Bấm "Chi tiết" (Kudos) → điều hướng `/sun-kudos`.
