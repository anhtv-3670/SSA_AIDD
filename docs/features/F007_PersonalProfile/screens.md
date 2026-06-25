# F007 — Screens

## SCR-profile (MoMorph `3FoIx6ALVb`, node 362:5037)
Dark base `#00101A`, gold `#FFEA9E`, Montserrat. Header/Footer dùng chung. Sections top→bottom.

### Header / Footer
Reuse `SiteHeader` (active="kudos" hợp lý nhất, hoặc none) + `SiteFooter` + `getLocale`. Header user icon (top-right) → link `/profile`.

### A — Info hero (362:5052)
- Full-bleed feather bg (reuse `/home-saa/hero-swirl.png`) + dark gradient.
- A.1 Avatar (362:5053): vòng tròn lớn căn giữa, viền vàng, có badge danh hiệu nhỏ ở dưới.
- A.2 Name (362:5054): "Huỳnh Dương Xuân Nhật" — Montserrat 700, gold, center.
- "CEVC3" + badge "Legend Hero" (pill).
- A.3 Bộ sưu tập icon (362:5064 / B2–B7): hàng 6 slot tròn ("huy hiệu") + nhãn "Bộ sưu tập icon của tôi". Chưa mở → icon xám (placeholder). Mock: vài slot xám.

### B — Thống kê (362:5073)
Box tối viền mảnh (giống F005 sidebar D.1): 6 dòng label+value —
"Số Kudos bạn nhận được: 5", "Số Kudos bạn đã gửi: 25", "Số tim bạn nhận được: 25", "Số Secret Box bạn đã mở: 25", "Số Secret Box chưa mở: 25" + nút "Mở Secret Box" (gold, **disabled placeholder**). Reuse/extract F005 stats markup nếu hợp.

### C — KUDOS header (362:5084)
- Subtitle "Sun* Annual Awards 2025" + title "KUDOS" (gold, lớn).
- C.3 dropdown (362:5089): "Đã gửi (5) ▾" — chọn **Đã gửi** (sent) / **Đã nhận** (received); đổi feed + count. (Reuse dropdown pattern F004/F005.)

### D — Feed (362:5091)
Cột card Kudos — reuse F005 `KudosCard` (variant feed): sender/receiver + badge danh hiệu, time, nội dung (clamp), gallery ảnh, hashtags, like + Copy Link. Một số card có badge **"Spam"** (góc phải, đỏ) — D.3.1 Status. Render mock list theo filter. Empty → "Hiện tại chưa có Kudos nào."

### Avatars (wiring)
Avatar/tên ở mọi nơi (hero, feed cards, F005 board, F006 recipient) → link `/profile` (trang duy nhất; per-user deferred).
