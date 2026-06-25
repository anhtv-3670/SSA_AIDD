---
status: implemented
authored_by: takumi
created: 2026-06-23
lang: vi
doc_layer: system
---

# Kiến trúc hệ thống

## Tổng quan

Ứng dụng Next.js 16 (App Router) + React 19 + Tailwind 4. Xác thực dựa trên **Supabase Auth**
qua `@supabase/ssr`. Kiến trúc này được thiết lập cùng tính năng đăng nhập (F001_LoginPage);
sẽ mở rộng khi thêm tính năng.

## Tầng xác thực (Auth Layer)

```
Browser ──> proxy.ts (làm mới session mỗi request)
   │
   ├─ /login (Server Component) ── GoogleLoginButton (Server form) ──> Server Action (signInWithOAuth)
   │                                                                        │
   │                                                                        └─> Supabase Auth (local @ 127.0.0.1:54321)
   │
   └─ /auth/callback (Route Handler) ──> exchangeCodeForSession ──> redirect /home
```

### Thành phần

| Thành phần | Vị trí | Vai trò |
|-----------|--------|---------|
| Env helper | `lib/supabase/env.ts` | Đọc và validate biến môi trường Supabase; ném lỗi rõ ràng nếu thiếu (fail fast). |
| Browser client | `lib/supabase/client.ts` | `createBrowserClient` cho Client Component (chỉ anon key). |
| Server client | `lib/supabase/server.ts` | `createServerClient` gắn với cookies của Next (`await cookies()`). |
| Proxy client | `lib/supabase/proxy.ts` | Làm mới session trong `proxy.ts`, ghi cookie ra response. Redirect `/login` → `/home` cho user đã đăng nhập. |
| Proxy (middleware) | `proxy.ts` (root) | Chạy `updateSession` mỗi request — **Next.js 16 đổi tên Middleware → Proxy**. |
| Auth actions | `app/login/actions.ts` | Server Actions: `signInWithOAuth` (Google/GitHub allowlist) + `signOut`. Email/password path đã gỡ (F001 re-implement). |
| Trang đăng nhập | `app/login/page.tsx` | Server Component; redirect về `/home` nếu đã đăng nhập. |
| Google login button | `app/login/google-login-button.tsx` | Server Component form → `signInWithOAuth('google')`; gold button + Google G SVG. |
| Login header | `app/login/login-header.tsx` | Logo `/saa-2025/logo-sun.png` + `<LanguageSelector>`. |
| Login footer | `app/login/login-footer.tsx` | Copyright footer tối giản. |
| OAuth callback | `app/auth/callback/route.ts` | Đổi `code` (PKCE) lấy session; bảo vệ open-redirect qua `next` param. |

## Mẫu trang được bảo vệ (Guarded-Page Pattern)

Bốn route `/home`, `/he-thong-giai`, `/sun-kudos`, và `/profile` dùng chung cùng một mẫu Server Component:

```
page.tsx (Server Component)
  createClient() → getUser() → nếu chưa đăng nhập → redirect "/login"
  getLocale()
  render <SiteHeader active={…} locale={locale} />
  render <SiteFooter />
  render nội dung trang (Server hoặc Client Component)
```

Khi thêm route mới cần xác thực, sao chép mẫu này — không tạo middleware riêng cho từng trang.

## Route công khai (Public-Route Pattern)

`/prelaunch` là route **không** dùng mẫu guarded-page: không có `getUser()`, không có `<SiteHeader>`/`<SiteFooter>`, không có auth redirect. Đây là trang standalone toàn màn hình phục vụ trước sự kiện (đếm ngược).

Khi thêm route công khai mới: bỏ qua `getUser()` và chrome dùng chung — nhưng vẫn phải kiểm tra proxy không vô tình chặn route đó (`lib/supabase/proxy.ts` hiện chỉ redirect `/login`, không ảnh hưởng các route khác).

## Tầng locale (Locale Layer)

Tách biệt rõ giữa client-safe và server-only:

| Module | Vị trí | Phạm vi | Vai trò |
|--------|--------|---------|---------|
| Locale constants/types | `lib/locale.ts` | client + server | `Locale` type, `LOCALE_COOKIE`, `DEFAULT_LOCALE`, `LOCALES`, `parseLocale`, `localeOption` — không import `next/headers`. |
| Locale server reader | `lib/get-locale.ts` | server-only | `getLocale()` đọc cookie qua `next/headers`; không gọi từ Client Component. |
| Language selector | `components/language-selector.tsx` | client | `"use client"` — quản lý state open/locale, ghi cookie, roving-focus a11y. |

Server Component (header) gọi `getLocale()` → truyền `initialLocale` vào `<LanguageSelector>` để SSR và client hydrate khớp nhau (tránh nhấp nháy). Phạm vi tính năng: **chỉ UI + cookie persistence** — chưa dịch nội dung trang.

## Quyết định kiến trúc (ADR tóm tắt)

- **ADR: Dùng `@supabase/ssr` thay vì tự quản session JWT.** Lý do: bảo mật cookie chuẩn, hỗ trợ
  refresh token, ít mã tự viết (KISS). Đánh đổi: phụ thuộc Supabase.
- **ADR: Mọi lệnh auth chạy trên server (Server Action / Route Handler).** Lý do: không lộ secret,
  validate tập trung, cookie set phía server (chống giả mạo client).
- **ADR: `proxy.ts` chỉ làm mới session (không kiểm tra phân quyền nặng).** Lý do: Proxy chạy mọi route,
  tránh truy vấn DB gây chậm; kiểm tra bảo mật đặt gần nguồn dữ liệu (DAL) khi cần sau này.
- **ADR: `resolveOrigin` dùng chuỗi dự phòng Origin → X-Forwarded-Host → Host → localhost.** Lý do:
  reverse proxy thường không truyền header `Origin`; `X-Forwarded-Host` + `X-Forwarded-Proto` bù đắp.
  Xem `app/login/actions.ts#resolveOrigin`.

## Font tự host (Self-hosted Fonts)

Font `"Digital Numbers"` (kiểu LED 7-segment, dùng cho `/prelaunch`) được phục vụ nội bộ:
- File: `public/fonts/digital-numbers/DigitalNumbers-Regular.woff`
- Khai báo: `@font-face` trong `app/globals.css` với `font-display: swap`.

Không phụ thuộc CDN ngoài — đảm bảo hiển thị nhất quán khi không có mạng hoặc CDN bị chặn.

## Biến môi trường

| Biến | Mục đích |
|------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL API Supabase (local: `http://127.0.0.1:54321`). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon/publishable key (an toàn để lộ ra client). |
| `SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID` | OAuth Google — tùy chọn, chỉ cần khi bật Google login. |
| `SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET` | OAuth Google secret — tùy chọn. |
| `SUPABASE_AUTH_EXTERNAL_GITHUB_CLIENT_ID` | OAuth GitHub — tùy chọn, chỉ cần khi bật GitHub login. |
| `SUPABASE_AUTH_EXTERNAL_GITHUB_SECRET` | OAuth GitHub secret — tùy chọn. |
| `NEXT_PUBLIC_EVENT_START_ISO` | Thời điểm bắt đầu sự kiện (ISO 8601), dùng cho cả `/prelaunch` (F008) và `/home` hero countdown (F002). Default: `2026-12-26T19:00:00+07:00`. Nếu không hợp lệ, countdown hiển thị `00/00/00/00`. |

`service_role` key KHÔNG được dùng trong app này. Tham khảo `.env.example` để xem mẫu đầy đủ.
