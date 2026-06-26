"use client";

// Section 3 sub-component: Kudos Quốc Dân.

import { SECTION_COPY } from "./the-le-data";

const BASE_FONT: React.CSSProperties = {
  fontFamily: "Montserrat, sans-serif",
};

export function TheLeKudosQuocDan() {
  return (
    <section style={{ paddingBottom: "8px" }}>
      <p style={{ ...BASE_FONT, fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em",
        textTransform: "uppercase", color: "rgba(255,234,158,0.6)", margin: "0 0 6px" }}>
        Mục 3
      </p>
      <h3 style={{ ...BASE_FONT, fontSize: "14px", fontWeight: 700, color: "rgba(255,234,158,1)",
        margin: "0 0 8px", lineHeight: "1.4", textTransform: "uppercase" }}>
        {SECTION_COPY.section3Title}
      </h3>
      <p style={{ ...BASE_FONT, fontSize: "14px", fontWeight: 400, color: "rgba(255,255,255,0.75)",
        margin: 0, lineHeight: "1.6" }}>
        {SECTION_COPY.section3Desc}
      </p>
    </section>
  );
}
