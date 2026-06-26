# F010 — Technical Spec

## Components (files < 200 lines)

| Vai trò | File | Client? |
|---------|------|---------|
| Data layer (hero tiers + badges) | `app/the-le/the-le-data.ts` | — |
| Modal root (overlay, focus-trap, scroll-lock) | `app/the-le/the-le-modal.tsx` | client |
| Mục 1: Hero tiers | `app/the-le/the-le-hero-tiers.tsx` | client |
| Mục 2: Badge grid | `app/the-le/the-le-badges.tsx` | client |
| Mục 3: Kudos Quốc Dân | `app/the-le/the-le-kudos-quoc-dan.tsx` | client |
| Footer (Đóng + Viết KUDOS) | `app/the-le/the-le-footer.tsx` | client |

### `the-le-data.ts`
Thuần data — không có JSX. Xuất:
- `HERO_TIERS`: mảng 4 phần tử `{ name, range, description }` theo thứ tự New / Rising / Super / Legend.
- `BADGES`: mảng 6 phần tử `{ name, src }` — `src` trỏ tới `/saa-2025/badge-*.png`.

### `the-le-modal.tsx`
Props: `{ open: boolean; onClose: () => void; onWriteKudo: () => void }`.
- Khi `open=false`: render `null`.
- Khi `open=true`: render backdrop + panel.
  - Backdrop: `position:fixed`, inset 0, z-index `301`, nhấn → `onClose()`.
  - Panel: `role="dialog"`, `aria-modal="true"`, `aria-labelledby="the-le-title"`, z-index `300`, nền `#00101A`.
  - Focus trap nội bộ (listener keydown Tab/Shift+Tab trong panel). Escape → `onClose()`.
  - `useEffect` gắn/tháo `overflow: hidden` trên `document.body` (scroll-lock).
  - Khi mở, focus vào phần tử đầu tiên có thể focus trong panel.
  - Khi đóng, trả focus về nút "Thể lệ" trong FAB (caller truyền ref hoặc dùng document query).
  - Render lần lượt: `<TheLeTitleBar>` → `<TheLeHeroTiers>` → `<TheLeBadges>` → `<TheLeKudosQuocDan>` → `<TheLeFooter>`.

### `the-le-hero-tiers.tsx`
Nhận `tiers` từ `HERO_TIERS`. Mỗi tier: pill CSS + label số lượng + mô tả. Không dùng ảnh.

### `the-le-badges.tsx`
Nhận `badges` từ `BADGES`. Grid 3×2 (hoặc responsive 2 cột). Mỗi badge: `<Image>` Next.js 64×64 + tên bên dưới. `alt` = tên badge.

### `the-le-footer.tsx`
Props: `{ onClose: () => void; onWriteKudo: () => void }`.
- Nút "Đóng": icon `×` + chữ, secondary/outlined → `onClose()`.
- Nút "Viết KUDOS": icon bút + chữ, primary vàng → `onWriteKudo()`.
- `position: sticky; bottom: 0` — dính dưới panel nội dung.

## Wiring (thay đổi từ F009)

### `components/fab-button.tsx`
Thêm prop `onThele: () => void`. Truyền xuống `<FabExpandedMenu onThele={onThele} …>`.
Bỏ `aria-disabled` và `cursor: default` trên nút "Thể lệ".

### `components/fab-expanded-menu.tsx`
Thêm prop `onThele: () => void`. Nút "Thể lệ": gọi `onThele()` + `onClose()` khi nhấn.
Xóa `aria-label="Thể lệ (sắp có)"` và `aria-disabled="true"`.

### `components/write-kudo-fab.tsx`
Thêm state `const [theleOpen, setTheleOpen] = useState(false)`.
Truyền `onThele={() => setTheleOpen(true)}` vào `<FabButton>`.
Render `<TheLeModal open={theleOpen} onClose={() => setTheleOpen(false)} onWriteKudo={() => { setTheleOpen(false); setOpen(true); }} />`.

### `app/sun-kudos/kudos-client-shell.tsx`
Thêm state `const [theleOpen, setTheleOpen] = useState(false)`.
Truyền `onThele={() => setTheleOpen(true)}` vào `<FabButton>`.
Render `<TheLeModal open={theleOpen} onClose={() => setTheleOpen(false)} onWriteKudo={() => { setTheleOpen(false); setWriteOpen(true); }} />`.

## Constraints
- z-index: backdrop `301`, panel `300` — ngang F006 overlay; trên FAB `40` và SiteHeader `50`.
- Reuse F006 `WriteKudoModal` — không nhân bản logic modal viết kudo.
- Build/test node 20. Files < 200 lines. React-Compiler safe.
- Tokens: nền `#00101A`, vàng `rgba(255,234,158,1)`, Montserrat. Inline styles per house style.
- Badge images: `public/saa-2025/badge-*.png` (64×64, đã crop). Dùng `next/image`.
