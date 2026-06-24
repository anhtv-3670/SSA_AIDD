import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { getSupabaseEnv } from "./env";

/**
 * Refreshes the Supabase auth session on every request and propagates the
 * refreshed cookies onto the response. Called from the root `proxy.ts`
 * (Next.js 16 renamed Middleware → Proxy).
 *
 * Also redirects already-authenticated users away from `/login`.
 */
export async function updateSession(request: NextRequest): Promise<NextResponse> {
  let response = NextResponse.next({ request });

  const { url, anonKey } = getSupabaseEnv();
  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // IMPORTANT: revalidate the auth token. Do not insert logic between
  // createServerClient and getUser — it can desync the session.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Signed-in users have no business on /login — send them to the home landing.
  if (user && request.nextUrl.pathname === "/login") {
    const homeUrl = request.nextUrl.clone();
    homeUrl.pathname = "/home";
    return NextResponse.redirect(homeUrl);
  }

  return response;
}
