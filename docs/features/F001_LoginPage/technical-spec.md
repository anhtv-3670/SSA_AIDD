---
status: implemented
authored_by: takumi
created: 2026-06-23
fcode: F001
lang: vi
---

# F001_LoginPage — Technical Spec

## Overview

Trang đăng nhập (`/login`) cho phép khách truy cập xác thực bằng **email + mật khẩu** hoặc
**OAuth (Google/GitHub)** thông qua Supabase. Sau khi đăng nhập thành công, người dùng có một
phiên (session) được lưu trong cookie HttpOnly và được điều hướng về trang chủ (`/`).

Tính năng dùng `@supabase/ssr` để quản lý phiên trên cả Server Component, Server Action,
Route Handler và Proxy (middleware đổi tên ở Next.js 16). Đây là nền tảng xác thực cho toàn ứng dụng;
các tính năng đăng ký (`/signup`) và route được bảo vệ sẽ xây dựng sau, dựa trên hạ tầng này.

## Polymorphic Behavior

None. (Một luồng đăng nhập duy nhất; phương thức email/password và OAuth dùng chung action layer.)

## Cross-Cutting Logic

### Requirements

- FR-1: Trang `/login` hiển thị form email + mật khẩu và các nút OAuth (Google, GitHub).
- FR-2: Gửi form gọi một Server Action chạy `supabase.auth.signInWithPassword`.
- FR-3: Validate đầu vào phía server bằng Zod trước khi gọi Supabase (email trim + hợp lệ, mật khẩu không rỗng).
- FR-4: Lỗi xác thực (sai thông tin, lỗi mạng) trả về thông báo thân thiện qua `useActionState`,
  KHÔNG lộ chi tiết kỹ thuật.
- FR-5: Nút OAuth gọi Server Action chạy `signInWithOAuth` với `redirectTo` trỏ tới
  Route Handler callback `/auth/callback`.
- FR-6: Route Handler `/auth/callback` đổi `code` lấy session (PKCE) rồi điều hướng về `next` (mặc định `/`).
- FR-7: Phiên được làm mới trên mỗi request thông qua `proxy.ts` (giữ cookie auth không hết hạn).
- FR-8: Có Server Action `signOut` để đăng xuất và xóa phiên.

### Business Rules

- BR-1: Mọi thao tác xác thực thực thi trên server (Server Action / Route Handler) — không bao giờ
  để lộ service_role key; client chỉ dùng anon/publishable key.
- BR-2: Cookie phiên phải là HttpOnly, Secure (ở production), SameSite=Lax — do `@supabase/ssr` quản lý.
- BR-3: Nếu người dùng đã đăng nhập mà truy cập `/login`, điều hướng về `/`.

### Decision Logic

None.

### State Machines

None.

### Algorithms

- **ALG-1: resolveOrigin** (`app/login/actions.ts`): xác định origin cho OAuth callback URL theo thứ tự ưu tiên:
  1. Header `Origin`
  2. Header `X-Forwarded-Host` + `X-Forwarded-Proto` (mặc định `https`)
  3. Header `Host` (dùng `http://`)
  4. Fallback `http://localhost:3000`

  Lý do: reverse proxy thường không truyền `Origin`; chuỗi dự phòng đảm bảo callback URL luôn hợp lệ.

- **ALG-2: email trim-before-validate** (`lib/validation/auth-schema.ts`): email được `.trim()` trước khi
  kiểm tra định dạng (Zod v4 sẽ báo lỗi nếu trim sau validate vì whitespace thừa). Password chỉ kiểm tra
  `min(1)` — độ phức tạp do Supabase quản lý.

- **ALG-3: open-redirect guard** (`app/auth/callback/route.ts`): tham số `next` chỉ được chấp nhận nếu
  bắt đầu bằng `/` và không bắt đầu bằng `//`; tất cả trường hợp khác fallback về `/`.

### External Integrations

- **INT-1: Supabase Auth** (local project qua Supabase CLI): `signInWithPassword`, `signInWithOAuth`,
  `exchangeCodeForSession`, `signOut`, `getUser`. URL/anon key đọc từ biến môi trường
  `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- **INT-2: OAuth providers** (Google, GitHub): cấu hình trong `supabase/config.toml`
  (`[auth.external.google]`, `[auth.external.github]`); cần client id/secret của provider qua env vars
  `SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID` / `SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET` /
  `SUPABASE_AUTH_EXTERNAL_GITHUB_CLIENT_ID` / `SUPABASE_AUTH_EXTERNAL_GITHUB_SECRET`.

### Verification

- Build (`next build`) và lint sạch.
- Test: validate Zod (trim, định dạng email, password rỗng), mapping lỗi, luồng callback (mock Supabase client).

## User Stories

### US — Đăng nhập bằng email & mật khẩu
Là một khách truy cập, tôi muốn nhập email + mật khẩu và đăng nhập, để truy cập ứng dụng dưới
danh nghĩa tài khoản của mình.
- FR liên quan: FR-1, FR-2, FR-3, FR-4, FR-7
- Acceptance: thông tin đúng → có session + về `/`; sai → thông báo lỗi, ở lại `/login`, không mất email đã nhập.

### US — Đăng nhập bằng OAuth
Là một khách truy cập, tôi muốn đăng nhập bằng Google hoặc GitHub, để không phải nhớ mật khẩu riêng.
- FR liên quan: FR-1, FR-5, FR-6, FR-7
- Acceptance: chọn provider → chuyển hướng tới provider → quay lại `/auth/callback` → có session + về `/`.

### US — Đăng xuất
Là người dùng đã đăng nhập, tôi muốn đăng xuất, để kết thúc phiên an toàn.
- FR liên quan: FR-8
- Acceptance: gọi `signOut` → xóa session → redirect `/login`.

## Key Entities

- **Supabase User**: định danh do Supabase Auth quản lý (`id`, `email`, `app_metadata`,
  `user_metadata`). Ứng dụng không tự lưu bảng người dùng ở giai đoạn này.
- **Session**: access/refresh token do Supabase phát hành, lưu trong cookie qua `@supabase/ssr`.

## Source Code References

| Vai trò | Đường dẫn |
|---------|-----------|
| Env helper | `lib/supabase/env.ts` |
| Browser client | `lib/supabase/client.ts` |
| Server client | `lib/supabase/server.ts` |
| Proxy client (updateSession) | `lib/supabase/proxy.ts` |
| Proxy (root, Next.js 16) | `proxy.ts` |
| Validation schema (Zod) | `lib/validation/auth-schema.ts` |
| Server Actions | `app/login/actions.ts` |
| Login page (Server Component) | `app/login/page.tsx` |
| Login form (Client Component) | `app/login/login-form.tsx` |
| OAuth buttons (Server Component) | `app/login/oauth-buttons.tsx` |
| OAuth callback Route Handler | `app/auth/callback/route.ts` |
| Supabase config | `supabase/config.toml` |
| Env example | `.env.example` |

## Assumptions

- Supabase chạy local qua Supabase CLI (`supabase start`), URL mặc định `http://127.0.0.1:54321`.
- Chưa có trang `/signup` — link tới `/signup` tồn tại trong UI nhưng route chưa hiện thực.
- Sau đăng nhập điều hướng về `/` (chưa có dashboard).
- UI là **tạm thời (provisional)** — sẽ đối chiếu với thiết kế MoMorph (screen `GzbNeVGJHz`,
  fileKey `9ypp4enmFmdK3YAFJLIu6C`) khi MCP đọc được thiết kế.

## Unresolved Questions

- Danh sách provider OAuth cuối cùng và việc cấu hình client id/secret ở local khi bật OAuth thật.
- Giá trị pixel/typography/spacing của UI — chờ dữ liệu thiết kế MoMorph để đối chiếu.

## Spec Documents

- [x] technical-spec.md
- [x] business-context.md
- [x] screens.md
- [x] edge-cases.md
