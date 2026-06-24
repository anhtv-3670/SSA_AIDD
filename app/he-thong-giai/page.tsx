import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getLocale } from "@/lib/get-locale";
import { AwardKeyvisual } from "./award-keyvisual";
import { AwardCategoryNav } from "./award-category-nav";
import { AwardDetailCard } from "./award-detail-card";
import { AWARDS } from "./award-data";
import { SiteHeader } from "@/components/site-header";
import { SunKudosBanner } from "@/components/sun-kudos-banner";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Hệ thống giải",
};

export default async function HeThongGiaiPage() {
  // Auth guard — mirrors app/home/page.tsx exactly (BR-1 / FR-1/2/3)
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const locale = await getLocale();

  // Build nav items from AWARDS (id + name only — no extra data needed in nav)
  const navItems = AWARDS.map(({ id, name }) => ({ id, name }));

  return (
    // Dark base: #00101A — authoritative from design tokens
    <div style={{ backgroundColor: "#00101A", minHeight: "100vh" }}>
      {/* Fixed header bar — 80px tall, z-50; "Award Information" active on this page */}
      <SiteHeader userEmail={user.email ?? undefined} active="award" locale={locale} />

      {/* Keyvisual hero — full-bleed, sits behind header */}
      <AwardKeyvisual />

      {/* Main content column — padding 96px 144px, gap 120px, authoritative from Bìa node */}
      <main
        id="main-content"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "120px",
          padding: "96px 144px",
          backgroundColor: "#00101A",
        }}
      >
        {/* mms_A_Title — section heading block (313:8453): col gap 16px */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            width: "100%",
          }}
        >
          {/* "Sun* Annual Awards 2025" — 313:8454: Montserrat 700 24px white, textAlign center */}
          <p
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "24px",
              fontWeight: 700,
              lineHeight: "32px",
              color: "#FFFFFF",
              textAlign: "center",
              margin: 0,
            }}
          >
            Sun* Annual Awards 2025
          </p>

          {/* Rectangle 26 divider — 1px rgba(46,57,64,1) */}
          <hr
            style={{
              border: "none",
              borderTop: "1px solid rgba(46,57,64,1)",
              margin: 0,
            }}
          />

          {/* "Hệ thống giải thưởng SAA 2025" — 313:8457: Montserrat 700 57px #FFEA9E letterSpacing -0.25px */}
          <h1
            id="awards-heading"
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "57px",
              fontWeight: 700,
              lineHeight: "64px",
              letterSpacing: "-0.25px",
              color: "#FFEA9E",
              margin: 0,
            }}
          >
            Hệ thống giải thưởng SAA 2025
          </h1>
        </div>

        {/* mms_B — two-column layout: sticky nav left + cards right (313:8458) row gap 80px */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "80px",
            alignItems: "flex-start",
            width: "100%",
          }}
        >
          {/* Left column: sticky category nav (178px wide) */}
          <AwardCategoryNav items={navItems} />

          {/* Right column: award detail cards, col gap 80px */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "80px",
              flex: 1,
              minWidth: 0,
            }}
          >
            {AWARDS.map((award, index) => (
              <AwardDetailCard key={award.id} {...award} index={index} />
            ))}
          </div>
        </div>

        {/* Sun* Kudos banner — mms_D1_Sunkudos (335:12023) */}
        <SunKudosBanner />
      </main>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}
