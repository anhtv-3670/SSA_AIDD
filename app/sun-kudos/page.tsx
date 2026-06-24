import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getLocale } from "@/lib/get-locale";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { KudosHero } from "./kudos-hero";
import { KudosClientShell } from "./kudos-client-shell";

export const metadata: Metadata = {
  title: "Sun* Kudos Live Board",
};

export default async function SunKudosPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Auth guard — mirrors app/home/page.tsx
  if (!user) {
    redirect("/login");
  }

  const locale = await getLocale();

  return (
    <div style={{ backgroundColor: "#00101A", minHeight: "100vh" }}>
      {/* Fixed header — 80px tall, z-50 */}
      <SiteHeader
        userEmail={user.email ?? undefined}
        active="kudos"
        locale={locale}
      />

      {/* Hero — full-bleed, sits under fixed header */}
      <KudosHero />

      {/* Main content — col gap 120px, no horizontal padding
          (each section manages its own 144px padding) */}
      <main
        id="main-content"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          gap: "120px",
          paddingTop: "64px",
          paddingBottom: "120px",
          backgroundColor: "#00101A",
        }}
      >
        {/* Client shell owns shared state: query, hashtag, dept filters */}
        <KudosClientShell />
      </main>

      <SiteFooter />
    </div>
  );
}
