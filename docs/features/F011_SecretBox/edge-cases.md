# F011 — Edge Cases

| ID | Tình huống | Hành vi mong đợi |
|----|-----------|------------------|
| EC-1 | Nhấn chip "Secret Box (N)" trên /sun-kudos | Modal mở ở phase IDLE, focus trap kích hoạt, scroll-lock body bật |
| EC-2 | Nhấn Escape khi modal mở | Modal đóng, scroll-lock tháo, focus trả về chip trigger |
| EC-3 | Nhấn backdrop (nền tối ngoài panel) | Modal đóng như Escape |
| EC-4 | Nhấn nút × trong panel | Modal đóng như Escape |
| EC-5 | Tab trong modal | Focus di chuyển tuần tự trong panel; không thoát ra ngoài (focus trap) |
| EC-6 | Shift+Tab ở phần tử đầu | Focus nhảy về phần tử cuối trong panel (wrap around) |
| EC-7 | Nhấn hộp khi count > 0, phase = idle | Phase → opening (~280ms) → revealed; badge trúng hiển thị, count − 1 |
| EC-8 | Nhấn hộp khi phase = opening | Bỏ qua (button `disabled`) |
| EC-9 | Nhấn hộp khi count = 0 | Bỏ qua (button `disabled`); instruction đã ẩn |
| EC-10 | count đạt 0 sau lần mở cuối | Hộp disabled, instruction ẩn, badge lần cuối vẫn hiển thị; chỉ có thể đóng |
| EC-11 | Nhấn hộp khi phase = revealed, count > 0 | Phase → opening → revealed mới; badge mới ghi đè badge cũ |
| EC-12 | `prefers-reduced-motion: reduce` | Delay animation = 0ms, transition CSS = 0ms; game vẫn chạy đúng các phase |
| EC-13 | Đóng modal giữa chừng phase opening | Timer clearTimeout khi unmount; không setState sau unmount |
| EC-14 | Mở lại modal sau khi đóng | `SecretBoxModal` trả null khi !open → remount hoàn toàn → state reset (count = initialCount, phase = idle) |
| EC-15 | Badge image lỗi / chưa load | `alt` = tên badge hiển thị; layout không vỡ (kích thước explicit 180×180) |
| EC-16 | Secret box image lỗi / chưa load | alt "Secret Box đóng" hiển thị; stage giữ kích thước 200×200 |
| EC-17 | Cuộn trang khi modal mở | Body scroll-lock ngăn cuộn trang nền; panel không scroll (nội dung vừa viewport) |
| EC-18 | Screen reader nhận reveal | `aria-live="polite"` trong panel phát "Bạn nhận được huy hiệu {name}" khi phase = revealed |
| EC-19 | `drawBadge` nhận roll = 0 | Trả Stay Gold (< 0.30) — ranh giới dưới |
| EC-20 | `drawBadge` nhận roll = 0.9999 | Trả Root Further (≥ 0.95) — ranh giới trên |
| EC-21 | `drawBadge` nhận roll NaN | Clamp không giúp NaN; fallback → Root Further (phần tử cuối BADGE_TABLE) |
| EC-22 | `drawBadge` nhận roll âm hoặc > 1 | Clamp vào [0, 0.9999999] trước khi tra bảng; kết quả hợp lệ |
| EC-23 | Mở Secret Box trên màn hình nhỏ (< 432px) | Panel co lại: `maxWidth: calc(100vw - 32px)`; nội dung không bị cắt |
