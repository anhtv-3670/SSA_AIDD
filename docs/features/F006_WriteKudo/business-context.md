# F006 — Write Kudo modal (Viết Kudo)

## Mục đích
Modal "Gửi lời cám ơn và ghi nhận đến đồng đội" — cho phép Sunner soạn một Kudos (người nhận, danh hiệu, nội dung, hashtag, ảnh, tuỳ chọn ẩn danh). Đây là dialog bị defer ở F005 (compose bar mở dialog). Phạm vi: **trình bày + validate client trên mock data**, KHÔNG lưu DB.

## Người dùng & giá trị
- Sunner đã đăng nhập, đang ở Live Board (/sun-kudos).
- Giá trị: luồng soạn Kudos đầy đủ, validate trước khi gửi; nền tảng cho persistence sau này.

## Phạm vi
- **Trong:** modal + form (recipient autocomplete, danh hiệu, textarea + toolbar trang trí, hashtag chips 1–5, image local-preview max 5, checkbox ẩn danh + ô tên ẩn danh), validate client (required: người nhận/danh hiệu/nội dung/≥1 hashtag; max 5 hashtag & ảnh; ảnh chỉ jpg/png), nút Hủy/Gửi (Gửi disabled tới khi đủ required), mở từ **compose bar F005** (trên /sun-kudos) hoặc **FAB F009** (trên home, he-thong-giai, profile, sun-kudos), submit hợp lệ → toast "Đã gửi Kudos!" (tồn tại độc lập sau khi modal đóng) + đóng modal.
- **Ngoài (defer):** rich-text thực thi (toolbar chỉ trang trí), @mention dropdown trực tiếp (gõ '@' là text thường), trang chi tiết kudos.
- **F012 (as-built):** submit → Server Action `createKudo` insert DB + upload Storage; recipients + hashtags từ Supabase; feed revalidate sau khi gửi.

## Nguồn thiết kế
MoMorph `Viết Kudo` (ihQ26W78P2, node 520:11602) + error state `5c7PkAibyD`.

## Quyết định (xem clarifications.md)
Presentational + client validation; textarea + toolbar trang trí; mở từ compose bar; submit = toast + close.
