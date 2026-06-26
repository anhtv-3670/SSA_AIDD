"use client";

// Profile kudos feed — Section C + D (nodes 362:5084–362:5091).
// Client component: owns the sent/received filter state.
// Reuses KudosCard from F005 (with additive spam? prop).
// Default filter: "sent" per design "Đã gửi (5)".
// EC-3: filter toggle updates feed + "(N)" count.
// EC-4: empty state shows Vietnamese message.

import { useState } from "react";
import { KudosCard } from "@/app/sun-kudos/kudos-card";
import type { ProfileKudosEntry } from "@/lib/data/types";

type FeedMode = "sent" | "received";

const FONT_BASE = {
  fontFamily: "Montserrat, sans-serif",
  fontWeight: 700,
} as const;

interface ProfileKudosFeedProps {
  sentKudos: ProfileKudosEntry[];
  receivedKudos: ProfileKudosEntry[];
}

export function ProfileKudosFeed({ sentKudos, receivedKudos }: ProfileKudosFeedProps) {
  const [mode, setMode] = useState<FeedMode>("sent");

  const feed = mode === "sent" ? sentKudos : receivedKudos;
  const sentCount = sentKudos.length;
  const receivedCount = receivedKudos.length;

  return (
    <section
      aria-label="Kudos feed"
      style={{
        // Node 362:5083: padding 0 144px, centered column
        padding: "0 144px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "40px",
      }}
    >
      {/* Section C — Header + filter (node 362:5084) */}
      <div
        style={{
          width: "680px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {/* C.1 subtitle — Montserrat 700 24px white (node 362:5085) */}
        <p style={{ ...FONT_BASE, fontSize: "24px", lineHeight: "32px", color: "#FFFFFF", margin: 0 }}>
          Sun* Annual Awards 2025
        </p>

        {/* Divider — node 362:5086: rgba(46,57,64,1) */}
        <div
          style={{ width: "100%", height: "1px", backgroundColor: "rgba(46,57,64,1)" }}
          aria-hidden="true"
        />

        {/* C.2 + C.3 — KUDOS title + filter row (node 362:5087) */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "32px",
          }}
        >
          {/* KUDOS — Montserrat 700 57px gold (node 362:5088) */}
          <h2
            style={{
              ...FONT_BASE,
              fontSize: "57px",
              lineHeight: "64px",
              letterSpacing: "-0.25px",
              color: "#FFEA9E",
              margin: 0,
            }}
          >
            KUDOS
          </h2>

          {/* C.3 Filter dropdown — native <select> styled to match secondary button (node 362:5089).
              Native select: simplest accessible pattern; mirrors border/bg tokens from F005 sidebar.
              Keyboard-accessible out of the box; no custom JS needed. */}
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as FeedMode)}
            aria-label="Lọc Kudos đã gửi hoặc đã nhận"
            style={{
              border: "1px solid #998C5F",
              borderRadius: "4px",
              background: "rgba(255,234,158,0.10)",
              padding: "16px 24px",
              ...FONT_BASE,
              fontSize: "16px",
              lineHeight: "24px",
              color: "#FFFFFF",
              cursor: "pointer",
              appearance: "none",
              WebkitAppearance: "none",
              // Inline chevron via background SVG — matches "Button down" node
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none'%3E%3Cpath d='M6 9l6 6 6-6' stroke='%23FFFFFF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 12px center",
              paddingRight: "44px",
            }}
          >
            <option value="sent" style={{ background: "#00101A", color: "#FFFFFF" }}>
              {`Đã gửi (${sentCount})`}
            </option>
            <option value="received" style={{ background: "#00101A", color: "#FFFFFF" }}>
              {`Đã nhận (${receivedCount})`}
            </option>
          </select>
        </div>
      </div>

      {/* Section D — Feed (node 362:5091): col gap 24px, 680px wide */}
      <div
        style={{
          width: "680px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        {feed.length === 0 ? (
          // EC-4: empty state
          <p
            style={{
              ...FONT_BASE,
              fontSize: "16px",
              lineHeight: "24px",
              color: "#999",
              textAlign: "center",
              margin: 0,
              padding: "40px 0",
            }}
          >
            Hiện tại chưa có Kudos nào.
          </p>
        ) : (
          feed.map((entry) => (
            <KudosCard
              key={entry.id}
              entry={entry}
              variant="feed"
              fullWidth
              spam={entry.spam}
            />
          ))
        )}
      </div>
    </section>
  );
}
