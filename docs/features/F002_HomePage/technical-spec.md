---
status: implemented
authored_by: takumi
created: 2026-06-23
fcode: F002
lang: vi
---

# F002_HomePage — Technical Spec

## Overview

Trang chủ sau đăng nhập (`/home`) — landing page dành cho người dùng đã xác thực. Trang lấy
người dùng hiện tại từ Supabase (`getUser()` phía server); nếu chưa đăng nhập thì điều hướng về
`/login`. Khi đã đăng nhập, trang chào người dùng (hiển thị `email ?? phone ?? id` theo thứ tự
ưu tiên), cung cấp nút **Đăng xuất** (Server Component dùng lại Server Action `signOut` từ
`app/login/actions.ts`), và một vùng nội dung tạm thời.

Tính năng dùng lại toàn bộ hạ tầng auth đã dựng ở F001 (`@supabase/ssr`, `lib/supabase/server`,
`app/login/actions.ts`). UI là **tạm thời (provisional)** — đối chiếu với màn hình MoMorph
`i87tDx10uM` khi MCP đọc được thiết kế.

> Lưu ý: sau đăng nhập thành công, `/auth/callback` redirect về `/home` (F001 đã cấu hình).

## Polymorphic Behavior

None.

## Cross-Cutting Logic

### Requirements

- FR-1: `/home` là Server Component, lấy người dùng qua `getUser()` phía server.
- FR-2: Nếu KHÔNG có người dùng hợp lệ → `redirect('/login')` (chốt bảo vệ ở cấp trang).
- FR-3: Nếu có người dùng → hiển thị lời chào kèm định danh (`user.email ?? user.phone ?? user.id`).
- FR-4: Có nút "Đăng xuất" — Server Component `SignOutButton` gọi Server Action `signOut` (dùng lại từ `app/login/actions.ts`) qua `<form action={signOut}>`.
- FR-5: Hero section hiển thị "Coming soon" + đồng hồ đếm ngược **sống** (`HomeCountdown`, Client Component) — dùng lại engine F008 (`computeCountdown`, `pad2` từ `lib/countdown.ts`) và `eventStartMs()` từ `lib/event-config.ts`; `home-hero.tsx` giữ là Server Component.
- FR-6: Ngày sự kiện "Thời gian" lấy từ `formatEventDate()` (`lib/event-config.ts`, đọc `NEXT_PUBLIC_EVENT_START_ISO`); không hardcode.
- FR-7: CTA "ABOUT AWARDS" điều hướng tới `/he-thong-giai`; CTA "ABOUT KUDOS" điều hướng tới `/sun-kudos` — dùng `next/link` (thay thế nút chết trước đây).

### Business Rules

- BR-1: Kiểm tra phiên bằng `supabase.auth.getUser()` (xác thực với server Supabase), KHÔNG dùng `getSession()` cho quyết định bảo vệ.
- BR-2: Chốt bảo vệ đặt ở cấp trang (`app/home/page.tsx`), không dồn vào layout — theo khuyến nghị Next.js (Partial Rendering).

### Decision Logic

None.

### State Machines

None.

### Algorithms

- ALG-countdown: `computeCountdown(targetMs, nowMs)` trả `{days, hours, minutes, seconds}`. Nếu `nowMs ≥ targetMs` (sự kiện đã qua), trả về `{0,0,0,0}` → hiển thị `00/00/00`. Định nghĩa tại `lib/countdown.ts` (dùng lại từ F008).

### External Integrations

- **Supabase Auth**: `getUser()` (đọc người dùng hiện tại), `signOut()` (qua Server Action dùng lại từ F001).
- **Event Config**: `lib/event-config.ts` — `eventStartMs()` (target countdown), `formatEventDate()` (hiển thị ngày), đọc `NEXT_PUBLIC_EVENT_START_ISO`; dùng chung với F008.

### Verification

- Build + lint + type-check sạch.
- Test: chốt điều hướng khi chưa đăng nhập (mock `createClient`).

## User Stories

### US — Xem trang chủ khi đã đăng nhập
Là người dùng đã đăng nhập, tôi muốn mở `/home` và thấy trang chủ kèm thông tin tài khoản.
- FR liên quan: FR-1, FR-3, FR-5, FR-6, FR-7
- Acceptance: có phiên → thấy trang chủ + định danh (`email ?? phone ?? id`); đồng hồ đếm ngược sống; ngày sự kiện từ config; thao tác đăng xuất và CTA điều hướng khả dụng.

### US — Bị chặn khi chưa đăng nhập
Là khách chưa đăng nhập, khi mở `/home` tôi được đưa về `/login`.
- FR liên quan: FR-2
- Acceptance: không có phiên → redirect `/login`, không lộ nội dung trang chủ.

### US — Đăng xuất từ trang chủ
Là người dùng đã đăng nhập, tôi muốn đăng xuất ngay từ `/home`.
- FR liên quan: FR-4
- Acceptance: bấm "Đăng xuất" → `signOut()` → redirect `/login`.

### Edge Cases

See edge-cases.md.

## Key Entities

- **Supabase User**: định danh do Supabase Auth quản lý (`id`, `email`, `phone`). Dùng lại từ tầng auth F001.

## Artifact References

- Screens: see screens.md (`SCR-home`).
- System docs: `docs/system/permissions.md` (route `/home` được bảo vệ), `docs/system/architecture.md` (tầng auth dùng lại).
- Phụ thuộc tính năng: F001_LoginPage (auth + signOut action).

## Assumptions

- Tầng auth (F001_LoginPage) đã hiện thực.
- `/` (create-next-app mặc định) vẫn giữ nguyên; `/home` là route mới riêng biệt.
- Sau đăng xuất → `/login` (theo action `signOut` hiện có).
- UI **tạm thời** — đối chiếu MoMorph `i87tDx10uM` sau.
- **F012 (as-built):** awards section đọc bảng `awards` từ Supabase qua `getAwards()` — không còn dùng `award-data.ts` tĩnh.

## Source Code References

| Vai trò | Đường dẫn |
|---------|-----------|
| Home page (Server Component, auth guard) | `app/home/page.tsx` |
| Sign-out button (Server Component) | `app/home/sign-out-button.tsx` |
| Hero section (Server Component) | `app/home/home-hero.tsx` |
| Live countdown (Client Component) | `app/home/home-countdown.tsx` |
| signOut Server Action (dùng lại) | `app/login/actions.ts` |
| Server client | `lib/supabase/server.ts` |
| Event config (target + format, dùng lại) | `lib/event-config.ts` |
| Countdown engine (dùng lại từ F008) | `lib/countdown.ts` |

## Unresolved Questions

- Nội dung/khối thành phần thật của trang chủ — chờ dữ liệu thiết kế MoMorph `i87tDx10uM`.

## Spec Documents

- [x] technical-spec.md
- [x] business-context.md
- [x] screens.md
- [x] edge-cases.md
