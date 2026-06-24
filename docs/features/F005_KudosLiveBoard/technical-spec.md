# F005 — Technical Spec

## Kiến trúc
- Route `app/sun-kudos/page.tsx` (Server Component): auth guard (mirror `app/home/page.tsx` — `createClient()` → `getUser()` → redirect `/login`), read locale via `getLocale()`, render `<SiteHeader active="kudos" locale={locale}/>` + sections + `<SiteFooter/>`. Dark base `#00101A`.
- Sections as components under `app/sun-kudos/`. Client Components only where interaction needed (`"use client"`), rest server/presentational. Keep each file < 200 lines (split aggressively).
- Mock data: `app/sun-kudos/kudos-data.ts` — typed arrays (highlightKudos, allKudos, spotlightNames, tickerEntries, stats, giftRecipients, hashtags, departments). Content trích từ design (tên, message, hashtags #Dedicated #Inspiring, "388 KUDOS", stats 25, danh hiệu New/Rising/Legend Hero, "IDOL GIỚI TRẺ", "Nhận được 1 áo phông SAA"). Không bịa quá mức — đủ để minh hoạ.

## Components (as-built)
| Vai trò | File | Client? |
|---------|------|---------|
| Page (guard + assemble) | `app/sun-kudos/page.tsx` | server |
| Hero KV | `app/sun-kudos/kudos-hero.tsx` | server |
| Client shell (shared filter+search state) | `app/sun-kudos/kudos-client-shell.tsx` | client |
| Ô nhập / search bar (A.1) | `app/sun-kudos/kudos-compose-bar.tsx` | client (filter) |
| Section header (reuse) | `app/sun-kudos/kudos-section-header.tsx` | server |
| Highlight carousel + filters | `app/sun-kudos/kudos-highlight.tsx` | client |
| Kudos card (highlight + feed share core) | `app/sun-kudos/kudos-card.tsx` | client (like/copy) |
| Person block (avatar + name + dept + badge) | `app/sun-kudos/kudos-person-block.tsx` | server |
| Carousel arrow button | `app/sun-kudos/kudos-carousel-arrow.tsx` | client |
| Spotlight board | `app/sun-kudos/kudos-spotlight.tsx` | server (static) |
| All-kudos feed + sidebar layout | `app/sun-kudos/kudos-all.tsx` | client (search/filter) |
| Sidebar stats + lists | `app/sun-kudos/kudos-sidebar.tsx` | server |
| Filter dropdown (reuse pattern) | `app/sun-kudos/kudos-filter-dropdown.tsx` | client |
| Pure filter logic (shared) | `app/sun-kudos/kudos-filter.ts` | — |
| Mock data + types | `app/sun-kudos/kudos-data.ts` | — |

> `kudos-client-shell.tsx` là Client Component sở hữu `{hashtag, dept, query}` và truyền xuống `KudosHighlight` + `KudosAll`. `page.tsx` vẫn là Server Component thuần.
> `kudos-filter.ts` export hàm `filterKudos(list, filters)` thuần (không React) — dùng chung bởi shell (highlight) và `KudosAll` (feed), đảm bảo hai danh sách lọc nhất quán. Unit-testable riêng biệt.

## Tương tác (client, mock)
- Carousel: index state, prev/next, disabled at ends, "i/N".
- Like: per-card local `{liked, count}` toggle (gray↔red, ±1). No persistence.
- Copy Link: `navigator.clipboard.writeText(location.href)` + toast "Link copied — ready to share!" (simple toast util/state).
- Filters + search: derive filtered lists from mock; filter resets carousel page to 1; empty → empty-state text.
- Filter dropdown a11y: plain button menu (không phải listbox widget) — nút option focusable tự nhiên; trigger mở bằng ArrowUp/Down, roving focus qua các option, Escape đóng và trả focus về trigger.
- Placeholders: "Mở Secret Box" disabled; avatars/names/"Xem chi tiết"/images/word-cloud nodes non-interactive (no href, no handler) — must not throw.

## Assets
- Hero bg: reuse `/home-saa/hero-swirl.png`. KUDOS wordmark: reuse `/saa-2025/kudos-logo.svg`.
- Avatars: neutral placeholder (initial-in-circle), no external images.
- `get_figma_image` 500 / `get_media_file` 401 — if any new raster truly needed, crop from `get_frame_image` URL (see [[momorph-mcp-tools-need-session-restart]] technique). Prefer reuse/reconstruct over cropping dozens of tiny avatars.

## Styling
Inline styles + tokens per other pages. Tokens: base `#00101A`, gold `#FFEA9E`, border `#998C5F`/`rgba(46,57,64,1)`, cream card per design. Montserrat. Desktop-first (no mobile breakpoint), soft wrap like home.

## Ràng buộc
- Reuse existing `SiteHeader`/`SiteFooter`/`getLocale`. Header `active="kudos"`.
- Files < 200 lines; compose, don't bloat.
- No new test breakage (existing 114 stay green).
