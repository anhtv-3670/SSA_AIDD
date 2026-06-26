# F010 — Edge Cases

| ID | Tình huống | Hành vi mong đợi |
|----|-----------|------------------|
| EC-1 | Nhấn "Thể lệ" trong FAB speed-dial | Modal Thể lệ mở, focus trap kích hoạt, scroll-lock body bật |
| EC-2 | Nhấn Escape khi modal mở | Modal đóng, scroll-lock tháo, focus trả về nút "Thể lệ" trong FAB |
| EC-3 | Nhấn backdrop (nền tối ngoài panel) | Modal đóng như Escape |
| EC-4 | Nhấn nút "Đóng" (×) trong footer | Modal đóng như Escape |
| EC-5 | Nhấn "Viết KUDOS" trong footer | Modal Thể lệ đóng → modal F006 mở; không có 2 modal cùng lúc |
| EC-6 | Mở Thể lệ rồi nhấn "Viết KUDOS" trên /sun-kudos | Modal Thể lệ đóng → reuse `writeOpen` state của shell (không tạo modal F006 thứ hai) |
| EC-7 | Tab trong modal | Focus di chuyển tuần tự trong panel; không thoát ra ngoài (focus trap) |
| EC-8 | Shift+Tab ở phần tử đầu | Focus nhảy về phần tử cuối cùng trong panel (wrap around) |
| EC-9 | Nội dung dài hơn viewport | Panel nội dung scroll; footer sticky vẫn hiển thị ở đáy |
| EC-10 | Mở modal khi FAB speed-dial đang mở | Speed-dial đóng (caller gọi onClose trước khi mở modal), overlay che FAB (z 300 > 40) |
| EC-11 | Cuộn trang khi modal mở | Body scroll-lock ngăn cuộn trang nền; chỉ panel nội dung scroll |
| EC-12 | Đóng modal, mở lại | Trạng thái scroll panel reset về đầu (không nhớ vị trí cuộn cũ) |
| EC-13 | `prefers-reduced-motion` | Nếu có animation fade: `transition: none`; modal vẫn mở/đóng đúng |
| EC-14 | Badge image lỗi / chưa load | `alt` text tên badge hiển thị; layout không vỡ |
| EC-15 | Mở trên /login hoặc /prelaunch | Không thể xảy ra — FAB không render trên các route này |
