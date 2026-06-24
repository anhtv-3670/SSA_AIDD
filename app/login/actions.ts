"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { Provider } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";

const SUPPORTED_OAUTH_PROVIDERS = ["google", "github"] as const;
type SupportedProvider = (typeof SUPPORTED_OAUTH_PROVIDERS)[number];

// Where a successful login lands. /home is the authenticated landing page.
const POST_LOGIN_REDIRECT = "/home";

function isSupportedProvider(value: string): value is SupportedProvider {
  return (SUPPORTED_OAUTH_PROVIDERS as readonly string[]).includes(value);
}

/**
 * Resolves the request origin for the OAuth callback URL. Prefers the `Origin`
 * header, then `X-Forwarded-Host` (reverse proxies often strip `Origin`), then
 * `Host`, falling back to localhost for local development.
 */
async function resolveOrigin(): Promise<string> {
  const hdrs = await headers();
  const origin = hdrs.get("origin");
  if (origin) return origin;

  const forwardedHost = hdrs.get("x-forwarded-host");
  if (forwardedHost) {
    const proto = hdrs.get("x-forwarded-proto") ?? "https";
    return `${proto}://${forwardedHost}`;
  }

  const host = hdrs.get("host");
  if (host) {
    // Honor x-forwarded-proto when present; otherwise infer — only loopback hosts
    // are http, everything else defaults to https so prod callback URLs aren't
    // built as http:// (which Supabase would reject).
    const proto =
      hdrs.get("x-forwarded-proto") ??
      (/^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(host) ? "http" : "https");
    return `${proto}://${host}`;
  }

  return "http://localhost:3000";
}

/**
 * Starts an OAuth flow. Reads the provider from the submitted form, asks
 * Supabase for the provider authorization URL, then redirects the browser to it.
 * The provider sends the user back to `/auth/callback`.
 */
export async function signInWithOAuth(formData: FormData): Promise<void> {
  const provider = String(formData.get("provider") ?? "");
  if (!isSupportedProvider(provider)) {
    redirect("/login?error=oauth");
  }

  const supabase = await createClient();
  const origin = await resolveOrigin();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider as Provider,
    options: {
      redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(POST_LOGIN_REDIRECT)}`,
    },
  });

  if (error || !data?.url) {
    redirect("/login?error=oauth");
  }

  redirect(data.url);
}

/** Ends the session and returns the user to the login page. */
export async function signOut(): Promise<void> {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch {
    // Best-effort sign-out: always return the user to /login regardless.
  }
  redirect("/login");
}
