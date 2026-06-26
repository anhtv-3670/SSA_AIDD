# F007 — Personal Profile (Profile bản thân)

## Mục đích
Trang `/profile` — hồ sơ cá nhân của Sunner đang đăng nhập: avatar, tên, danh hiệu, bộ sưu tập icon, thống kê Kudos/tim/Secret Box, và feed Kudos (đã gửi / đã nhận). Đây là đích đến của điều hướng profile bị defer ở F005/F006. **F012 (as-built):** trình bày dựa trên dữ liệu thật — stats, hero tier suy ra, badge collection từ Supabase qua `getProfile()` + `profile_stats()` RPC.

## Người dùng & giá trị
- Sunner đã đăng nhập (auth guard như các trang khác).
- Giá trị: xem hồ sơ + thành tích cá nhân; điểm vào từ icon user trên header.

## Phạm vi
- **Trong:** route `/profile` (guard), hero (avatar + tên + CEVC3 + badge "Legend Hero"), bộ sưu tập icon (6 slot, xám nếu chưa mở), box thống kê (Số Kudos nhận/gửi/tim/Secret Box đã mở/chưa mở + nút "Mở Secret Box"), header "KUDOS" + dropdown lọc Đã gửi/Đã nhận, feed Kudos (reuse F005 `KudosCard`, có badge "Spam"). Header/Footer dùng chung. Mock data.
- **Tương tác client (mock):** dropdown lọc Đã gửi (sent) / Đã nhận (received) — đổi feed + số đếm; like/copy-link trên card (reuse F005).
- **Wiring điều hướng:** header user icon → `/profile`; avatars/names ở F005 (board) + F006 (recipient) → `/profile`.
- **Ngoài (placeholder/defer):** "Mở Secret Box" (disabled), bộ sưu tập icon mở thật, persistence/DB, **trang "Profile người khác"** (mọi link profile tạm trỏ về `/profile` duy nhất — đơn giản hoá có chủ đích), chỉnh sửa hồ sơ.

## Nguồn thiết kế
MoMorph `Profile bản thân` (3FoIx6ALVb, node 362:5037). A info / B thống kê / C header KUDOS / D feed.

## Quyết định (xem clarifications.md)
Presentational + mock; /profile via header icon + wire F005/F006 avatars; sent/received filter functional; reuse KudosCard + Spam badge.
