import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getLocale } from "@/lib/get-locale";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { KudosHero } from "./kudos-hero";
import { KudosClientShell } from "./kudos-client-shell";
import { getKudosFeed, getHighlightKudos } from "@/lib/data/kudos-queries";
import { getHashtags, getDepartments } from "@/lib/data/catalog-queries";
import { getSecretBoxState } from "@/lib/data/secret-box";
import { getProfileStats } from "@/lib/data/profile-queries";
import type { KudosStats } from "./kudos-data";
import type { RecipientOption } from "./write-kudo/write-kudo-modal";

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

  // Fetch all data in parallel — feed, catalogs, box count, profile stats, recipients
  const [
    allEntries,
    highlightEntries,
    hashtagOptions,
    deptOptions,
    boxState,
    profileStats,
    profilesResult,
  ] = await Promise.all([
    getKudosFeed(supabase).catch(() => []),
    getHighlightKudos(supabase, 5).catch(() => []),
    getHashtags(supabase).catch(() => []),
    getDepartments(supabase).catch(() => []),
    getSecretBoxState(supabase).catch(() => ({ unopenedCount: 0 })),
    getProfileStats(supabase, user.id).catch(() => ({
      kudosReceived: 0,
      kudosSent: 0,
      hearts: 0,
      boxOpened: 0,
      boxUnopened: 0,
    })),
    // Load all profiles for the recipient autocomplete (exclude self)
    supabase
      .from("profiles")
      .select("id, full_name, dept_code, avatar_initial")
      .neq("id", user.id)
      .order("full_name", { ascending: true }),
  ]);

  // Map ProfileStats → KudosStats (sidebar field names)
  const stats: KudosStats = {
    received: profileStats.kudosReceived,
    sent: profileStats.kudosSent,
    hearts: profileStats.hearts,
    boxOpened: profileStats.boxOpened,
    boxUnopened: profileStats.boxUnopened,
  };

  // Map profiles rows → RecipientOption[]
  const recipients: RecipientOption[] = (profilesResult.data ?? []).map((p) => ({
    id: p.id,
    name: p.full_name ?? "",
    dept: p.dept_code ?? "",
    initial: p.avatar_initial ?? (p.full_name?.[0] ?? "?"),
  }));

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
        <KudosClientShell
          allEntries={allEntries}
          highlightEntries={highlightEntries}
          boxCount={boxState.unopenedCount}
          stats={stats}
          hashtags={hashtagOptions}
          departments={deptOptions}
          recipients={recipients}
        />
      </main>

      <SiteFooter />
    </div>
  );
}
