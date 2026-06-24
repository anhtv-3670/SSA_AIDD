# F005 — Edge Cases

| ID | Tình huống | Hành vi mong đợi | Nguồn |
|----|-----------|------------------|-------|
| EC-1 | Khách chưa đăng nhập mở `/sun-kudos` | Redirect `/login` (auth guard như home) | TC ACCESSING auth-required |
| EC-2 | Không có Kudos nào (feed/carousel rỗng) | Hiển thị "Hiện tại chưa có Kudos nào." | TC empty-list |
| EC-3 | Sidebar leaderboard rỗng | Hiển thị "Chưa có dữ liệu" | TC empty leaderboard |
| EC-4 | Nội dung kudos quá dài | Carousel card: cắt 3 dòng + "…"; feed card: cắt 5 dòng + "…" | spec B.3 / C.3.5 |
| EC-5 | Hashtag vượt 1 dòng (>5) | Cắt còn 1 dòng + "…" | spec B.4.3 |
| EC-6 | Carousel ở slide đầu/cuối | Nút ◀ / ▶ tương ứng disabled | spec B.5 |
| EC-7 | Filter/search không khớp kết quả nào | Hiển thị empty-state; carousel page về 1 | clarification |
| EC-8 | Copy Link khi `navigator.clipboard` không khả dụng | Bọc try/catch; toast vẫn hiển thị hoặc fail êm, không throw | EC robustness |
| EC-9 | Click placeholder (Mở quà / Xem chi tiết / avatar / ảnh / node spotlight) | No-op an toàn, không lỗi JS, không điều hướng tới route 404 | clarification (deferred) |
| EC-10 | JS tắt | Trang render tĩnh đầy đủ (SSR); tương tác suy biến, không lỗi | progressive enhancement |
| EC-11 | Search "Tìm kiếm Sunner" > 100 ký tự | Giới hạn maxLength 100 (theo spec B.7.3) | spec B.7.3 |
