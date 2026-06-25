# F008 — Screens

## SCR-prelaunch (MoMorph `8PJQswPZmU`, node 2268:35127)
Full-screen, dark `#00101A` base. KHÔNG header/footer (standalone).

### 0.1 Background (2268:35129)
Full-viewport feather/root pattern (reuse `/home-saa/hero-swirl.png`), cover, no-repeat + overlay tối tăng tương phản. Tĩnh.

### 0.2 Title (2268:35137)
"Sự kiện sẽ bắt đầu sau" — căn giữa, trắng, cỡ vừa (Montserrat 700 ~24px). Phía trên các block đếm.

### Countdown row (1 Days / 2 Hours / 3 Minutes / 4 Seconds)
- Bố cục hàng ngang, gap lớn; mỗi unit = 2 ô digit kiểu LED 7-segment + nhãn UPPERCASE trắng bên dưới ("DAYS"/"HOURS"/"MINUTES"/"SECONDS").
- Ô digit: nền tối bán trong, bo góc, chữ số LED (font kiểu 7-segment / monospaced LED look), 2 chữ số zero-pad.
- DAYS (2268:35139): 00–99, "00" khi <1 ngày. HOURS (2268:35144): 00–23. MINUTES (2268:35149): 00–59. SECONDS: 00–59, "00" khi diff ≤ 0.

### Hành vi
- Đếm ngược trực tiếp tới target (env/const). Tick 1 giây; cập nhật D/H/M/S.
- Giá trị invalid/âm → 00; tới/dưới 0 → 00/00/00 (đóng băng).
- Hydration-safe: render giá trị ban đầu xác định, cập nhật live sau khi mount (tránh lệch SSR/client).
- Responsive: bg cover; layout co giãn, desktop-first.
