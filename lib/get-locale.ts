import { cookies } from "next/headers";

import { LOCALE_COOKIE, parseLocale, type Locale } from "./locale";

/**
 * Resolve the request locale from the `locale` cookie (server-side).
 * Falls back to DEFAULT_LOCALE when the cookie is absent or invalid (EC-1).
 * Server-only — imports `next/headers`; keep client code on `lib/locale.ts`.
 */
export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  return parseLocale(cookieStore.get(LOCALE_COOKIE)?.value);
}
