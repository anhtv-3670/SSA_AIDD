# F001 — Screens

## SCR-login (MoMorph `GzbNeVGJHz`, node 662:14387)
Dark base `#00101A`, full-bleed feather hero, gold `#FFEA9E`. Full-viewport (no app chrome reuse beyond LanguageSelector + footer text).

### A — Header (mms_A, 662:14391)
- 1440×80, padding 12px 144px, bg `rgba(11,15,18,0.8)`, row space-between.
- A.1 Logo (left): reuse `/saa-2025/logo-sun.png` ("Sun* Annual Awards 2025" lockup).
- A.2 Language (right): reuse F004 `<LanguageSelector>` (VN/EN). Server reads cookie via `getLocale()`.

### B — Bìa / main (mms_B, 662:14393)
- B.1 Key Visual (662:14395): full-bleed `/home-saa/hero-swirl.png`, dark base, cover gradient overlay (same as home-hero: `linear-gradient(12deg,#00101A 23.7%,...)`).
- Content column (Frame 487 → Frame 550, 662:14755): starts x≈144, col.
  - ROOT FURTHER wordmark: large Montserrat styled text, cream/white both lines (per design), letterSpacing tight. (home-hero renders gold 2nd line; here both cream — match design.)
  - Frame 550 (gap 24px, width 496px): 
    - Subtitle (662:14753): "Bắt đầu hành trình của bạn cùng SAA 2025." + "Đăng nhập để khám phá!" — Montserrat 700 ~20px white, 2 lines.
    - B.3 Login button (662:14425, 305×60): gold `#FFEA9E` bg, dark text "LOGIN With Google" + Google "G" logo, radius ~8px. Wires to `signInWithOAuth('google')` (server-action form). Hover: subtle.

### D — Footer (mms_D, 662:14447)
- Centered "Bản quyền thuộc về Sun* © 2025" (Montserrat 700 16px white) on dark, top border `#2E3940`. Minimal — no nav/logo.

### States
- Already authenticated → redirect `/home`.
- OAuth error (`?error=oauth`) → show a small error message above/near the button.
