# F009 — Edge Cases

| ID | Tình huống | Hành vi mong đợi |
|----|-----------|------------------|
| EC-1 | Nhấn pill thu gọn | Speed-dial mở, focus chuyển tới nút Hủy (C) |
| EC-2 | Nhấn "Viết KUDOS" trong speed-dial | Modal F006 mở; speed-dial tự đóng; focus về pill khi modal đóng |
| EC-3 | Trên /sun-kudos: click "Viết KUDOS" FAB và compose bar | Cùng mở 1 modal (reuse shell state) — không có 2 modal |
| EC-4 | Nhấn "Thể lệ" trong speed-dial | Modal F010 (Thể lệ) mở; speed-dial tự đóng |
| EC-5 | Nhấn "Hủy" (C) hoặc Escape | Speed-dial đóng, focus trả về pill |
| EC-6 | Click ngoài vùng FAB khi speed-dial mở | Speed-dial đóng (click-outside via pointerdown), focus trả về pill |
| EC-7 | Modal đang mở | Overlay modal nằm TRÊN FAB (z-index 300 > 40); FAB không che dialog |
| EC-8 | Cuộn trang dài | FAB giữ cố định góc dưới-phải (position: fixed) |
| EC-9 | Trang /login, /prelaunch | KHÔNG hiển thị FAB |
| EC-10 | Keyboard — speed-dial đóng | Các nút menu có `tabIndex=-1`; không trong tab order |
| EC-11 | Keyboard — speed-dial mở | Nút Hủy focus ngay khi mở; Tab đi qua Thể lệ / Viết KUDOS; `focus-visible` ring 2px dark trên nền vàng / white trên nền đỏ (WCAG 2.4.7) |
| EC-12 | `prefers-reduced-motion: reduce` | `fabItemVisibility` trả `transition: none` qua inline style — menu vẫn hiện/ẩn nhưng không slide/fade |
| EC-13 | Đóng modal qua FAB-mở | Trở lại trang, FAB vẫn hiển thị; focus trả về hợp lý (modal F006 đã xử lý focus return) |
