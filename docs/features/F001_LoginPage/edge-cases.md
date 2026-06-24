# F001 — Edge Cases (re-implementation)

| ID | Tình huống | Hành vi mong đợi | Nguồn |
|----|-----------|------------------|-------|
| EC-1 | User đã đăng nhập mở `/login` | `redirect('/home')` — nhất quán với điểm đến sau OAuth (`POST_LOGIN_REDIRECT="/home"`) | page guard + proxy |
| EC-2 | OAuth thất bại (`/login?error=oauth`) | Hiển thị thông báo lỗi tiếng Việt gần nút Google; không crash | actions redirect |
| EC-3 | Click "LOGIN With Google" | Submit form → `signInWithOAuth('google')` → redirect tới Google; lỗi → `/login?error=oauth` | actions |
| EC-4 | JS tắt | Nút Google vẫn hoạt động (server-action form, không cần client JS); LanguageSelector suy biến (đã có guard) | progressive enhancement |
| EC-5 | Provider không hợp lệ (post thủ công) | `signInWithOAuth` allowlist chặn → `/login?error=oauth` | actions (giữ nguyên) |
| EC-6 | Màn hẹp hơn thiết kế | Hero co giãn cover, nội dung không vỡ; desktop-first | layout |
| EC-7 | Sau khi xoá email/password | Không còn import/route nào tham chiếu `signInWithPassword`/`auth-schema`/`login-form`; build + suite xanh | regression |
