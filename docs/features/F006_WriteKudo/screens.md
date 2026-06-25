# F006 — Screens

## SCR-write-kudo (MoMorph `ihQ26W78P2`, node 520:11602)
Modal cream card (`#FFF8E1`-ish) căn giữa trên overlay tối, scroll nội bộ. Đóng bằng overlay-click/Escape/Hủy.

### A — Title (I520:11647;520:9870)
"Gửi lời cám ơn và ghi nhận đến đồng đội" — lớn, đậm, canh giữa, đen.

### B — Người nhận* (520:9871 / search 520:9873)
- Label "Người nhận" + "*". Input 56px, viền `#998C5F`, radius 8px, placeholder "Tìm kiếm" + chevron.
- Autocomplete: gõ → lọc danh sách Sunner (mock); chọn → điền tên (+ avatar). Required. Trim input. Rỗng khi Gửi → viền đỏ + lỗi.

### Danh hiệu (design field, ngoài spec list)
- Label "Danh hiệu" + "*". Text input, placeholder "Dành tặng một danh hiệu cho đồng đội". Helper: "Ví dụ: Người truyền động lực cho tôi." / "Danh hiệu sẽ hiển thị làm tiêu đề Kudos của bạn." (Include per design; required per asterisk.)

### C/D — Editor (toolbar 520:9877 + textarea 520:9886)
- Toolbar: B, I, S, number-list, link, quote (rendered, **decorative/non-functional**) + link "Tiêu chuẩn cộng đồng" (right, đỏ, non-nav placeholder).
- Textarea*, placeholder "Hãy gửi gắm lời cám ơn và ghi nhận đến đồng đội tại đây nhé!". Helper dưới: "Bạn có thể '@ + tên' để nhắc tới đồng nghiệp khác" ('@' là text thường). Required.

### E — Hashtag* (520:9890)
- Label "Hashtag" + "*". Button "+ Hashtag" + note "Tối đa 5". Chips đã thêm với "x" để xoá. 1–5 bắt buộc; chặn tag thứ 6 (thông báo "Tối đa 5 hashtag"). Nguồn tag: mock list (dropdown khi bấm +).

### F — Image (520:9896)
- Label "Image". Thumbnails (vuông) + nút "x" xoá từng ảnh. Nút "+ Image" + "Tối đa 5". Local preview (URL.createObjectURL), chấp nhận jpg/png; loại khác → lỗi định dạng. Đủ 5 → ẩn "+ Image"; xoá → hiện lại. Không bắt buộc.

### G — Ẩn danh (520:14099)
- Checkbox "Gửi lời cám ơn và ghi nhận ẩn danh" (mặc định off). Bật → hiện ô text nhập tên ẩn danh; tắt → ẩn ô.

### H — Footer (520:9905)
- "Hủy ✕" (luôn enabled → đóng, bỏ thay đổi) + "Gửi ▷" (gold, primary). Gửi **disabled** tới khi đủ required (người nhận + danh hiệu + nội dung + ≥1 hashtag). Gửi hợp lệ → toast "Đã gửi Kudos!" (tồn tại độc lập sau khi modal đóng) + đóng + reset.

### Trigger
Mở từ compose bar F005 trên /sun-kudos (input "Hôm nay, bạn muốn gửi lời cảm ơn..."). Bấm vào bar → mở modal (thay vì lọc). Bar "Tìm kiếm Sunner" giữ filter.
