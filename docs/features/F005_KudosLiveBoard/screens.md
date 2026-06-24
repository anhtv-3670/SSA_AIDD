# F005 — Screens

## SCR-sun-kudos (MoMorph `MaZUn5xHXZ`, node 2940:13431)
Dark base `#00101A`, gold accent `#FFEA9E`, Montserrat. Full page width; content column padded like other pages (96px 144px). Sections top→bottom. Exact px/colors per MoMorph nodes (implementer fetches via MCP).

### A — Hero KV (mms_A, 2940:13437)
- Full-bleed colorful feather bg (reuse `/home-saa/hero-swirl.png`), dark overlay.
- Title "Hệ thống ghi nhận và cảm ơn" + big KUDOS wordmark (reuse `/saa-2025/kudos-logo.svg`, scaled).
- A.1 input pill (2940:13449): pencil icon + placeholder "Hôm nay, bạn muốn gửi lời cảm ơn và ghi nhận đến ai?". **Scope:** client-side filter of ALL KUDOS feed (no send dialog).

### B — HIGHLIGHT KUDOS (mms_B, 2940:13451)
- Header: subtitle "Sun* Annual Awards 2025" + title "HIGHLIGHT KUDOS"; filters: two dropdowns "Hashtag" (B.1.1) + "Phòng ban" (B.1.2).
- Carousel (B.2): up to 5 highlight cards; center card prominent, neighbors faded. Cream card (`#FFF8E1`-ish), gold edges.
  - Card (B.3): sender block (avatar + name + dept code + hoa-thị stars + danh hiệu badge), arrow icon, receiver block, time "10:00 - 10/30/2025", content (max 3 lines, "…"), hashtags (max 5, "…"), action bar: like count + heart, "Copy Link", "Xem chi tiết".
- Slide nav (B.5): ◀ + "2/5" + ▶; arrows disabled at first/last.
- **Behavior:** prev/next paging; like toggle; copy-link toast; filter dropdowns reset page to 1 and filter both Highlight + All. "Xem chi tiết" + avatars = non-functional (placeholder). Empty: "Hiện tại chưa có Kudos nào."

### B.6/B.7 — SPOTLIGHT BOARD (2940:13476 / 2940:14174)
- Header "Sun* Annual Awards 2025" + "SPOTLIGHT BOARD".
- Dark board panel: "388 KUDOS" title, small search "Tìm kiếm", a word-cloud of Sunner names (static styled scatter; one name highlighted gold), a live ticker list at the bottom (looping/static lines "HH:MM Nguyễn… đã nhận được một Kudos mới"). **Pan/Zoom = static (placeholder).**

### C — ALL KUDOS (mms_C, 2940:13475)
- Header subtitle + title "ALL KUDOS". Two columns: feed (left) + sidebar (right).
- Feed card (C.3): sender/receiver blocks, time, content (max 5 lines, "…"), image gallery (max 5 thumbs), hashtags, action bar (like + Copy Link). Click image/avatar/detail = placeholder. Render full mock list (no infinite scroll). Empty: "Hiện tại chưa có Kudos nào."

### D — Sidebar (mms_D, 2940:13488)
- Stats box (D.1): 6 rows label+value — "Số Kudos bạn nhận được: 25", "…đã gửi: 25", "Số tim bạn nhận được: 25", "Số Secret Box đã mở: 25", "…chưa mở: 25"; button "Mở Secret Box / Mở quà" (D.1.8) = **disabled/placeholder** (no dialog).
- "10 SUNNER NHẬN QUÀ MỚI NHẤT" list (D.3): avatar + name "Huỳnh Dương Xuân" + "Nhận được 1 áo phông SAA". Empty: "Chưa có dữ liệu". Click = placeholder.

### Avatars
No avatar assets — use neutral placeholder (circle w/ initial or generic silhouette), consistent size per design.
