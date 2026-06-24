# F004 — Technical Spec

## Kiến trúc
- `site-header.tsx` (Server Component) gọi `getLocale()` từ `lib/get-locale.ts` → truyền `initialLocale` xuống.
- **`components/language-selector.tsx`** (Client Component, `"use client"`): thay khối nút ngôn ngữ tĩnh hiện tại. Quản lý state `open` + `locale`; render trigger + dropdown panel.
- **`lib/locale.ts`**: hằng số + kiểu dùng chung — `type Locale = "vi" | "en"`, `LOCALE_COOKIE = "locale"`, `DEFAULT_LOCALE = "vi"`, danh sách `LOCALES` (cờ + nhãn), helper `parseLocale(value)`.

## Hành vi (client)
- `open`: `useState(false)`; toggle khi click trigger.
- `locale`: `useState(initialLocale)`; chọn mục → `setLocale`, ghi `document.cookie` (`locale=<v>; path=/; max-age=31536000; samesite=lax; secure` — `secure` chỉ thêm khi HTTPS, bỏ qua trên localhost), đóng menu.
- Đóng menu: listener `pointerdown` ngoài vùng (ref) + `keydown` Escape; cleanup trong `useEffect`.
- Không cần `router.refresh()` (chưa dịch nội dung) — chỉ cập nhật hiển thị + cookie.

## A11y
- Trigger: `<button>` với `aria-haspopup="true"`, `aria-expanded={open}`, `aria-label="Chọn ngôn ngữ"`.
- Panel: `<ul aria-label="Ngôn ngữ">` — danh sách `<button>` thông thường (không dùng `role="listbox"` / `role="option"`); mục đang chọn đánh dấu bằng `aria-current="true"`.
- Điều hướng bàn phím: Escape đóng + trả focus về trigger; ArrowDown/Up từ trigger mở menu và focus vào mục đang active; ArrowDown/Up trong menu di chuyển roving focus giữa các mục.

## Styling
Inline style theo node MoMorph (xem screens.md). Token màu trùng F002/F003: gold `#FFEA9E`, border `#998C5F`, container `#00070C`.

## Assets
- VN: `public/home-saa/flag-vn.svg` (đã có).
- EN: `public/home-saa/flag-gb.svg` (Union Jack chuẩn 20×15 — tạo mới; flag là biểu tượng chuẩn, khớp thiết kế GB-NIR).

## Files
| Vai trò | Đường dẫn | Thao tác |
|---------|-----------|----------|
| Locale constants/types | `lib/locale.ts` | tạo |
| Locale server reader | `lib/get-locale.ts` | tạo |
| Language selector (client) | `components/language-selector.tsx` | tạo |
| Cờ GB | `public/home-saa/flag-gb.svg` | tạo |
| Header wiring | `components/site-header.tsx` | sửa (đọc cookie, thay khối nút ngôn ngữ) |
| Tests | `components/language-selector.test.ts`, `lib/locale.test.ts` | tạo |

## Ràng buộc
- Header đang là Server Component — chỉ phần selector là client; không "use client" hoá cả header.
- Giữ test header hiện tại (`site-header.test.ts`) xanh (chỉ kiểm tra nav anchors).
