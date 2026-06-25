# F007 — Technical Spec

## Kiến trúc
- Route `app/profile/page.tsx` (Server Component): auth guard mirror `app/home/page.tsx` (createClient → getUser → null ? redirect('/login')); read `getLocale()`; render SiteHeader + sections + SiteFooter. Dark `#00101A`.
- Mock profile data: `app/profile/profile-data.ts` (typed: name, dept, danhHieu/title, avatarInitial, stats, iconCollection[], sentKudos[], receivedKudos[]). Reuse `KudosEntry` type + entries from `app/sun-kudos/kudos-data.ts` where possible.

## Components (files < 200 lines)
| Vai trò | File | Client? |
|---------|------|---------|
| Page (guard + assemble) | `app/profile/page.tsx` | server |
| Hero (avatar + name + badge + icon collection) | `app/profile/profile-hero.tsx` | server |
| Stats box (+ disabled Mở Secret Box) | `app/profile/profile-stats.tsx` | server |
| KUDOS feed + sent/received filter | `app/profile/profile-kudos-feed.tsx` | client (filter) |
| Mock data | `app/profile/profile-data.ts` | — |

- Reuse F005 `app/sun-kudos/kudos-card.tsx` for feed cards. Add an optional `spam?: boolean` prop → render a "Spam" badge (top-right, red) when true. KEEP existing F005 usages unaffected (default false).
- Reuse the F004/F005 dropdown pattern for the sent/received filter (or a small inline select). Filter logic is trivial (two mock arrays) — can be a tiny pure `selectFeed(mode)` if testable value warrants; otherwise inline.

## Navigation wiring (links → /profile)
- `components/site-header.tsx`: top-right user icon → wrap/replace with a `<Link href="/profile">` (keep SignOutButton). The icon is currently a placeholder button.
- F005 `app/sun-kudos/kudos-person-block.tsx` (avatar+name used by KudosCard): wrap avatar/name in `<Link href="/profile">` (the single profile page). Also F005 `kudos-sidebar.tsx` gift recipients + F006 recipient list entries if low-cost.
- SIMPLIFICATION: all profile links → `/profile` (one page); per-user "Profile người khác" deferred. Document in code comment.

## Interaction
- Sent/Received filter: client state (`mode: "sent" | "received"`), swaps the mock array + updates the "(N)" count; default "sent" (per design "Đã gửi (5)").
- Like/copy-link: reuse KudosCard behavior. "Mở Secret Box": disabled placeholder. Icon collection: static gray slots.

## Styling
Inline + tokens (`#00101A`, `#FFEA9E`, cream card `#FFF8E1`, border `#998C5F`, Montserrat). Reuse hero-swirl bg + cover gradient (as home-hero/award-keyvisual). Desktop-first. Avatar = neutral placeholder (initial-in-circle) — no external image; reuse the F005/F006 avatar approach.

## Ghi chú triển khai (as-built)
- **name-as-h1 (M-2):** `profile-hero.tsx` render tên chủ profile bằng `<h1>` (36px gold) — tên người dùng là heading chính của trang.
- **H-1 (toast offset):** khi `spam=true` trên `KudosCard`, toast "Copy Link" dịch xuống (`top: 44px` thay vì `12px`) để không chồng lên badge Spam góc phải.
- **PersonBlock (F005 `kudos-person-block.tsx`):** toàn bộ block avatar + tên được bọc bằng `<Link href="/profile">` một tab stop duy nhất, `aria-label="Profile của {name}"`.

## Constraints
- Reuse SiteHeader/SiteFooter/getLocale/KudosCard; don't regress F005/F006 (KudosCard prop additive + default).
- Files < 200 lines. Existing suite (216) stays green; add tests only if pure logic emerges (e.g. selectFeed).
- Build/test on node 20 (`export PATH="/c/Users/trinh.viet.anh/AppData/Local/nvm/v20.20.2:$PATH"`).
