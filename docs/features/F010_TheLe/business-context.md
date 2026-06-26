# F010 — Thể lệ (SAA Rules) modal

## Mục đích
Modal overlay hiển thị thể lệ chương trình SAA 2025 KUDOS: tiêu chí nhận huy hiệu Hero, cơ chế sưu tập 6 icon độc quyền, và quy tắc bình chọn Kudos Quốc Dân. Mở từ nút "Thể lệ" trong FAB speed-dial (F009) — thay thế hoàn toàn trạng thái placeholder no-op trước đây.

## Phạm vi
- **Trong:** Modal overlay 1 trang với 3 mục nội dung (Người nhận Kudos / Người gửi Kudos / Kudos Quốc Dân). Footer 2 nút: "Đóng" và "Viết KUDOS" (bridge sang F006). Hoạt động trên tất cả 4 surface có FAB: home, he-thong-giai, profile, sun-kudos.
- **Ngoài:** Persistence, dữ liệu thật (số người gửi / lượt ❤️ thực), route riêng `/the-le`, animation phức tạp.

## Người dùng & giá trị
Sunner đã đăng nhập. Giá trị: tra cứu nhanh thể lệ mà không rời trang; luồng liền mạch từ đọc thể lệ → viết Kudos ngay qua footer.

## Nguồn thiết kế
MoMorph `b1Filzi9i6`, node 3204:6051 ("Thể lệ UPDATE").

## Quyết định
- Pattern giống F006 (scroll-lock, focus-trap, Escape/backdrop/Đóng).
- Nền tối `#00101A`; nội dung scroll; footer dính (sticky).
- Hero tiers → CSS pill (không dùng ảnh).
- 6 badge → ảnh crop sẵn tại `public/saa-2025/badge-*.png`.
- "Viết KUDOS" đóng modal này rồi mở modal F006 — không tạo modal mới.
- z-index overlay = 300 (ngang F006), z-index backdrop = 301; nằm trên FAB (40) và SiteHeader (50).
