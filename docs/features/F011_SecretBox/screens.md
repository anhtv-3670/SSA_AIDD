# F011 — Screens

## Screen List

| Screen | MoMorph node | Mô tả |
|--------|-------------|-------|
| Modal Secret Box — chưa mở (IDLE) | `J3-4YFIpMM` / 1466:7676 | Frame duy nhất render được; phase OPENING + REVEALED dựng theo spec |

> Companion frames "action bấm mở" (OPENING) và "standby revealed" (REVEALED) có trong design
> nhưng **không có published render** — trạng thái 2–3 xây dựng từ spec + asset của frame chưa mở.

## Modal Secret Box (MoMorph node 1466:7676)

- Vị trí: overlay toàn màn hình. Z-index backdrop `300`, z-index panel `301`. Nền `#00101A`.
- `role="dialog"`, `aria-modal="true"`, `aria-labelledby="secret-box-title"`.
- Focus trap trong panel; Escape / click backdrop / nút × → đóng modal, focus trả về chip trigger.
- Body scroll-lock khi modal mở. Panel rộng `400px`, `maxWidth: calc(100vw - 32px)`, bo góc `13px`.

### Entry point

Chip pill "Secret Box (N)" ở góc phải phía trên board `/sun-kudos`. Mock count ban đầu = 5.
Nhấn chip → `setSecretBoxOpen(true)` trong `kudos-client-shell.tsx` → `SecretBoxModal` render.

---

### Phase 1 — IDLE (chưa mở)

| Phần tử | Nội dung / hành vi |
|---------|-------------------|
| Title | "KHÁM PHÁ SECRET BOX CỦA BẠN" (vàng `rgba(255,234,158,1)`, Montserrat 800, 18px) |
| Instruction | "Click vào box để mở" (ẩn khi count = 0, dùng `visibility: hidden` để giữ layout) |
| Stage | Ảnh hộp đóng `/saa-2025/secret-box-closed.png` (200×200, `<Image>` Next.js, priority) |
| Counter | Label "Secretbox chưa mở" (12px, 70% white) + số lớn vàng 48px fontWeight 800 |
| Nút × | `aria-label="Đóng Secret Box"`, góc trên phải, đóng modal |

Click hộp (khi count > 0 và phase = "idle") → chuyển sang phase OPENING.

---

### Phase 2 — OPENING (~280ms)

Animation trên stage (CSS transition `280ms ease`, tôn trọng `prefers-reduced-motion`):

| Phần tử | Thay đổi |
|---------|---------|
| Hộp đóng | `opacity` 1 → 0.5, `transform scale` 1 → 0.92 |
| Glow ring | `opacity` 0 → 1 (radial-gradient vàng phía sau hộp) |
| Badge | Chưa hiển thị (`opacity: 0`, `scale: 0.7`) |

Box button `disabled` trong phase này (không click được). Sau 280ms → chuyển phase REVEALED.

---

### Phase 3 — REVEALED (đã mở)

| Phần tử | Nội dung / hành vi |
|---------|-------------------|
| Title | "MỞ SECRET BOX THÀNH CÔNG" |
| Instruction | "Click vào box để tiếp tục mở" (nếu count > 0); ẩn nếu count = 0 |
| Stage — hộp | `opacity: 0.3`, `scale: 0.85` |
| Stage — badge | Fade + scale-in (`opacity: 1`, `scale: 1`); ảnh `/saa-2025/badge-*.png` (180×180) |
| Counter | Giảm 1 so với phase trước |
| aria-live | `"Bạn nhận được huy hiệu {reward.name}"` thông báo cho screen reader |

Count > 0 → click hộp lại được (phase "revealed" → "opening" → "revealed" mới với badge mới).
Count = 0 → hộp `disabled`, instruction ẩn.

---

### Bảng thưởng (drawBadge — tích lũy)

| Huy hiệu | Xác suất | Ngưỡng tích lũy | Asset |
|----------|----------|-----------------|-------|
| Stay Gold | 30% | < 0.30 | `/saa-2025/badge-stay-gold.png` |
| Flow to Horizon | 25% | < 0.55 | `/saa-2025/badge-flow-to-horizon.png` |
| Touch of Light | 20% | < 0.75 | `/saa-2025/badge-touch-of-light.png` |
| Beyond the Boundary | 10% | < 0.85 | `/saa-2025/badge-beyond-the-boundary.png` |
| Revival | 10% | < 0.95 | `/saa-2025/badge-revival.png` |
| Root Further | 5% | < 1.00 | `/saa-2025/badge-root-further.png` |

Hàm `drawBadge(roll)` nhận `roll ∈ [0, 1)` từ `Math.random()` — thuần, deterministic, không side effect.

## User Journey

1. Sunner vào `/sun-kudos`, thấy chip "Secret Box (5)" góc phải board → nhấn chip.
2. Modal mở ở phase IDLE: hộp đóng, "Click vào box để mở", counter hiển thị 5.
3. Nhấn hộp → phase OPENING (~280ms, hộp mờ + glow).
4. Phase REVEALED: badge trúng fade-in, title "MỞ SECRET BOX THÀNH CÔNG", counter = 4.
5. Nếu count > 0: instruction "Click vào box để tiếp tục mở" → lặp từ bước 3.
6. Khi count = 0: hộp disabled, instruction ẩn, chỉ có thể đóng modal.
7. Nhấn × / Escape / backdrop → modal đóng, focus trả về chip trigger.
