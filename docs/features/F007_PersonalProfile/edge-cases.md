# F007 — Edge Cases

(No MoMorph test cases for this screen — derived from spec + project patterns.)

| ID | Tình huống | Hành vi mong đợi |
|----|-----------|------------------|
| EC-1 | Khách chưa đăng nhập mở `/profile` | Redirect `/login` (auth guard như home) |
| EC-2 | Bộ sưu tập icon chưa mở icon nào | Hiển thị 6 slot xám (placeholder), không lỗi |
| EC-3 | Đổi filter Đã gửi ↔ Đã nhận | Feed + số đếm "(N)" cập nhật theo mock tương ứng |
| EC-4 | Filter cho list rỗng | Hiển thị "Hiện tại chưa có Kudos nào." |
| EC-5 | Card có cờ Spam | Hiển thị badge "Spam" (góc phải, đỏ); các tương tác khác giữ nguyên |
| EC-6 | Click "Mở Secret Box" | Disabled placeholder — no-op an toàn, không điều hướng 404 |
| EC-7 | Click avatar/tên (hero/feed/F005/F006) | Điều hướng `/profile` (trang duy nhất; per-user deferred) — không 404 |
| EC-8 | Nội dung/hashtag dài trên card | Clamp + "…" (reuse KudosCard) |
| EC-9 | JS tắt | Trang render tĩnh đầy đủ (SSR); filter suy biến về default; không lỗi |
| EC-10 | Like/Copy Link trên card | Reuse hành vi F005 (toggle tim local, copy + toast) |
