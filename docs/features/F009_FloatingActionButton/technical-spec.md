# F009 — Technical Spec

## Components (files < 200 lines)
| Vai trò | File | Client? |
|---------|------|---------|
| Pill toggle + speed-dial orchestrator | `components/fab-button.tsx` | client |
| Speed-dial menu (3 nút) | `components/fab-expanded-menu.tsx` | client |
| Icon bút dùng chung | `components/icons/pen-icon.tsx` | client |
| Self-contained FAB+modal wrapper | `components/write-kudo-fab.tsx` | client |
| Inline visibility/animation helper | `components/fab-item-visibility.ts` | — |

- `FabButton` props: `onWrite: () => void`. Quản lý `open` state nội bộ. Renders fixed bottom-right container (flex-col, align-end, gap 20px): `<FabExpandedMenu>` bên trên + pill toggle bên dưới. Pill: `aria-expanded={open}`, `aria-controls="fab-speed-dial"`, nhấn toggle. Escape/click-outside → `handleClose()` (focus về pill). Khi mở: `requestAnimationFrame` focus vào `cancelBtnRef` (nút Hủy). Hover box-shadow. `focus-visible` ring 2px dark (#00101A).
- `FabExpandedMenu` props: `{ onWrite, onThele, onClose, open, cancelRef }`. Presentational — 3 nút (Thể lệ, Viết KUDOS, Hủy). `aria-hidden={!open}`. Nút có `tabIndex={open ? 0 : -1}`. Visibility/animation qua inline style từ `fabItemVisibility(open, reducedMotion)` (`components/fab-item-visibility.ts`) — spread vào từng nút. Nút "Thể lệ" gọi `onThele()` + `onClose()` — không còn `aria-disabled`.
- `PenIcon` props: `{ style?: CSSProperties }`. SVG pencil 24×24, fill `rgba(0,16,26,1)`. Dùng bởi cả pill và nút Viết KUDOS (DRY).
- `WriteKudoFab` (`"use client"`): manages `open` (F006) + `theleOpen` (F010) states. `<FabButton onWrite={()=>setOpen(true)} onThele={()=>setTheleOpen(true)} />` + `<WriteKudoModal …>` + `<TheLeModal onWriteKudo={()=>{setTheleOpen(false);setOpen(true);}} …>`. Self-contained.

## Animation (inline, state-driven)
`fabItemVisibility(open, reducedMotion)` trong `components/fab-item-visibility.ts` trả về CSSProperties: opacity/transform/pointerEvents/transition — spread trực tiếp vào style của 3 nút menu. Fade + slide-up 180ms khi mở; `transition: none` khi `prefers-reduced-motion: reduce`. Không dùng global CSS class (tránh lỗi stale Turbopack dev-chunk mất class).

## Wiring (placement)
- `app/home/page.tsx`, `app/he-thong-giai/page.tsx`, `app/profile/page.tsx`: render `<WriteKudoFab />` (server page renders the client component). Auth-guarded by each page.
- `app/sun-kudos/kudos-client-shell.tsx`: render `<FabButton onWrite={() => setWriteOpen(true)} />` — REUSE the existing `writeOpen`/`WriteKudoModal` (no 2nd modal). Do NOT add WriteKudoFab here.
- DO NOT add to `/login` or `/prelaunch`.

## Constraints
- Reuse F006 `WriteKudoModal` (import from `app/sun-kudos/write-kudo/write-kudo-modal`). No duplicate modal logic.
- `position: fixed`, bottom/right 24px. z-index: FAB `40` < SiteHeader `50` < modal overlay `300` (modal overlay luôn che FAB khi mở).
- React-Compiler safe (setState chỉ trong event handlers / listener callbacks, không trong effect body). Files < 200 lines.
- Build/test node 20.
- Tokens: gold `rgba(255,234,158,1)`, Montserrat. Inline styles per house style.
