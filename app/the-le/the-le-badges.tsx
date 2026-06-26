"use client";

// Section 2 sub-component: 6 collectible badges in a grid, each with next/image + name.

import Image from "next/image";
import { COLLECTIBLE_BADGES, SECTION_COPY } from "./the-le-data";

const BASE_FONT: React.CSSProperties = {
  fontFamily: "Montserrat, sans-serif",
};

export function TheLeBadges() {
  return (
    <section>
      {/* Section title */}
      <p style={{ ...BASE_FONT, fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em",
        textTransform: "uppercase", color: "rgba(255,234,158,0.6)", margin: "0 0 6px" }}>
        Mục 2
      </p>
      <h3 style={{ ...BASE_FONT, fontSize: "14px", fontWeight: 700, color: "rgba(255,234,158,1)",
        margin: "0 0 8px", lineHeight: "1.4", textTransform: "uppercase" }}>
        {SECTION_COPY.section2Title}
      </h3>
      <p style={{ ...BASE_FONT, fontSize: "14px", fontWeight: 400, color: "rgba(255,255,255,0.75)",
        margin: "0 0 20px", lineHeight: "1.6" }}>
        {SECTION_COPY.section2Desc}
      </p>

      {/* 6-badge grid — auto-fill reflows from 3 columns to 2 on narrow viewports
          (min track 80px) so the 64px badges never overflow the clamped modal width. */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
        gap: "16px",
        marginBottom: "16px",
      }}>
        {COLLECTIBLE_BADGES.map((badge) => (
          <div key={badge.name} style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}>
            <Image
              src={badge.imagePath}
              alt={badge.name}
              width={64}
              height={64}
              style={{ objectFit: "contain" }}
            />
            <span style={{
              ...BASE_FONT,
              fontSize: "11px",
              fontWeight: 700,
              color: "rgba(255,234,158,0.85)",
              textAlign: "center",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              lineHeight: "1.4",
            }}>
              {badge.name}
            </span>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <p style={{ ...BASE_FONT, fontSize: "13px", fontWeight: 500,
        color: "rgba(255,255,255,0.65)", margin: 0, lineHeight: "1.6",
        fontStyle: "italic" }}>
        {SECTION_COPY.section2Footer}
      </p>
    </section>
  );
}
