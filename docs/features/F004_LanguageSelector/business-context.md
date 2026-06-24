# F004 — Language Selector (Dropdown ngôn ngữ)

## Mục đích
Cho phép người dùng chọn ngôn ngữ hiển thị (VN / EN) qua dropdown ở header dùng chung. Phạm vi đợt này: **chỉ UI dropdown + lưu lựa chọn locale** (mở/đóng, trạng thái selected, đổi cờ + nhãn ở header, ghi cookie). **Chưa** dịch nội dung trang — i18n toàn site là feature riêng sau này.

## Người dùng & giá trị
- Sunner đã đăng nhập, xem các trang SAA 2025.
- Giá trị: nền tảng cho đa ngôn ngữ; lựa chọn được ghi nhớ giữa các lần tải trang.

## Phạm vi
- **Trong phạm vi:** dropdown 2 mục (VN mặc định/selected, EN), tương tác mở/đóng, chọn → đổi hiển thị header + ghi cookie `locale`, đóng dropdown ngoài-click/Escape (a11y).
- **Ngoài phạm vi:** dịch chuỗi giao diện, định tuyến theo locale (`/vi`, `/en`), thêm ngôn ngữ khác, đồng bộ locale với hồ sơ Supabase.

## Nguồn thiết kế
MoMorph `Dropdown-ngôn ngữ` — screenId `hUyaaugye2`, fileKey `9ypp4enmFmdK3YAFJLIu6C`, node `721:4942`.

## Quyết định (xem clarifications.md)
- Scope: chỉ UI + state locale.
- Persistence: cookie (server đọc được khi SSR).
- Ngôn ngữ: VN (mặc định) + EN.
