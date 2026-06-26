# F005 — Sun* Kudos Live Board (Bảng ghi nhận)

## Mục đích
Trang `/sun-kudos` — bảng "live" hiển thị hệ thống ghi nhận & cảm ơn (Kudos) của SAA 2025. Đây là đích đến của CTA "Chi tiết" trên banner Sun* Kudos ở trang chủ (F002) — hiện route 404. Phạm vi đợt này: **trình bày (presentational) bằng mock data + tương tác client nhẹ**; KHÔNG có DB/persistence.

## Người dùng & giá trị
- Sunner đã đăng nhập (auth guard như các trang khác).
- Giá trị: xem các lời cảm ơn nổi bật, toàn bộ feed, bảng spotlight, và thống kê cá nhân.

## Phạm vi
- **Trong phạm vi (build):** hero KV + ô nhập, HIGHLIGHT KUDOS (carousel + filter), SPOTLIGHT BOARD (word-cloud tĩnh + ticker + "388 KUDOS"), ALL KUDOS (feed card + sidebar thống kê + "10 Sunner nhận quà"). Header/Footer dùng chung (đã có). Mock data trích từ design.
- **Tương tác client (mock):** carousel paging; like toggle (đổi màu/số, không lưu); Copy Link → toast "Link copied — ready to share!"; filter Hashtag + Phòng ban (lọc mock); search 2 ô (lọc mock).
- **Ngoài phạm vi (placeholder tĩnh/disabled):** dialog gửi kudos, dialog Secret Box ("Mở quà"), điều hướng profile, điều hướng chi tiết kudos, pan/zoom word-cloud (vẽ tĩnh), infinite scroll (render mock list), quy tắc nghiệp vụ tim (ngày đặc biệt/1-lượt/disable người gửi), persistence, kết nối DB.
- **F012 (as-built):** feed, highlight, sidebar stats đọc Supabase thật; like/unlike persist (`hearts` table); filter chạy trên dữ liệu thật; spotlightNames + tickerEntries giữ decorative.

## Route & điều hướng
- Tạo route `/sun-kudos` (Server Component, auth guard → redirect `/login` nếu chưa đăng nhập). Sau khi tạo, CTA banner trang chủ điều hướng đúng (FR "notice for navigation on home screen" = route tồn tại). Header nav "Sun* Kudos" active.

## Nguồn thiết kế
MoMorph `MaZUn5xHXZ` (node 2940:13431). Xem screens.md.

## Quyết định (xem clarifications.md)
- Presentational + mock; route làm banner trang chủ hoạt động; 4 nhóm tương tác client; phần còn lại placeholder.
