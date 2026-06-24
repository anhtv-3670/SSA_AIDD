# F004 — Screens

## SCR-language-selector (MoMorph `hUyaaugye2`, node 721:4942)

Trạng thái **mở** của nút chọn ngôn ngữ ở header (`site-header.tsx`). Nút trigger (cờ + chevron) đã có sẵn; feature này biến nó thành dropdown tương tác.

### mms_A_Dropdown-List (525:11713) — container
- nền `#00070C`, viền `1px solid #998C5F`, bo góc `8px`, padding `6px`
- flex column, align-items flex-start
- kích thước nội dung ~`122×124px`; định vị ngay dưới nút trigger, canh phải trong header

### mms_A.1 — VN (selected) (I525:11713;362:6085)
- `108×56px`, bo góc `2px`, nền `rgba(255,234,158,0.20)` (gold tint = trạng thái selected)
- cờ VN (`/home-saa/flag-vn.svg`, 20×15) + nhãn `VN`
- nhãn: Montserrat 700 16px, màu trắng, lineHeight 24px, letterSpacing 0.15px

### mms_A.2 — EN (option) (I525:11713;362:6128)
- `110×56px`, nền trong suốt (đổi nền khi hover)
- cờ GB (`/home-saa/flag-gb.svg`, 20×15) + nhãn `EN`
- cùng kiểu chữ như VN

### Hành vi
- Click trigger: mở/đóng menu.
- Click một mục: set locale, cập nhật cờ + nhãn ở trigger, đóng menu.
- Mục đang chọn: nền gold tint; hover mục: highlight nền.
- Đóng khi click ra ngoài hoặc nhấn Escape.
