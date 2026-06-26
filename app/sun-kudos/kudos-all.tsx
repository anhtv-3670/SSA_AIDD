"use client";

// Authoritative: C_All kudos (2940:13475)
// Header: C.1 — subtitle "Sun* Annual Awards 2025", title "ALL KUDOS"
// Feed+sidebar layout: Frame 502 — row, gap 80px, padding 0 144px
// Feed column: C.2 — 680px wide, col gap 24px
// Feed card: C.3 — bg rgba(255,248,225,1), radius 24px, padding 40px 40px 16px 40px, col gap 16px
// Sidebar: D — 422px wide, col gap 24px

import { useMemo } from "react";
import { KudosSectionHeader } from "./kudos-section-header";
import { KudosCard } from "./kudos-card";
import { KudosSidebar } from "./kudos-sidebar";
import type { KudosEntry } from "@/lib/data/types";
import type { KudosStats } from "./kudos-data";
import { giftRecipients } from "./kudos-data";
import { filterKudos } from "./kudos-filter";

interface KudosAllProps {
  entries: KudosEntry[];
  hashtagFilter: string;
  deptFilter: string;
  query: string;
  /** Real stats for the logged-in user from profile_stats RPC. */
  stats: KudosStats;
}

export function KudosAll({ entries, hashtagFilter, deptFilter, query, stats }: KudosAllProps) {
  const filtered = useMemo(
    () => filterKudos(entries, { hashtag: hashtagFilter, dept: deptFilter, query }),
    [entries, hashtagFilter, deptFilter, query],
  );

  return (
    <section aria-label="All Kudos" style={{ width: "100%", display: "flex", flexDirection: "column", gap: "40px" }}>
      <KudosSectionHeader subtitle="Sun* Annual Awards 2025" title="ALL KUDOS" />

      {/* Two-column: feed + sidebar */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "80px",
          padding: "0 144px",
          alignItems: "flex-start",
        }}
      >
        {/* Feed column */}
        <div
          style={{
            width: "680px",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          {filtered.length === 0 ? (
            <div
              style={{
                padding: "60px 0",
                fontFamily: "Montserrat, sans-serif",
                fontSize: "18px",
                fontWeight: 700,
                color: "#999",
                textAlign: "center",
              }}
            >
              Hiện tại chưa có Kudos nào.
            </div>
          ) : (
            filtered.map((entry) => (
              <KudosCard key={entry.id} entry={entry} variant="feed" fullWidth />
            ))
          )}
        </div>

        {/* Sidebar — stats from DB; gift recipients are presentational (not backed by DB this pass) */}
        <KudosSidebar stats={stats} giftRecipients={giftRecipients} />
      </div>
    </section>
  );
}
