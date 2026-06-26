"use client";

// Section 1 sub-component: 4 Hero tiers rendered as CSS pills (NOT images).
// Each tier: pill badge (name) + count label + description text.

import { HERO_TIERS, SECTION_COPY } from "./the-le-data";

// Pill color map — warm golden tones matching the dark #00101A panel.
const TIER_COLORS: Record<string, { bg: string; text: string }> = {
  "New Hero":     { bg: "rgba(255,234,158,0.18)", text: "rgba(255,234,158,1)" },
  "Rising Hero":  { bg: "rgba(255,200,80,0.22)",  text: "rgba(255,210,100,1)" },
  "Super Hero":   { bg: "rgba(255,160,40,0.22)",  text: "rgba(255,180,60,1)"  },
  "Legend Hero":  { bg: "rgba(255,100,10,0.22)",  text: "rgba(255,140,40,1)"  },
};

const BASE_FONT: React.CSSProperties = {
  fontFamily: "Montserrat, sans-serif",
};

export function TheLeHeroTiers() {
  return (
    <section>
      {/* Section title */}
      <p style={{ ...BASE_FONT, fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em",
        textTransform: "uppercase", color: "rgba(255,234,158,0.6)", margin: "0 0 6px" }}>
        Mục 1
      </p>
      <h3 style={{ ...BASE_FONT, fontSize: "14px", fontWeight: 700, color: "rgba(255,234,158,1)",
        margin: "0 0 8px", lineHeight: "1.4", textTransform: "uppercase" }}>
        {SECTION_COPY.section1Title}
      </h3>
      <p style={{ ...BASE_FONT, fontSize: "14px", fontWeight: 400, color: "rgba(255,255,255,0.75)",
        margin: "0 0 20px", lineHeight: "1.6" }}>
        {SECTION_COPY.section1Desc}
      </p>

      {/* Hero tier rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {HERO_TIERS.map((tier) => {
          const colors = TIER_COLORS[tier.name] ?? { bg: "rgba(255,234,158,0.18)", text: "rgba(255,234,158,1)" };
          return (
            <div key={tier.name} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {/* Row: pill + count label */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                {/* CSS pill */}
                <span style={{
                  ...BASE_FONT,
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "4px 14px",
                  borderRadius: "100px",
                  backgroundColor: colors.bg,
                  border: `1px solid ${colors.text}`,
                  fontSize: "13px",
                  fontWeight: 700,
                  color: colors.text,
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}>
                  {tier.name}
                </span>
                {/* Count label */}
                <span style={{ ...BASE_FONT, fontSize: "13px", fontWeight: 500,
                  color: "rgba(255,255,255,0.6)" }}>
                  {tier.countLabel}
                </span>
              </div>
              {/* Description */}
              <p style={{ ...BASE_FONT, fontSize: "13px", fontWeight: 400,
                color: "rgba(255,255,255,0.55)", margin: 0, lineHeight: "1.55",
                paddingLeft: "4px" }}>
                {tier.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
