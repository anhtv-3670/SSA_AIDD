---
status: draft
authored_by: takumi
created: 2026-06-24
fcode: F003
lang: vi
---

# F003_AwardSystem — Technical Spec

## Overview

Trang **Hệ thống giải** (`/he-thong-giai`) — trang giới thiệu hệ thống giải thưởng SAA 2025,
chỉ đọc (read-only), dành cho người dùng đã đăng nhập. Cấu trúc từ trên xuống: hero key visual
("ROOT FURTHER" / "Sun* Annual Award 2025") → tiêu đề mục ("Hệ thống giải thưởng SAA 2025") →
menu điều hướng trái dạng sticky (6 hạng mục) → 6 thẻ giải thưởng chi tiết → banner Sun* Kudos
kèm CTA "Chi tiết".

Trang dùng lại toàn bộ hạ tầng auth của F001/F002 (`@supabase/ssr`, `lib/supabase/server`,
chốt bảo vệ cấp trang) và chia sẻ chrome (header/footer/banner Kudos) với trang home qua
thư mục `components/` (promote từ `app/home/`).

Nguồn thiết kế: MoMorph screen `zFYDgyj_pD` (fileKey `9ypp4enmFmdK3YAFJLIu6C`). Giá trị thị
giác lấy từ thiết kế — KHÔNG đoán pixel.

## Polymorphic Behavior

None.

## Cross-Cutting Logic

### Requirements

- FR-1: `/he-thong-giai` là Server Component, lấy người dùng qua `getUser()` phía server.
- FR-2: Nếu KHÔNG có người dùng hợp lệ → `redirect('/login')` (chốt bảo vệ cấp trang). [TC ID-1]
- FR-3: Nếu có người dùng → render đầy đủ trang. [TC ID-0]
- FR-4: Hiển thị hero key visual (ảnh nền cover/center-crop, tiêu đề "ROOT FURTHER", phụ đề "Sun* Annual Award 2025"), trang trí — không click. [spec item 3]
- FR-5: Hiển thị tiêu đề mục: phụ đề "Sun* annual awards 2025" (nhỏ, nhạt) + tiêu đề chính "Hệ thống giải thưởng SAA 2025" (lớn, vàng `#FFEA9E`). [TC ID-4]
- FR-6: Menu trái liệt kê 6 hạng mục theo thứ tự: Top Talent, Top Project, Top Project Leader, Best Manager, Signature 2025 - Creator, MVP. [TC ID-5]
- FR-7: Click một mục menu → smooth scroll tới section tương ứng; mục được set active (màu vàng + underline), mục trước mất active. [TC ID-9, ID-11]
- FR-8: Active state cũng cập nhật theo vị trí cuộn (scroll-spy / IntersectionObserver). [clarification]
- FR-9: Hover mục menu → highlight. [TC ID-10]
- FR-10: Hiển thị 6 thẻ giải thưởng, mỗi thẻ gồm: ảnh giải (336×336px), tiêu đề, mô tả, số lượng giải, giá trị giải. Read-only. [TC ID-6, ID-7]
- FR-11: Hiển thị banner Sun* Kudos (label "Phong trào ghi nhận", tiêu đề "Sun* Kudos", mô tả, CTA "Chi tiết"). [TC ID-8]
- FR-12: CTA "Chi tiết" + nav "Sun* Kudos" → điều hướng tới `/sun-kudos` (route dự kiến, chưa dựng). [TC ID-12]
- FR-13: Section ID không hợp lệ khi scroll → không lỗi JS, giữ nguyên vị trí. [TC ID-13]

### Business Rules

- BR-1: Kiểm tra phiên bằng `supabase.auth.getUser()` (xác thực server), KHÔNG dùng `getSession()` cho quyết định bảo vệ.
- BR-2: Chốt bảo vệ đặt ở cấp trang (`app/he-thong-giai/page.tsx`), không dồn vào layout.
- BR-3: **F012 (as-built):** Nội dung giải thưởng đọc từ bảng `awards` (Supabase) qua `getAwards()` — `award-data.ts` không còn là nguồn runtime; các giá trị được seed vào DB từ data gốc `award-data.ts`.

### Decision Logic

None.

### State Machines

- Nav active state: một-trong-sáu. Chuyển bằng (a) click mục, (b) section vào viewport (scroll-spy).

### Algorithms

- Scroll-spy: IntersectionObserver theo dõi 6 section; section có tỷ lệ hiển thị cao nhất → set nav item tương ứng active.
- Smooth scroll: `element.scrollIntoView({ behavior: 'smooth' })` với offset cho header sticky.

### External Integrations

- **Supabase Auth**: `getUser()` (đọc người dùng hiện tại). Dùng lại từ F001/F002.

### Verification

- Build + lint + type-check sạch.
- Test: chốt điều hướng khi chưa đăng nhập (mock `createClient`); render đủ 6 hạng mục + nội dung.

## User Stories

### US-1 — Xem hệ thống giải khi đã đăng nhập
Là người dùng đã đăng nhập, tôi mở `/he-thong-giai` và thấy đầy đủ 6 hạng mục giải thưởng SAA 2025.
- FR: FR-1, FR-3..FR-11 — Acceptance: có phiên → thấy hero, tiêu đề, menu 6 mục, 6 thẻ giải, banner Kudos.

### US-2 — Bị chặn khi chưa đăng nhập
Là khách chưa đăng nhập, khi mở `/he-thong-giai` tôi được đưa về `/login`.
- FR: FR-2 — Acceptance: không phiên → redirect `/login`, không lộ nội dung.

### US-3 — Điều hướng nhanh giữa các hạng mục
Là người dùng, tôi click mục menu trái để nhảy nhanh tới hạng mục giải tương ứng.
- FR: FR-7, FR-8, FR-9 — Acceptance: click → scroll mượt + active đúng mục; cuộn tay → active bám section.

### US-4 — Tìm hiểu Sun* Kudos
Là người dùng, tôi bấm "Chi tiết" ở banner Sun* Kudos để xem chi tiết.
- FR: FR-12 — Acceptance: click → điều hướng `/sun-kudos`.

### Edge Cases

See edge-cases.md.

## Key Entities

- **Award**: hạng mục giải (id, name, description, quantity, prizeValue, image). Dữ liệu tĩnh.
- **Supabase User**: định danh do Supabase Auth quản lý. Dùng lại từ tầng auth F001.

## Artifact References

- Screens: see screens.md (`SCR-award-system`).
- System docs: `docs/system/permissions.md` (thêm route `/he-thong-giai` được bảo vệ), `docs/system/architecture.md` (thư mục `components/` chia sẻ chrome).
- Phụ thuộc tính năng: F001 (auth), F002 (chrome dùng chung — header/footer/kudos).

## Assumptions

- Tầng auth (F001) và chrome (F002) đã hiện thực.
- `/sun-kudos` chưa tồn tại — link trỏ tới route dự kiến.
- Ảnh giải (medallion vàng) dùng raster thật cắt từ frame render MoMorph (`public/saa-2025/medallion-*.png`); gradient F002 giữ làm fallback khi thiếu `image`.
- Desktop-first (giống home), không breakpoint mobile riêng.

## Source Code References (dự kiến)

| Vai trò | Đường dẫn |
|---------|-----------|
| Award System page (Server Component, auth guard) | `app/he-thong-giai/page.tsx` |
| Hero key visual | `app/he-thong-giai/award-keyvisual.tsx` |
| Menu trái + scroll-spy (Client Component) | `app/he-thong-giai/award-category-nav.tsx` |
| Thẻ giải chi tiết | `app/he-thong-giai/award-detail-card.tsx` |
| Dữ liệu giải (tĩnh) | `app/he-thong-giai/award-data.ts` |
| Chrome dùng chung (promote từ home) | `components/site-header.tsx`, `components/site-footer.tsx`, `components/sun-kudos-banner.tsx` |
| Server client | `lib/supabase/server.ts` |

## Unresolved Questions

- Asset thật đã wire: hero `ROOT FURTHER` logo, 6 medallion, logo header Sun*, logo + nền Kudos (`public/saa-2025/`). Lấy bằng cách crop frame render (1440×6410, scale 1:1) theo toạ độ node — vì `get_figma_image` (500) và `get_media_file` (401) hỏng, `get_media_files` trả null cho các node composite.
- Còn tái dựng: nền swirl full-bleed của keyvisual (media node null) — giữ glow gradient; icon Target/Diamond/License/bell/user/VN giữ SVG dựng (generic, YAGNI).
- Trang `/sun-kudos` là phạm vi tương lai (ngoài F003).

## Spec Documents

- [x] technical-spec.md
- [x] business-context.md
- [x] screens.md
- [x] edge-cases.md
