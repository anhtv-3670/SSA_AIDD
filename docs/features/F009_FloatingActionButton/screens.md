# F009 — Screens

## Screen List

| Screen | MoMorph node | Mô tả |
|--------|-------------|-------|
| FAB thu gọn | `_hphd32jN2` / I313:9138;214:3839 | Pill vàng toggle duy nhất |
| FAB speed-dial mở rộng | node 313:9140 | Menu 3 nút bên trên pill |

## FAB thu gọn (MoMorph node I313:9138;214:3839)
- Vị trí: `position: fixed`, góc dưới-phải (cách mép 24px), z-index `40` (trên nội dung trang; dưới SiteHeader `50`; dưới modal overlay `300`). Hiện trên trang authed.
- Viên vàng (`rgba(255,234,158,1)`), bo tròn pill (border-radius 100px), 108×64px. Chứa: icon bút (PenIcon 24×24) + divider "/" (Montserrat 700 24px) + logo Sun* 24×24 (aria-hidden — trang trí, không phải nút).
- Pill là **toggle duy nhất**: `aria-expanded`, `aria-controls="fab-speed-dial"`. Nhấn → mở/đóng speed-dial. Hover: box-shadow tăng. Focus-keyboard: `focus-visible` ring 2px dark (#00101A) (WCAG 2.4.7). `aria-label` thay đổi theo trạng thái: "Mở menu nhanh" / "Đóng menu".

## FAB speed-dial mở rộng (MoMorph node 313:9140)
Container 214×224px, flex-col, align-end, gap 20px — xuất hiện phía trên pill khi mở (`aria-hidden={!open}`).

| Nút | Kích thước | Màu | Hành vi | a11y |
|-----|-----------|-----|---------|------|
| A — Thể lệ | 149×64, r4 | vàng `rgba(255,234,158,1)` | `onThele()` → F010 modal, rồi đóng menu | `aria-label="Thể lệ"` |
| B — Viết KUDOS | 214×64, r4 | vàng `rgba(255,234,158,1)` | `onWrite()` → F006 modal, rồi đóng menu | `aria-label="Viết KUDOS"` |
| C — Hủy | 56×56, round | đỏ `rgba(212,39,29,1)` | Đóng menu, focus trả về pill | `aria-label="Đóng"` |

Các nút có `tabIndex={open ? 0 : -1}` — không tabbable khi menu đóng.

## Hành vi
- Pill nhấn → `open` toggle; focus chuyển tới nút Hủy (C) khi mở.
- Escape + click ngoài vùng FAB → đóng menu, focus trả về pill.
- B ("Viết KUDOS") → WriteKudoModal mở (trên /sun-kudos reuse modal của compose bar; trang khác dùng modal của WriteKudoFab) rồi menu tự đóng. Đóng modal: như F006.
- A ("Thể lệ"): mở F010 modal, menu đóng.
- Animation: fade + slide-up 180ms (`.fab-menu-item` / `.fab-menu-open` trong `app/globals.css`); `prefers-reduced-motion: reduce` → `transition: none`.
- FAB luôn nổi khi cuộn; không che modal (z thấp hơn overlay).

## User Journey
1. Sunner nhấn pill → speed-dial xuất hiện, focus tới Hủy.
2. Nhấn "Viết KUDOS" → modal F006 mở, menu đóng.
3. Nhấn "Hủy" hoặc Escape hoặc click ngoài → menu đóng, focus về pill.
