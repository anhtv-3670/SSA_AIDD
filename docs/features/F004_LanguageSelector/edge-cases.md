# F004 — Edge Cases

| ID | Tình huống | Hành vi mong đợi | Nguồn |
|----|-----------|------------------|-------|
| EC-1 | Cookie `locale` chưa có / giá trị lạ | `parseLocale` fallback `DEFAULT_LOCALE` ("vi"); không lỗi | technical-spec |
| EC-2 | Click ra ngoài khi menu mở | Đóng menu, không đổi locale | screens.md hành vi |
| EC-3 | Nhấn Escape khi menu mở | Đóng menu, focus về trigger | a11y |
| EC-4 | Chọn lại đúng locale đang active | Đóng menu, giữ nguyên giá trị (no-op an toàn) | screens.md |
| EC-5 | JS tắt | Trigger hiển thị tĩnh (cờ + nhãn theo cookie SSR); dropdown không mở được — suy biến an toàn, không lỗi | progressive enhancement |
| EC-6 | SSR vs client mismatch | Server đọc cookie và render đúng cờ/nhãn ban đầu → tránh nhấp nháy hydrate | technical-spec |
