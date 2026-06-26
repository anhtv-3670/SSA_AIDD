# F011 — Open Secret Box

## Mục đích
Modal overlay cho phép người dùng mở Secret Box để nhận ngẫu nhiên 1 trong 6 huy hiệu sưu tập
của SAA 2025. Mở từ chip "Secret Box (N)" trên board `/sun-kudos`. Liên kết trực tiếp với cơ chế
sưu tập badge được mô tả trong F010 Thể lệ.

**Lưu ý phạm vi (F011 original):** Presentational client-side mock — số box và lượt quay ngẫu nhiên
là local state, không có backend.
**F012 (as-built):** box count đến từ bảng `secret_boxes` (Supabase); mở box gọi RPC
`open_secret_box()` SECURITY DEFINER — random authoritative phía server, atomic, persist vào
`badge_collections`; `drawBadge()` giữ lại chỉ để test.

## Phạm vi
- **Trong:** Modal overlay 3 phase (IDLE → OPENING → REVEALED). Chip trigger trên `/sun-kudos`.
  Engine quay thưởng thuần (`drawBadge`). Counter đếm ngược số box còn lại. A11y đầy đủ.
- **Ngoài:** Backend thật, persistence, entitlement, chống gian lận, route riêng,
  số box từ server, lịch sử huy hiệu đã nhận.

## Người dùng & giá trị
Sunner đã đăng nhập trên `/sun-kudos`. Giá trị: trải nghiệm mở quà tức thì, ngẫu nhiên có trọng số,
gắn kết với thể lệ sưu tập 6 badge độc quyền của chương trình.

## Nguồn thiết kế
MoMorph `J3-4YFIpMM`, node 1466:7676 ("Open secret box - chưa mở").
Companion frames (action bấm mở / standby revealed) có trong design nhưng **không render được** —
phase 2 và 3 dựng theo spec + asset của frame "chưa mở".

## Quyết định
- Pattern giống F010/F006: scroll-lock, focus-trap, Escape/backdrop/× đóng, nền `#00101A`,
  z-index backdrop `300`, panel `301`.
- 3 phase cụ thể: IDLE (hộp đóng) → OPENING (~280ms, dim + scale + glow) → REVEALED (badge fade+scale-in).
- Engine thưởng: hàm thuần `drawBadge(roll)`, roll ∈ [0,1) do caller cấp (`Math.random()`).
  Deterministic theo bảng tích lũy — không có side effect.
- Tái dùng 6 badge asset từ F010: `/saa-2025/badge-*.png`.
- Modal unmount hoàn toàn khi đóng (`SecretBoxModal` trả `null` khi `!open`) — mỗi lần mở lại
  là state mới (không cần reset thủ công).
- `prefers-reduced-motion`: delay animation = 0ms, CSS transition = `0ms`.
- Chip trigger mock ban đầu: `SECRET_BOX_MOCK_COUNT = 5` (hardcoded trong `kudos-client-shell.tsx`).
