// Dev/E2E test-login gate. Lets the login page bypass the real Google OAuth
// round-trip by signing in a seeded test account via Supabase password auth.
//
// SAFETY: available ONLY when ENABLE_TEST_LOGIN="true" AND not in production.
// The flag is server-only (NOT NEXT_PUBLIC), so it never reaches the client and
// can't be toggled from the browser. The server action re-checks this too.

/** True only when test login is explicitly enabled and we are not in production. */
export function isTestLoginEnabled(): boolean {
  return (
    process.env.ENABLE_TEST_LOGIN === "true" &&
    process.env.NODE_ENV !== "production"
  );
}

/** Seeded test credentials (overridable via env). Defaults match supabase/seed.sql. */
export function testCredentials(): { email: string; password: string } {
  return {
    email: process.env.TEST_USER_EMAIL ?? "test@example.com",
    password: process.env.TEST_USER_PASSWORD ?? "password123",
  };
}
