import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getLocale } from "@/lib/get-locale";
import { getAwards } from "@/lib/data/awards-queries";
import { SiteHeader } from "@/components/site-header";
import { HomeHero } from "./home-hero";
import { HomeAbout } from "./home-about";
import { HomeAwards } from "./home-awards";
import { SunKudosBanner } from "@/components/sun-kudos-banner";
import { SiteFooter } from "@/components/site-footer";
import { WriteKudoFab } from "@/components/write-kudo-fab";

export const metadata: Metadata = {
  title: "Trang chủ",
};

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Page-level auth guard (checked close to the data, per Next.js guidance).
  if (!user) {
    redirect("/login");
  }

  const locale = await getLocale();

  // Fetch awards from DB (read-only catalog, SELECT policy using(true))
  const awards = await getAwards(supabase);

  return (
    // Dark base: #00101A from Cover gradient start — authoritative
    <div style={{ backgroundColor: "#00101A", minHeight: "100vh" }}>
      {/* Fixed header bar — 80px tall, z-50 */}
      <SiteHeader userEmail={user.email ?? undefined} active="about" locale={locale} />

      {/* Hero — full-bleed, sits behind header */}
      <HomeHero />

      {/* Bìa content sections — padding 96px 144px, gap 120px, col centered
          Authoritative from node 2167:9030: padding 96px 144px, gap 120px */}
      <main
        id="main-content"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "120px",
          padding: "96px 144px",
          backgroundColor: "#00101A",
        }}
      >
        {/* ROOT FURTHER about content block — Frame 486 */}
        <HomeAbout />

        {/* Awards grid — Hệ thống giải thưởng */}
        <HomeAwards awards={awards} />

        {/* Sun* Kudos promo panel */}
        <SunKudosBanner />
      </main>

      {/* Footer */}
      <SiteFooter />

      {/* F009 FAB — fixed bottom-right, shown on all authenticated pages */}
      <WriteKudoFab />
    </div>
  );
}
