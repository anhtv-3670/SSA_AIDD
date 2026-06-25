# F006 — Technical Spec

## Kiến trúc
Presentational client components under `app/sun-kudos/write-kudo/`. No backend. Modal open-state lives in `kudos-client-shell.tsx` (F005); compose bar triggers open; shell renders the modal.

## Components / files (19 files shipped)
| Vai trò | File | Client? |
|---------|------|---------|
| Modal orchestrator (open/close, form state, submit, Escape/overlay close, toast) | `write-kudo-modal.tsx` | client |
| Dialog shell (overlay + scroll container) | `write-kudo-dialog-shell.tsx` | client |
| Recipient autocomplete input | `write-kudo-recipient.tsx` | client |
| Recipient dropdown list | `write-kudo-recipient-list.tsx` | client |
| Danh hiệu input + helper text | `write-kudo-danh-hieu.tsx` | client |
| Editor toolbar (decorative B/I/S/list/link/quote) | `write-kudo-editor-toolbar.tsx` | client |
| Editor (toolbar + textarea + helper) | `write-kudo-editor.tsx` | client |
| Hashtag chip (individual, removable) | `write-kudo-hashtag-chip.tsx` | client |
| Hashtag dropdown (mock tag list) | `write-kudo-hashtag-dropdown.tsx` | client |
| Hashtag picker (1–5 chips + dropdown) | `write-kudo-hashtags.tsx` | client |
| Image thumbnail (preview + remove) | `write-kudo-image-thumb.tsx` | client |
| Image local-preview (max 5, jpg/png) | `write-kudo-images.tsx` | client |
| Anonymous checkbox + name input | `write-kudo-anonymous.tsx` | client |
| Footer (Hủy / Gửi buttons) | `write-kudo-footer.tsx` | client |
| Success toast | `write-kudo-toast.tsx` | client |
| Reusable field label (text + required asterisk) | `write-kudo-field-label.tsx` | client |
| Shared inline styles / tokens | `write-kudo-styles.ts` | — |
| Mock data (Sunner list, hashtag list) | `write-kudo-mock-data.ts` | — |
| Pure validation | `write-kudo-validation.ts` | — (testable) |

All files under `app/sun-kudos/write-kudo/`.

## Validation (pure — `validateWriteKudo(form)`)
- `recipient` required (non-empty after trim) · `danhHieu` required · `content` required (non-empty trim) · `hashtags` length 1–5.
- Returns `{ recipient?, danhHieu?, content?, hashtags? }` error map + `isValid`. Used to disable Gửi and to show per-field errors on submit attempt.
- `isSubmittable` gate in the orchestrator mirrors these four conditions exactly so the button never enables into a guaranteed validation error.
- Image: jpg/png only, max 5 — enforced in the images component on add (not part of submit validity since optional).

## Interaction (client)
- Recipient: input filters a mock Sunner list (reuse names from kudos-data); select fills value.
- Hashtag: "+ Hashtag" opens a small dropdown of mock tags → chip; "x" removes; block >5 with a message.
- Image: `<input type=file accept="image/png,image/jpeg" multiple>`; `URL.createObjectURL` preview; revoke on remove/unmount; reject non-jpg/png; hide "+ Image" at 5.
- Anonymous: checkbox toggles an anonymous-name text input.
- Toolbar buttons: rendered, `type="button"`, no-op (decorative); "Tiêu chuẩn cộng đồng" = non-nav placeholder.
- Submit: on click, run `validateWriteKudo`; invalid → show errors (red border + message), do not close; valid → toast "Đã gửi Kudos!" + close + reset. Toast is rendered **outside the `open` guard** so it survives `open→false` and remains visible after the modal closes. Gửi `disabled` while invalid.
- Close: Hủy / overlay click / Escape → close + discard (no confirm). Focus returns to the compose-bar trigger (WCAG 2.4.3, captured on open via `previouslyFocused` ref).

## Integration (F005)
- `kudos-client-shell.tsx`: add `writeOpen` state; render `<WriteKudoModal open={writeOpen} onClose={...}/>`; pass `onOpenWrite` to compose bar.
- `kudos-compose-bar.tsx`: the A.1 "gửi lời cảm ơn" input becomes a button-styled trigger (looks like the input, `role` button, opens modal). The second "Tìm kiếm Sunner" input keeps the existing `query` filter. Remove A.1's contribution to `query` (query now driven only by the Sunner search).

## Styling
Inline styles + tokens (`#00101A`, `#FFEA9E`, cream `#FFF8E1`, border `#998C5F`, Montserrat). Files < 200 lines. Toast: reuse the simple toast pattern from `kudos-card.tsx` (or a tiny shared toast).

## Ghi chú cross-feature (F007)
- `KudosCard` (`app/sun-kudos/kudos-card.tsx`) đã nhận prop `spam?: boolean` (additive, default `false`) — không ảnh hưởng F006.
- Avatars/names trong `kudos-person-block.tsx` (dùng bởi KudosCard) đã link → `/profile`. Recipient list của F006 (`write-kudo-recipient-list.tsx`) là selection UI (button), không liên quan — không thay đổi.

## Constraints
- Reuse a toast helper; avoid React-Compiler immutability pitfalls (functional setState; refs for timers; revoke object URLs in effect cleanup).
- Existing suite stays green; add tests for `write-kudo-validation.ts`.
- Build/test on node 20.
