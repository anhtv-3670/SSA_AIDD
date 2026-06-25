# F008 — Edge Cases (mapped to MoMorph test cases)

| ID | Tình huống | Hành vi mong đợi | TC |
|----|-----------|------------------|----|
| EC-1 | Khách chưa đăng nhập mở `/prelaunch` | Cho phép (public) — hiển thị trang | ACCESSING (public per config) |
| EC-2 | Giá trị 1 chữ số (5/9/0) | Zero-pad → "05"/"09"/"00" | c715cb38 / 33fe648b |
| EC-3 | DAYS 0/9/10/31 | "00"/"09"/"10"/"31" | 33fe648b |
| EC-4 | HOURS ngoài range (-1, 25) | → "00"; 0–23 hợp lệ hiển thị đúng | f98adad8 |
| EC-5 | MINUTES ngoài range (-1, 60) | → "00"; 0–59 hợp lệ hiển thị đúng | 724e6e17 |
| EC-5a | SECONDS ngoài range (-1, 60) | → "00"; 0–59 hợp lệ hiển thị đúng | (impl) |
| EC-6 | <1 ngày còn lại | DAYS = "00" | b373626d |
| EC-7 | Timer chạy (days>1) | D/H/M/S tự cập nhật mỗi giây | 840dd6be |
| EC-8 | Tới/dưới 0 | Tất cả unit = "00" (đóng băng) | 50fc4021 |
| EC-9 | Nhãn | "DAYS"/"HOURS"/"MINUTES"/"SECONDS" UPPERCASE, trắng | 37fd89d1 |
| EC-10 | SSR/hydration | Render ban đầu khớp server→client; cập nhật live sau mount; không cảnh báo hydrate | (impl) |
| EC-11 | unmount khi đang chạy | clearInterval; không setState sau unmount | (impl) |
