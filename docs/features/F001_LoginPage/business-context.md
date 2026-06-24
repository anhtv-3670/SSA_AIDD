# F001 — Login Page (re-implementation)

## Mục đích
Trang `/login` — cổng vào SAA 2025. Re-implement UI theo thiết kế MoMorph `GzbNeVGJHz` (trước đây UI tạm, backend auth là final). Thiết kế mới: **chỉ đăng nhập bằng Google**, hero "ROOT FURTHER" full-bleed.

## Thay đổi trọng yếu so với bản tạm
- **Chỉ Google login** — bỏ form email/mật khẩu, bỏ nút GitHub, bỏ link "Đăng ký".
- **Xoá unused** (theo quyết định): action `signInWithPassword`, `lib/validation/auth-schema.ts`, `login-form.tsx`, và toàn bộ test của chúng (~40 test). Giữ `signInWithOAuth` + `signOut` (+ test) — backend OAuth là final.
- UI mới: dark base, hero swirl bg, wordmark ROOT FURTHER (styled text), subtitle, 1 nút "LOGIN With Google", header tối giản (logo + chọn ngôn ngữ), footer bản quyền.

## Người dùng & giá trị
- Sunner chưa đăng nhập. Đã đăng nhập → redirect `/home` (nhất quán với `POST_LOGIN_REDIRECT`).
- Giá trị: một đường đăng nhập duy nhất, rõ ràng (Google SSO).

## Phạm vi
- **Trong:** UI trang login theo design + wire nút Google vào `signInWithOAuth('google')`; header (logo + LanguageSelector F004); footer copyright.
- **Ngoài:** thay đổi luồng OAuth backend (giữ nguyên), trang `/signup` (bỏ link, không xoá route nếu có), đa ngôn ngữ nội dung.

## Nguồn thiết kế
MoMorph `GzbNeVGJHz` (node 662:14387). Header A / Bìa B (KeyVisual B.1, Frame 550: subtitle + Login button B.3) / Footer D.

## Quyết định (xem clarifications.md)
- Google-only everything (xoá email/password path + test). ROOT FURTHER = styled text (như home-hero).
