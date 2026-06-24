// Authoritative: Frame 552 (2940:14170)
// BG rectangle: #00101A full width
// Header: B.6 — subtitle "Sun* Annual Awards 2025", title "SPOTLIGHT BOARD"
// Board panel: B.7 (2940:14174) — 1157x548px, border 1px #998C5F, radius 47.14px
// "388 KUDOS" — large title on board
// Word-cloud: static scatter of names; one name highlighted gold (#FFEA9E)
// Ticker: list of live lines at bottom "HH:MM Nguyễn… đã nhận được một Kudos mới"
// Pan/zoom = static (placeholder per spec)

import type { CSSProperties } from "react";
import { KudosSectionHeader } from "./kudos-section-header";
import {
  spotlightNames,
  spotlightHighlighted,
  tickerEntries,
} from "./kudos-data";

// Pseudo-random-ish positions for the word-cloud (deterministic, seeded by index)
function getCloudStyle(i: number, total: number): CSSProperties {
  const cols = 5;
  const rows = Math.ceil(total / cols);
  const col = i % cols;
  const row = Math.floor(i / cols);
  // slight jitter per position
  const jitters = [0, 8, -6, 12, -4, 6, -10, 4, -8, 10];
  const jitterX = jitters[i % jitters.length] ?? 0;
  const jitterY = jitters[(i * 3 + 1) % jitters.length] ?? 0;
  // Vary font size slightly
  const sizes = [13, 15, 12, 16, 14, 13, 15, 12];
  const fontSize = sizes[i % sizes.length] ?? 14;

  return {
    position: "absolute",
    left: `${(col / cols) * 88 + 2 + jitterX * 0.5}%`,
    top: `${((row / rows) * 75) + 5 + jitterY * 0.4}%`,
    fontFamily: "Montserrat, sans-serif",
    fontSize: `${fontSize}px`,
    fontWeight: 700,
    whiteSpace: "nowrap",
    userSelect: "none" as const,
    cursor: "default",
  };
}

export function KudosSpotlight() {
  return (
    <section
      aria-label="Spotlight Board"
      style={{
        width: "100%",
        backgroundColor: "rgba(0,16,26,1)",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        paddingTop: "16px",
        paddingBottom: "40px",
      }}
    >
      <KudosSectionHeader subtitle="Sun* Annual Awards 2025" title="SPOTLIGHT BOARD" />

      {/* Board panel — 1157px wide centered */}
      <div
        style={{
          width: "1157px",
          margin: "0 auto",
          border: "1px solid #998C5F",
          borderRadius: "47px",
          overflow: "hidden",
          backgroundColor: "#000D15",
          minHeight: "548px",
          display: "flex",
          flexDirection: "column",
          padding: "32px 40px 24px",
          gap: "16px",
        }}
        aria-label="Spotlight board — static display"
      >
        {/* Top row: 388 KUDOS title + search placeholder */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h3
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "48px",
              fontWeight: 700,
              lineHeight: "56px",
              color: "#FFEA9E",
              margin: 0,
              letterSpacing: "-0.5px",
            }}
          >
            388 KUDOS
          </h3>

          {/* Search placeholder — non-interactive per scope */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 16px",
              border: "1px solid #998C5F",
              borderRadius: "24px",
              background: "rgba(255,234,158,0.07)",
              opacity: 0.6,
              cursor: "default",
            }}
            aria-hidden="true"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="8" stroke="#FFFFFF" strokeWidth="2" />
              <path d="M21 21l-4.35-4.35" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "14px",
                fontWeight: 700,
                color: "#FFFFFF",
              }}
            >
              Tìm kiếm
            </span>
          </div>
        </div>

        {/* Word-cloud area */}
        <div
          style={{
            position: "relative",
            flex: 1,
            minHeight: "320px",
          }}
          aria-label="Sunner name cloud"
        >
          {spotlightNames.map((name, i) => {
            const isHighlighted = name === spotlightHighlighted;
            return (
              <span
                key={name + i}
                style={{
                  ...getCloudStyle(i, spotlightNames.length),
                  color: isHighlighted ? "#FFEA9E" : "rgba(255,255,255,0.55)",
                  textShadow: isHighlighted
                    ? "0 0 12px rgba(255,234,158,0.6)"
                    : undefined,
                  fontSize: isHighlighted ? "18px" : getCloudStyle(i, spotlightNames.length).fontSize,
                }}
              >
                {name}
              </span>
            );
          })}
        </div>

        {/* Ticker lines */}
        <div
          style={{
            borderTop: "1px solid rgba(153,140,95,0.4)",
            paddingTop: "12px",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
          aria-label="Recent kudos ticker"
        >
          {tickerEntries.map((line, i) => (
            <p
              key={i}
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "13px",
                fontWeight: 700,
                lineHeight: "20px",
                color: "rgba(255,255,255,0.65)",
                margin: 0,
              }}
            >
              <span style={{ color: "#FFEA9E", marginRight: "8px" }}>{line.time}</span>
              {line.text}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
