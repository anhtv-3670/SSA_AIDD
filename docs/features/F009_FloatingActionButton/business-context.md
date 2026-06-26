# F009 — Floating Action Button (Nút nổi chức năng)

## Mục đích
Nút nổi (FAB) cố định góc dưới-phải trên các trang đã đăng nhập: lối tắt nhanh để **viết Kudos** và **xem Thể lệ SAA**. Viên vàng dạng pill, khi nhấn mở rộng thành speed-dial 3 nút.

## Phạm vi
- **Trong:** FAB hiển thị trên home, he-thong-giai, sun-kudos, profile. Pill thu gọn là toggle duy nhất (`aria-expanded`, `aria-controls="fab-speed-dial"`); nhấn mở speed-dial gồm 3 nút: "Thể lệ" (placeholder no-op), "Viết KUDOS" (→ F006 modal + tự đóng menu), "Hủy" (đóng menu). Hover: bóng nhẹ. Reuse F006 modal (không nhân bản state). Dismissal: Escape + click ngoài vùng. Focus chuyển tới nút Hủy khi mở, trả về pill khi đóng. Animation fade + slide-up 180ms, hỗ trợ `prefers-reduced-motion`.
- **Ngoài:** FAB trên /login & /prelaunch (standalone/công khai). Modal Thể lệ được xây dựng trong F010.

## Người dùng & giá trị
- Sunner đã đăng nhập. Giá trị: viết Kudos từ bất kỳ trang nào không cần về board.

## Nguồn thiết kế
MoMorph `_hphd32jN2`. Pill thu gọn: node 313:9137 (I313:9138;214:3839). Speed-dial mở rộng: node 313:9140.

## Quyết định (xem clarifications.md)
FAB mọi trang authed; pill là toggle duy nhất (không act trực tiếp); speed-dial → F006 modal (reuse trên /sun-kudos); nút "Thể lệ" mở F010 modal (đã wire, không còn placeholder).
