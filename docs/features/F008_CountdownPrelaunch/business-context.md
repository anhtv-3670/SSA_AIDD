# F008 — Countdown Prelaunch page

## Mục đích
Trang `/prelaunch` — màn hình đếm ngược toàn màn hình hiển thị TRƯỚC khi sự kiện SAA 2025 bắt đầu: "Sự kiện sẽ bắt đầu sau" + bộ đếm DAYS/HOURS/MINUTES kiểu LED, tự cập nhật theo thời gian thực.

## Người dùng & giá trị
- Bất kỳ ai (PUBLIC — không cần đăng nhập), trước giờ sự kiện.
- Giá trị: thông báo thời điểm khai mạc; tạo không khí chờ đợi.

## Phạm vi
- **Trong:** route công khai `/prelaunch` (không auth guard, không header/footer), nền feather full-screen + overlay tối, tiêu đề, 3 block đếm ngược (Days/Hours/Minutes) LED 2 chữ số + nhãn, **đếm ngược trực tiếp** (auto-update). Target cấu hình qua env, fallback hằng số tương lai.
- **Tương tác (client):** timer tick theo thời gian thực, cập nhật D/H/M; tới/dưới 0 → hiển thị 00/00/00 (đóng băng, không redirect).
- **Ngoài:** seconds (thiết kế chỉ D/H/M), redirect khi hết giờ, đăng ký nhận thông báo, backend/persistence.

## Nguồn thiết kế
MoMorph `Countdown - Prelaunch page` (8PJQswPZmU, node 2268:35127). 5 specs, 17 test cases.

## Quy tắc (từ spec/test)
- 2 chữ số zero-pad; DAYS 00–99 (00 khi <1 ngày); HOURS 00–23; MINUTES 00–59; giá trị invalid/âm → 00; ≤0 → tất cả 00.

## Quyết định (xem clarifications.md)
Public `/prelaunch`, không chrome; target qua env `NEXT_PUBLIC_EVENT_START_ISO` (default `2026-12-26T19:00:00+07:00`); logic đếm ngược là hàm thuần, test đầy đủ.
