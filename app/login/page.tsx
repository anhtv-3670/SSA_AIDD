import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getLocale } from "@/lib/get-locale";
import { isTestLoginEnabled } from "@/lib/test-login";
import { LoginHeader } from "./login-header";
import { LoginFooter } from "./login-footer";
import { GoogleLoginButton } from "./google-login-button";
import { TestLoginButton } from "./test-login-button";

// UI reconciled to MoMorph design GzbNeVGJHz (Google-only login).
// Auth backend (signInWithOAuth, signOut, /auth/callback) is final.

export const metadata: Metadata = {
  title: "Đăng nhập",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // EC-1: already authenticated → leave the login page. Send them to the same
  // post-login landing the OAuth flow uses (/home) so both paths are consistent.
  if (user) {
    redirect("/home");
  }

  const [{ error }, locale] = await Promise.all([searchParams, getLocale()]);
  const loginError =
    error === "oauth"
      ? "Đăng nhập bằng Google thất bại. Vui lòng thử lại."
      : error === "testlogin"
        ? "Đăng nhập test thất bại. Kiểm tra tài khoản seed (supabase/seed.sql)."
        : undefined;
  const showTestLogin = isTestLoginEnabled();

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#00101A" }}>
      <LoginHeader locale={locale} />

      {/* Hero — mms_B_Bìa: full-bleed feather key-visual + dark cover gradient */}
      <main
        className="relative flex-1 overflow-hidden"
        style={{ minHeight: "100vh" }}
        aria-label="Đăng nhập SAA 2025 — Root Further"
      >
        {/* B.1 Key Visual — reuse the home hero swirl raster */}
        <div className="absolute inset-0" style={{ zIndex: 0 }} aria-hidden="true">
          <Image src="/home-saa/hero-swirl.png" alt="" fill className="object-cover object-right-top" priority />
        </div>
        {/* Cover gradient — authoritative from the home hero (node 2167:9029) */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(12deg,#00101A 23.7%,rgba(0,18,29,.46) 38.34%,rgba(0,19,32,.00) 48.92%)",
            zIndex: 1,
          }}
          aria-hidden="true"
        />

        {/* Content column — Frame 487/550: left-aligned, vertically centered */}
        <div
          className="relative flex min-h-screen flex-col justify-center"
          style={{ padding: "80px 144px", gap: "40px", zIndex: 2, maxWidth: "760px" }}
        >
          {/* ROOT FURTHER wordmark — styled Montserrat text (mirrors home-hero), cream per design */}
          <div aria-label="ROOT FURTHER" style={{ fontFamily: "Montserrat, sans-serif", lineHeight: 0.9 }}>
            <span style={{ display: "block", fontSize: "clamp(72px,10vw,120px)", fontWeight: 900, color: "#FBF6E9", letterSpacing: "-2px" }}>
              ROOT
            </span>
            <span style={{ display: "block", fontSize: "clamp(72px,10vw,120px)", fontWeight: 900, color: "#FBF6E9", letterSpacing: "-2px" }}>
              FURTHER
            </span>
          </div>

          {/* Frame 550 — subtitle + CTA, gap 24px */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "496px" }}>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "20px", fontWeight: 700, lineHeight: "32px", color: "#FFFFFF", margin: 0 }}>
              Bắt đầu hành trình của bạn cùng SAA 2025.
              <br />
              Đăng nhập để khám phá!
            </p>

            {loginError ? (
              <p
                role="alert"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "#FFB4A8",
                  margin: 0,
                }}
              >
                {loginError}
              </p>
            ) : null}

            <GoogleLoginButton />

            {/* Dev-only test login — bypasses Google OAuth (gated by ENABLE_TEST_LOGIN, non-prod) */}
            {showTestLogin ? <TestLoginButton /> : null}
          </div>
        </div>

        {/* Footer pinned at the bottom of the hero */}
        <div className="absolute bottom-0 left-0 right-0" style={{ zIndex: 2 }}>
          <LoginFooter />
        </div>
      </main>
    </div>
  );
}
