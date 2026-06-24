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
   ├─ /login (Server Component) ── LoginForm (Client) ──> Server Actions (signInWithPassword / signInWithOAuth)
   │                                                          │
   │                                                          └─> Supabase Auth (local @ 127.0.0.1:54321)
   │
   └─ /auth/callback (Route Handler) ──> exchangeCodeForSession ──> redirect /
```

### Thành phần

| Thành phần | Vị trí | Vai trò |
|-----------|--------|---------|
| Env helper | `lib/supabase/env.ts` | Đọc và validate biến môi trường Supabase; ném lỗi rõ ràng nếu thiếu (fail fast). |
| Browser client | `lib/supabase/client.ts` | `createBrowserClient` cho Client Component (chỉ anon key). |
| Server client | `lib/supabase/server.ts` | `createServerClient` gắn với cookies của Next (`await cookies()`). |
| Proxy client | `lib/supabase/proxy.ts` | Làm mới session trong `proxy.ts`, ghi cookie ra response. Cũng redirect `/login` → `/` cho user đã đăng nhập. |
| Proxy (middleware) | `proxy.ts` (root) | Chạy `updateSession` mỗi request — **Next.js 16 đổi tên Middleware → Proxy**. |
| Auth actions | `app/login/actions.ts` | Server Actions: đăng nhập email/mật khẩu, OAuth, đăng xuất. |
| Trang đăng nhập | `app/login/page.tsx` | Server Component; redirect về `/` nếu đã đăng nhập. |
| Form đăng nhập | `app/login/login-form.tsx` | Client Component; dùng `useActionState`. |
| Nút OAuth | `app/login/oauth-buttons.tsx` | Server Component; mỗi provider là một `<form>` gọi `signInWithOAuth`. |
| OAuth callback | `app/auth/callback/route.ts` | Đổi `code` (PKCE) lấy session; bảo vệ open-redirect qua `next` param. |
| Validation schema | `lib/validation/auth-schema.ts` | Schema Zod cho form đăng nhập; trim email trước khi validate. |

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

## Biến môi trường

| Biến | Mục đích |
|------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL API Supabase (local: `http://127.0.0.1:54321`). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon/publishable key (an toàn để lộ ra client). |
| `SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID` | OAuth Google — tùy chọn, chỉ cần khi bật Google login. |
| `SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET` | OAuth Google secret — tùy chọn. |
| `SUPABASE_AUTH_EXTERNAL_GITHUB_CLIENT_ID` | OAuth GitHub — tùy chọn, chỉ cần khi bật GitHub login. |
| `SUPABASE_AUTH_EXTERNAL_GITHUB_SECRET` | OAuth GitHub secret — tùy chọn. |

`service_role` key KHÔNG được dùng trong app này. Tham khảo `.env.example` để xem mẫu đầy đủ.
