import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getLocale } from "@/lib/get-locale";
import { getProfile } from "@/lib/data/profile-queries";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WriteKudoFab } from "@/components/write-kudo-fab";
import { ProfileHero } from "./profile-hero";
import { ProfileStats } from "./profile-stats";
import { ProfileKudosFeed } from "./profile-kudos-feed";

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

  const [locale, profile] = await Promise.all([
    getLocale(),
    getProfile(supabase),
  ]);

  return (
    <div style={{ backgroundColor: "#00101A", minHeight: "100vh" }}>
      {/* Fixed header — 80px tall, z-50 */}
      <SiteHeader
        userEmail={user.email ?? undefined}
        active="profile"
        locale={locale}
      />

      {/* Hero — full-bleed, sits under fixed header */}
      <ProfileHero
        profile={profile}
        heroTierName={profile.heroTierName}
        badgeCollection={profile.badgeCollection}
      />

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
        <ProfileStats stats={profile.stats} />

        {/* Sections C + D — KUDOS header + sent/received feed */}
        <ProfileKudosFeed
          sentKudos={profile.sentKudos}
          receivedKudos={profile.receivedKudos}
        />
      </main>

      <SiteFooter />

      {/* F009 FAB — fixed bottom-right, shown on all authenticated pages */}
      <WriteKudoFab />
    </div>
  );
}
