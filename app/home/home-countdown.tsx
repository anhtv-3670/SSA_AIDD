"use client";

// Live home-hero countdown. Reuses the F008 pure engine (computeCountdown + pad2)
// and event target (eventStartMs), but renders in the hero's existing gradient
// DigitBox style (NOT the /prelaunch LED look).
// Hydration-safe: now=targetMs initial → SSR and first client render both show
// 00/00/00; the effect then syncs to real time and ticks every second.

import { useEffect, useState } from "react";
import { computeCountdown, pad2 } from "@/lib/countdown";
import { eventStartMs } from "@/lib/event-config";

const FONT = { fontFamily: "Montserrat, sans-serif", fontWeight: 700 } as const;

/** Single digit cell — gradient box (hero style, node 2167:9037 reconstruction). */
function DigitBox({ digit }: { digit: string }) {
  return (
    <div
      className="flex items-center justify-center"
      style={{
        background: "linear-gradient(180deg,rgba(255,255,255,.12) 0%,rgba(255,255,255,.06) 100%)",
        border: "1px solid rgba(255,255,255,.15)",
        borderRadius: "8px",
        width: "48px",
        height: "64px",
        ...FONT,
        fontSize: "48px",
        lineHeight: 1,
        color: "#FFFFFF",
      }}
    >
      {digit}
    </div>
  );
}

function Unit({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      <div style={{ display: "flex", gap: "14px" }}>
        {value.split("").map((d, i) => (
          <DigitBox key={i} digit={d} />
        ))}
      </div>
      <span style={{ ...FONT, fontSize: "24px", lineHeight: "32px", color: "#FFFFFF" }}>{label}</span>
    </div>
  );
}

export function HomeCountdown() {
  const targetMs = eventStartMs();
  // Deterministic initial = targetMs → renders 00/00/00 on SSR + first client paint.
  const [now, setNow] = useState<number>(targetMs);

  useEffect(() => {
    // setState only inside callbacks (not the effect body) — React-Compiler-safe.
    const sync = setTimeout(() => setNow(Date.now()), 0);
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      clearTimeout(sync);
      clearInterval(id);
    };
  }, []);

  const { days, hours, minutes, seconds } = computeCountdown(targetMs, now);

  return (
    <div
      role="timer"
      aria-label={`Còn ${pad2(days)} ngày ${pad2(hours)} giờ ${pad2(minutes)} phút ${pad2(seconds)} giây`}
      style={{ display: "flex", alignItems: "center", gap: "40px" }}
    >
      <Unit value={pad2(days)} label="DAYS" />
      <Unit value={pad2(hours)} label="HOURS" />
      <Unit value={pad2(minutes)} label="MINUTES" />
      <Unit value={pad2(seconds)} label="SECONDS" />
    </div>
  );
}
