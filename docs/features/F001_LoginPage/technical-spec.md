# F001 — Technical Spec (re-implementation)

## Kiến trúc
- `app/login/page.tsx` (Server Component): keep the auth guard (`createClient` → `getUser` → if user `redirect('/home')`); read `?error=oauth`; read locale via `getLocale()`. Render header + hero + footer. Dark `#00101A`.
- Auth backend (FINAL, OAuth only after this change): `app/login/actions.ts` keeps `signInWithOAuth` + `signOut`. **Remove** `signInWithPassword` + the `loginSchema/LoginFormState` import.

## Files
| Action | Path | Note |
|--------|------|------|
| Rewrite | `app/login/page.tsx` | New dark hero layout; header + hero + Google CTA + footer |
| Create | `app/login/login-header.tsx` | Minimal header: logo (`/saa-2025/logo-sun.png`) + `<LanguageSelector>` |
| Create | `app/login/google-login-button.tsx` | Server Component form → `signInWithOAuth('google')`; gold button + Google G svg |
| Create | `app/login/login-footer.tsx` | Centered copyright (or inline in page if trivial) |
| Edit | `app/login/actions.ts` | Drop `signInWithPassword` + auth-schema import; keep OAuth + signOut |
| Edit | `app/login/actions.test.ts` | Remove the `signInWithPassword` describe block + import; keep OAuth/signOut tests |
| Delete | `app/login/login-form.tsx` | email/password form (gone from design) |
| Delete | `app/login/oauth-buttons.tsx` | replaced by single google-login-button |
| Delete | `lib/validation/auth-schema.ts` | loginSchema unused after password removal |
| Delete | `lib/validation/auth-schema.test.ts` | 13 tests for the removed schema |

## Google CTA
- `<form action={signInWithOAuth}>` + `<input type="hidden" name="provider" value="google">` + submit button styled gold (`#FFEA9E`, dark text, radius 8px, Montserrat 700, ~ "LOGIN With Google" + Google G logo). Server Component (no client JS needed) — same pattern as the old oauth-buttons.

## ROOT FURTHER
Styled Montserrat text (mirror `app/home/home-hero.tsx`), both lines cream/white per design (not gold).

## Assets (reuse)
`/home-saa/hero-swirl.png` (hero bg), `/saa-2025/logo-sun.png` (header logo). Google "G" = inline multi-color SVG.

## Constraints / regression
- Keep the authenticated→`/home` redirect and `?error=oauth` handling.
- `signInWithOAuth` still validates provider (google+github allowlist kept; only google surfaced).
- After deletions, the suite must be GREEN: removing `signInWithPassword` + auth-schema removes ~40 tests; remaining OAuth/signOut tests + other suites stay passing. No dangling imports.
- Run build/tests with node 20 (`export PATH="/c/Users/trinh.viet.anh/AppData/Local/nvm/v20.20.2:$PATH"`).
