# F010 — Screens

## Screen List

| Screen | MoMorph node | Mô tả |
|--------|-------------|-------|
| Modal Thể lệ | `b1Filzi9i6` / 3204:6051 | Overlay toàn bộ thể lệ SAA 2025 |

## Modal Thể lệ (MoMorph node 3204:6051)

- Vị trí: overlay toàn màn hình, z-index backdrop `301`, z-index panel `300`. Nền tối `#00101A` (màu backdrop).
- `role="dialog"`, `aria-modal="true"`, `aria-labelledby` trỏ tới tiêu đề "Thể lệ".
- Focus trap trong modal; Escape / click backdrop / nút "Đóng" → đóng modal, focus trả về nút "Thể lệ" trong FAB.
- Body scroll-lock khi modal mở.
- Nội dung dài hơn viewport → panel nội dung scroll; footer dính (sticky bottom).

### Mục 1 — NGƯỜI NHẬN KUDOS

**Tiêu đề mục:** NGƯỜI NHẬN KUDOS: HUY HIỆU HERO CHO NHỮNG ẢNH HƯỞNG TÍCH CỰC

**Mô tả:** "Dựa trên số lượng đồng đội gửi trao Kudos, bạn sẽ sở hữu Huy hiệu Hero tương ứng, được hiển thị trực tiếp cạnh tên profile"

4 hạng hiển thị dưới dạng CSS pill:

| Hạng | Số lượng | Mô tả |
|------|----------|-------|
| New Hero | Có 1–4 người gửi Kudos cho bạn | Hành trình lan tỏa điều tốt đẹp bắt đầu – những lời cảm ơn và ghi nhận đầu tiên đã tìm đến bạn. |
| Rising Hero | Có 5–9 người gửi Kudos cho bạn | Hình ảnh bạn đang lớn dần trong trái tim đồng đội bằng sự tử tế và cống hiến của mình. |
| Super Hero | Có 10–20 người gửi Kudos cho bạn | Bạn đã trở thành biểu tượng được tin tưởng và yêu quý, người luôn sẵn sàng hỗ trợ và được nhiều đồng đội nhớ đến. |
| Legend Hero | Có hơn 20 người gửi Kudos cho bạn | Bạn đã trở thành huyền thoại – người để lại dấu ấn khó quên trong tập thể bằng trái tim và hành động của mình. |

### Mục 2 — NGƯỜI GỬI KUDOS

**Tiêu đề mục:** NGƯỜI GỬI KUDOS: SƯU TẬP TRỌN BỘ 6 ICON, NHẬN NGAY PHẦN QUÀ BÍ ẨN

**Mô tả:** "Mỗi lời Kudos bạn gửi sẽ được đăng tải trên hệ thống và nhận về những lượt ❤️ từ cộng đồng Sunner. Cứ mỗi 5 lượt ❤️, bạn sẽ được mở 1 Secret Box, với cơ hội nhận về một trong 6 icon độc quyền của SAA."

> Mechanic mở Secret Box được triển khai tại F011 — modal `/sun-kudos` (presentational mock, client-side).

6 huy hiệu (grid, ảnh + tên — tên verbatim từ design):

| Tên badge | Asset |
|-----------|-------|
| REVIVAL | `public/saa-2025/badge-revival.png` |
| TOUCH OF LIGHT | `public/saa-2025/badge-touch-of-light.png` |
| STAY GOLD | `public/saa-2025/badge-stay-gold.png` |
| FLOW TO HORIZON | `public/saa-2025/badge-flow-to-horizon.png` |
| BEYOND THE BOUNDARY | `public/saa-2025/badge-beyond-the-boundary.png` |
| ROOT FUTHER | `public/saa-2025/badge-root-further.png` |

> Lưu ý: tên "ROOT FUTHER" là verbatim từ design (lỗi chính tả giữ nguyên per spec). Asset file được đặt tên là `badge-root-further.png`.

**Kết:** "Những Sunner thu thập trọn bộ 6 icon sẽ nhận về một phần quà bí ẩn từ SAA 2025."

### Mục 3 — KUDOS QUỐC DÂN

**Tiêu đề mục:** KUDOS QUỐC DÂN

**Nội dung:** "5 Kudos nhận về nhiều ❤️ nhất toàn Sun* sẽ chính thức trở thành Kudos Quốc Dân và được trao phần quà đặc biệt từ SAA 2025: Root Further."

### Footer

| Nút | Kiểu | Hành vi |
|-----|------|---------|
| × Đóng | Secondary / outlined | Đóng modal Thể lệ |
| ✏ Viết KUDOS | Primary vàng | Đóng modal Thể lệ → mở modal F006 |

## User Journey

1. Sunner nhấn "Thể lệ" trong FAB speed-dial → modal Thể lệ xuất hiện, focus trap kích hoạt.
2. Cuộn đọc 3 mục nội dung; footer dính hiển thị 2 nút.
3. Nhấn "Đóng" (hoặc Escape / click backdrop) → modal đóng, focus trả về nút "Thể lệ" trong FAB.
4. Nhấn "Viết KUDOS" → modal Thể lệ đóng, modal F006 mở ngay.
