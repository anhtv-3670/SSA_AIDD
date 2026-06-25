# F008 — Technical Spec

## Kiến trúc
- Route `app/prelaunch/page.tsx` — PUBLIC Server Component (NO auth guard, NO SiteHeader/Footer). Renders bg + overlay + `<CountdownDisplay/>`. Metadata title.
- `lib/countdown.ts` — PURE `computeCountdown(targetMs, nowMs): { days, hours, minutes, seconds }`. Fully testable (no Date.now inside). Rules:
  - `diff = targetMs - nowMs`; if `diff <= 0` → `{0,0,0,0}`.
  - `days = floor(diff / 86_400_000)` (cap display 0–99 via pad/clamp), `hours = floor(diff/3_600_000) % 24`, `minutes = floor(diff/60_000) % 60`, `seconds = floor(diff/1_000) % 60`.
  - Helper `pad2(n)` → 2-digit zero-pad; a clamp so out-of-range/negative renders "00" (HOURS 0–23, MINUTES 0–59, DAYS 0–99).
- Event target: `lib/event-config.ts` → `EVENT_START_ISO = process.env.NEXT_PUBLIC_EVENT_START_ISO ?? "2026-12-26T19:00:00+07:00"`; export `eventStartMs()`.

## Components (files < 200 lines)
| Vai trò | File | Client? |
|---------|------|---------|
| Page (public, bg + overlay) | `app/prelaunch/page.tsx` | server |
| Live countdown (timer + render) | `app/prelaunch/countdown-display.tsx` | client |
| LED digit unit (2 digits + label) | `app/prelaunch/countdown-unit.tsx` | server (presentational) |
| Pure countdown math | `lib/countdown.ts` | — (tested) |
| Event target config | `lib/event-config.ts` | — |

## Client behavior (countdown-display.tsx)
- `"use client"`. State `now` (number). `useEffect`: set `now = Date.now()` on mount, then `setInterval(() => setNow(Date.now()), 1000)`; clear on unmount.
- Hydration-safe: initial state derived deterministically (e.g. `now = targetMs` → renders 00/00/00, or a fixed SSR value) so the first client render matches SSR; the effect then sets the real `Date.now()`. Avoids SSR/client text mismatch.
- Each tick: `computeCountdown(targetMs, now)` → render 4 `<CountdownUnit>` (Days/Hours/Minutes/Seconds) with `pad2`.

## LED digits
7-segment / LED look: per-digit boxes, dark translucent bg, rounded, light digit glyphs. Match the design (digits resemble a 7-seg LCD). Reuse the home-hero DigitBox idea but styled to this design. Two digit boxes per unit.

Font: `"Digital Numbers"` — **self-hosted** WOFF tại `public/fonts/digital-numbers/DigitalNumbers-Regular.woff`, khai báo `@font-face` trong `app/globals.css`. (Phiên bản trước dùng CDN ngoài — đã thay bằng self-hosted.)

## Assets / styling
Reuse `/home-saa/hero-swirl.png` (bg). Tokens `#00101A`, white text, Montserrat. Inline styles. Desktop-first; bg cover.

## Hành vi đặc biệt (H-behaviors)

- **H-1 (Accessibility):** `countdown-display.tsx` render một `<span class="sr-only" aria-live="polite" aria-atomic="true">` ẩn chỉ ở độ phân giải phút (không bao gồm giây) — thông báo screen-reader phát ra ~1 lần/phút, tránh spam mỗi giây. Giây chỉ hiển thị trong nhãn `role="timer"` trực quan.
- **H-2 (Malformed env guard):** `eventStartMs()` trong `lib/event-config.ts` kiểm tra `Number.isFinite(ms)`; nếu `NEXT_PUBLIC_EVENT_START_ISO` không hợp lệ → log lỗi + trả về `0` → countdown đóng băng ở `00/00/00` thay vì hiện `NaN`.

## Ghi chú triển khai

- `app/prelaunch/layout.tsx` (segment layout riêng) đã bị xóa — không cần thiết; `app/layout.tsx` root đủ để phục vụ route này.
- Root `app/layout.tsx` đã đổi `lang="en"` → `lang="vi"`.

## Constraints
- PUBLIC route — confirm proxy (`lib/supabase/proxy.ts`) does NOT redirect /prelaunch (it only acts on /login → no change needed).
- `lib/countdown.ts` unit-tested against the 17 TCs (ranges, pad, negative/zero, single-digit).
- Files < 200 lines; existing suite (236) stays green. Build/test on node 20.
