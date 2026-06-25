# F006 — Edge Cases

| ID | Tình huống | Hành vi mong đợi | Nguồn (TC) |
|----|-----------|------------------|-----------|
| EC-1 | Submit khi tất cả required rỗng | Lỗi tại Người nhận + Danh hiệu + Nội dung + Hashtag; không submit | ID-56 |
| EC-2 | Người nhận rỗng khi Gửi | Viền đỏ + thông báo tại Người nhận; không submit | ID-7/ID-50 |
| EC-3 | Nội dung rỗng khi Gửi | Lỗi "Không được để trống" tại textarea | ID-11/ID-51 |
| EC-4 | 0 hashtag khi Gửi | Lỗi "Không được để trống" tại Hashtag | ID-14/ID-52 |
| EC-5 | Thêm hashtag thứ 6 | Chặn + thông báo "Tối đa 5 hashtag" | ID-17/ID-53 |
| EC-6 | Đủ 5 ảnh | Ẩn nút "+ Image"; xoá 1 ảnh → hiện lại | ID-19/ID-40 |
| EC-7 | Thêm ảnh thứ 6 | Không thể (nút đã ẩn) | ID-20/ID-54 |
| EC-8 | Upload file không phải jpg/png (pdf/mp4/txt) | Thông báo lỗi định dạng; không thêm | ID-23/24/55 |
| EC-9 | Recipient search có khoảng trắng "  Nguyễn  " | Trim + lọc đúng | ID-10 |
| EC-10 | Gõ '@' trong nội dung | Cho phép như text thường (KHÔNG có dropdown mention — out of scope) | ID-12/33 (giảm phạm vi) |
| EC-11 | Bấm Hủy / overlay / Escape sau khi nhập | Đóng modal, bỏ dữ liệu, không lưu | ID-45 |
| EC-12 | Required đã đủ (người nhận + danh hiệu + nội dung + ≥1 hashtag) | Nút "Gửi" enable; submit hợp lệ → toast "Đã gửi Kudos!" (tồn tại sau close) + đóng + reset | ID-46/47/49 |
| EC-13 | Toolbar format (B/I/S/list/link/quote) | Nút hiển thị nhưng **không thực thi** (trang trí, out of scope) | ID-27..32 (giảm phạm vi) |
| EC-14 | Bật/tắt checkbox ẩn danh | Hiện/ẩn ô tên ẩn danh | ID-43/44 |
| EC-15 | Mở khi chưa đăng nhập | /sun-kudos đã có auth guard → redirect /login trước khi tới được modal | ID-1 |
