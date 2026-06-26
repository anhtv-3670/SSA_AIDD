// Authoritative node data — Hệ thống giải thưởng (2167:9068):
// col, gap 80px; header sub-frame (2167:9069): gap 16px
// "Sun* annual awards 2025": Montserrat 700 24px white
// Divider Rectangle 26: 1px rgba(46,57,64,1)
// "Hệ thống giải thưởng": Montserrat 700 57px #FFEA9E letterSpacing -0.25px
// mms_C2_Award list (5005:14974): two rows of 3, gap 80px between rows
//   Frame 491 row gap 80px; Frame 493 row gap 80px

import type { AwardDetail } from "@/lib/data/types";
import { AwardCard } from "./award-card";

interface HomeAwardsProps {
  awards: AwardDetail[];
}

export function HomeAwards({ awards }: HomeAwardsProps) {
  const row1 = awards.slice(0, 3);
  const row2 = awards.slice(3, 6);

  return (
    <section
      className="w-full"
      style={{ display: "flex", flexDirection: "column", gap: "80px" }}
      aria-labelledby="awards-heading"
    >
      {/* mms_C1_Header Giải thưởng (2167:9069) — col gap 16px */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* "Sun* annual awards 2025" — Montserrat 700 24px white */}
        <p
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: "24px",
            fontWeight: 700,
            lineHeight: "32px",
            color: "#FFFFFF",
            margin: 0,
          }}
        >
          Sun* annual awards 2025
        </p>

        {/* Rectangle 26 divider — 1px rgba(46,57,64,1) */}
        <hr style={{ border: "none", borderTop: "1px solid rgba(46,57,64,1)", margin: 0 }} />

        {/* "Hệ thống giải thưởng" — Montserrat 700 57px #FFEA9E */}
        <h2
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
          Hệ thống giải thưởng
        </h2>
      </div>

      {/* mms_C2_Award list — two rows, gap 80px between rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: "80px" }}>
        {/* Row 1 — Frame 491: justify-content space-between, gap 80px */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: "80px", flexWrap: "wrap" }}>
          {row1.map((award) => (
            <AwardCard key={award.id} {...award} />
          ))}
        </div>

        {/* Row 2 — Frame 493: justify-content space-between, gap 80px */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: "80px", flexWrap: "wrap" }}>
          {row2.map((award) => (
            <AwardCard key={award.id} {...award} />
          ))}
        </div>
      </div>
    </section>
  );
}
