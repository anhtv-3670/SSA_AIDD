---
status: draft
authored_by: takumi
created: 2026-06-24
fcode: F003
lang: vi
---

# F003_AwardSystem — Business Context

## Mục tiêu

Giới thiệu toàn bộ hệ thống giải thưởng **Sun\* Annual Award (SAA) 2025** cho nhân viên đã đăng
nhập, giúp họ hiểu các hạng mục giải, số lượng và giá trị giải để tạo động lực tham gia.

## Người dùng & giá trị

- **Người dùng**: nhân viên Sun\* đã đăng nhập hệ thống SAA 2025.
- **Giá trị**: nắm rõ 6 hạng mục giải (đối tượng, số lượng, giá trị), tiếp cận nhanh từng hạng mục
  qua menu, và biết tới phong trào ghi nhận Sun\* Kudos.

## 6 hạng mục giải (nội dung tĩnh)

| Hạng mục | Số lượng | Giá trị |
|----------|----------|---------|
| Top Talent | 10 Đơn vị | 7.000.000 VNĐ / giải |
| Top Project | 02 Tập thể | 15.000.000 VNĐ / giải |
| Top Project Leader | 03 Cá nhân | 7.000.000 VNĐ |
| Best Manager | 01 Cá nhân | 10.000.000 VNĐ |
| Signature 2025 - Creator | 01 | 5.000.000 VNĐ (cá nhân) / 8.000.000 VNĐ (tập thể) |
| MVP (Most Valuable Person) | 01 | 15.000.000 VNĐ |

> Mô tả chi tiết từng hạng mục lấy nguyên văn từ thiết kế MoMorph (xem `award-data.ts` khi forge).

## Phạm vi

- **Trong phạm vi**: trang chỉ-đọc hiển thị hệ thống giải, điều hướng nội trang, banner Kudos.
- **Ngoài phạm vi**: trang chi tiết Sun\* Kudos (`/sun-kudos`), nộp đề cử, bình chọn, quản trị giải.

## Ràng buộc

- Chỉ người đã đăng nhập mới xem được (giống `/home`).
- **F012 (as-built):** Nội dung giải thưởng đọc từ bảng `awards` Supabase — không còn tĩnh/CMS-free.
- Ngôn ngữ: tiếng Việt (vi).
