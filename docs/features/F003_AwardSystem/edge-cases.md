---
status: draft
authored_by: takumi
created: 2026-06-24
fcode: F003
lang: vi
---

# F003_AwardSystem — Edge Cases

| # | Tình huống | Hành vi mong đợi | Nguồn |
|---|-----------|------------------|-------|
| EC-1 | Khách chưa đăng nhập mở `/he-thong-giai` | Redirect `/login`, không lộ nội dung | TC ID-1 |
| EC-2 | Click section ID không tồn tại / không hợp lệ (qua console) | Không lỗi JS; giữ nguyên vị trí cuộn (no-op an toàn) | TC ID-13 |
| EC-3 | Trang đích `/sun-kudos` chưa tồn tại / lỗi khi bấm "Chi tiết" | Điều hướng tới `/sun-kudos`; Next.js hiển thị 404 mặc định (thân thiện) cho tới khi trang được dựng | TC ID-12, ID-14 |
| EC-4 | Thiếu `image` raster cho medallion (prop trống) | `AwardMedallion` fallback gradient vàng + chữ cái đầu (như `award-card.tsx` F002); luôn có `alt` phù hợp | spec item 3, D.1.1 |
| EC-5 | Khổ màn hẹp hơn thiết kế (≥1200px) | Bố cục wrap mềm (giống home), không vỡ layout; không có breakpoint mobile riêng | clarification |
| EC-6 | JS tắt / IntersectionObserver không khả dụng | Trang vẫn hiển thị tĩnh đầy đủ; scroll-spy suy biến (active có thể không bám), không lỗi | progressive enhancement |
| EC-7 | Header sticky che mất đầu section khi scroll tới | Smooth scroll bù offset chiều cao header (80px) | FR-7 |

## Accessibility

- Hero có `alt`: "Keyvisual Sun* Annual Award 2025".
- Menu trái là `<nav>` với danh sách; mục active mang `aria-current`.
- Mỗi thẻ giải có heading rõ ràng; ảnh trang trí `aria-hidden`/`alt` rỗng phù hợp.
