# F011 — Technical Spec

## Components (files < 200 lines)

| Vai trò | File | Client? |
|---------|------|---------|
| Engine thưởng (pure function + bảng badge) | `app/sun-kudos/secret-box/draw-badge.ts` | — |
| Unit tests engine | `app/sun-kudos/secret-box/draw-badge.test.ts` | — |
| Copy strings + asset path | `app/sun-kudos/secret-box/secret-box-data.ts` | — |
| Counter strip (label + số lớn vàng) | `app/sun-kudos/secret-box/secret-box-counter.tsx` | client |
| Stage (hộp + glow + badge reveal) | `app/sun-kudos/secret-box/secret-box-stage.tsx` | client |
| Inner game (state machine, a11y, focus-trap) | `app/sun-kudos/secret-box/secret-box-inner.tsx` | client |
| Modal shell (open guard + remount) | `app/sun-kudos/secret-box/secret-box-modal.tsx` | client |

### `draw-badge.ts`

Thuần TypeScript, không JSX, không side effect. Xuất:
- `BadgeReward`: `{ id: string; name: string; image: string }`.
- `BADGE_TABLE`: `ReadonlyArray<{ cumulative: number; reward: BadgeReward }>` — 6 phần tử
  theo thứ tự tích lũy (0.30 / 0.55 / 0.75 / 0.85 / 0.95 / 1.00).
- `drawBadge(roll: number): BadgeReward` — duyệt `BADGE_TABLE`, trả phần tử đầu tiên có
  `safeRoll < cumulative`. Clamp roll vào `[0, 0.9999999]`; NaN fallback → phần tử cuối.

### `secret-box-data.ts`

Xuất `SECRET_BOX_COPY` (object `as const` chứa tất cả string UI) và `SECRET_BOX_IMAGE`
(`"/saa-2025/secret-box-closed.png"`). Không JSX.

### `secret-box-counter.tsx`

Props: `{ count: number }`. Render label "Secretbox chưa mở" + số `count` cỡ lớn.
Không có logic state.

### `secret-box-stage.tsx`

Props: `{ phase, reward, count, onBoxClick, reducedMotion }`.

- Luôn render hộp đóng (`<Image>` Next.js, `src={SECRET_BOX_IMAGE}`, 200×200, `priority`).
- Glow ring (`aria-hidden`, radial-gradient vàng) — `opacity` 0 → 1 khi phase = "opening".
- Hộp button `disabled` khi `count === 0 || phase === "opening"`. `aria-label="Mở Secret Box"`.
- Badge overlay (`reward && …`) — `opacity`/`scale` transition khi phase = "revealed".
- `transitionDuration = reducedMotion ? "0ms" : "280ms"` áp dụng cho tất cả CSS transition.

### `secret-box-inner.tsx`

State machine chính — xuất `Phase = "idle" | "opening" | "revealed" | "empty"` (F012 thêm "empty" khi count = 0).

| State | Mô tả |
|-------|-------|
| `phase` | Phase hiện tại của game |
| `count` | Số box còn lại (khởi tạo từ `initialCount`) |
| `reward` | `BadgeReward \| null` — badge vừa trúng |
| `reducedMotion` | Đọc `matchMedia("prefers-reduced-motion: reduce")` lazy init; subscribe change |

**Effects:**
- Focus capture/restore qua `requestAnimationFrame` (không setState trong effect).
- Body scroll-lock: `document.body.style.overflow = "hidden"` khi mount, restore khi unmount.
- Keydown listener: Escape → `onClose()`; Tab → `trapFocus()` (focus-trap nội bộ).
- Cleanup: `clearTimeout(openTimerRef.current)` khi unmount giữa chừng phase "opening".

**handleBoxClick:** Chỉ kích hoạt khi `phase ∈ {idle, revealed}` và `count > 0`.
`setPhase("opening")` → `setTimeout(280ms)` → `drawBadge(Math.random())` → `setReward` +
`setCount(c - 1)` + `setPhase("revealed")`.

**Layout (từ trong ra ngoài):** backdrop → `<div role="dialog">` → nút × → `<h2 id="secret-box-title">`
→ instruction `<p>` → `<SecretBoxStage>` → `aria-live` div ẩn → `<SecretBoxCounter>`.

### `secret-box-modal.tsx`

Props: `{ open: boolean; onClose: () => void; initialCount?: number }` (default `initialCount = 5`).

Trả `null` khi `!open` — unmount hoàn toàn `SecretBoxInner`, đảm bảo mỗi lần mở là state sạch.

## Wiring (thay đổi từ F010)

### `app/sun-kudos/kudos-client-shell.tsx`

Thêm:
- `import { SecretBoxModal }` từ `./secret-box/secret-box-modal`.
- Constant `SECRET_BOX_MOCK_COUNT = 5` (mock, không có backend).
- State `const [secretBoxOpen, setSecretBoxOpen] = useState(false)`.
- Chip trigger pill trước `<KudosComposeBar>`:
  ```tsx
  <button onClick={() => setSecretBoxOpen(true)}>Secret Box ({SECRET_BOX_MOCK_COUNT})</button>
  ```
- `<SecretBoxModal open={secretBoxOpen} onClose={() => setSecretBoxOpen(false)} initialCount={SECRET_BOX_MOCK_COUNT} />`

## Assets

| File | Kích thước | Nguồn |
|------|-----------|-------|
| `public/saa-2025/secret-box-closed.png` | 557×557 (crop từ MoMorph) | F011 mới |
| `public/saa-2025/badge-stay-gold.png` | 64×64 | Tái dùng từ F010 |
| `public/saa-2025/badge-flow-to-horizon.png` | 64×64 | Tái dùng từ F010 |
| `public/saa-2025/badge-touch-of-light.png` | 64×64 | Tái dùng từ F010 |
| `public/saa-2025/badge-beyond-the-boundary.png` | 64×64 | Tái dùng từ F010 |
| `public/saa-2025/badge-revival.png` | 64×64 | Tái dùng từ F010 |
| `public/saa-2025/badge-root-further.png` | 64×64 | Tái dùng từ F010 |

## Constraints

- z-index: backdrop `300`, panel `301` — ngang F010/F006; trên FAB `40` và SiteHeader `50`.
- Files < 200 lines. React-Compiler safe (không setState trong effect body).
- Tokens: nền `#00101A`, vàng `rgba(255,234,158,1)`, Montserrat. Inline styles per house style.
- Badge images dùng `next/image` với `width`/`height` explicit.
- Build/test node 20. 36 unit tests phủ ranh giới bảng tích lũy (draw-badge.test.ts).
