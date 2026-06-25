import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getLocale } from "@/lib/get-locale";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProfileHero } from "./profile-hero";
import { ProfileStats } from "./profile-stats";
import { ProfileKudosFeed } from "./profile-kudos-feed";
import { PROFILE, SENT_KUDOS, RECEIVED_KUDOS } from "./profile-data";

export const metadata: Metadata = {
  title: "Profile",
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Auth guard — mirrors app/home/page.tsx (EC-1)
  if (!user) {
    redirect("/login");
  }

  const locale = await getLocale();

  return (
    <div style={{ backgroundColor: "#00101A", minHeight: "100vh" }}>
      {/* Fixed header — 80px tall, z-50 */}
      <SiteHeader
        userEmail={user.email ?? undefined}
        active="profile"
        locale={locale}
      />

      {/* Hero — full-bleed, sits under fixed header */}
      <ProfileHero profile={PROFILE} />

      <main
        id="main-content"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "80px",
          paddingTop: "80px",
          paddingBottom: "120px",
          backgroundColor: "#00101A",
        }}
      >
        {/* Section B — Stats box */}
        <ProfileStats stats={PROFILE.stats} />

        {/* Sections C + D — KUDOS header + sent/received feed */}
        <ProfileKudosFeed
          sentKudos={SENT_KUDOS}
          receivedKudos={RECEIVED_KUDOS}
        />
      </main>

      <SiteFooter />
    </div>
  );
}
