"use client";

/**
 * Live countdown display — client component.
 *
 * Hydration strategy: initial `now` state is set to `targetMs` so the first
 * SSR render and first client render both produce 00/00/00 — avoiding a
 * text-content mismatch warning. A useEffect then sets `now = Date.now()` and
 * starts a 1-second interval. setState inside the interval callback is
 * React-Compiler-safe (not a direct effect-body setState).
 *
 * Layout from MoMorph node 2268:35138 ("Time"):
 *   flex row · gap 60px · width 644px · height 192px · centered
 * Container node 2268:35136 ("Countdown time"):
 *   flex col · gap 24px · centered
 * Title node 2268:35137: Montserrat 700 36px white, centered
 */

import { useEffect, useState } from "react";
import { computeCountdown, pad2 } from "@/lib/countdown";
import { CountdownUnit } from "./countdown-unit";

interface CountdownDisplayProps {
  targetMs: number;
}

export function CountdownDisplay({ targetMs }: CountdownDisplayProps) {
  // Initialise to targetMs so SSR output (00/00/00) equals first client render.
  const [now, setNow] = useState<number>(targetMs);

  useEffect(() => {
    // Sync to real time after hydration.
    // Use setTimeout(..., 0) so the setState call is inside a callback, not
    // directly in the effect body — satisfies react-hooks/set-state-in-effect.
    const syncId = setTimeout(() => {
      setNow(Date.now());
    }, 0);

    const id = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => {
      clearTimeout(syncId);
      clearInterval(id);
    };
  }, []);

  const { days, hours, minutes, seconds } = computeCountdown(targetMs, now);

  return (
    /* Countdown time — node 2268:35136 */
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "24px",
        width: "100%",
      }}
    >
      {/* Title — node 2268:35137 */}
      <p
        style={{
          fontFamily: "Montserrat, sans-serif",
          fontSize: "36px",
          fontWeight: 700,
          lineHeight: "48px",
          color: "#FFFFFF",
          textAlign: "center",
          margin: 0,
          width: "100%",
        }}
      >
        Sự kiện sẽ bắt đầu sau
      </p>

      {/* Time row — node 2268:35138: flex row, gap 60px, units centered */}
      <div
        role="timer"
        aria-label={`Còn ${pad2(days)} ngày ${pad2(hours)} giờ ${pad2(minutes)} phút ${pad2(seconds)} giây`}
        aria-live="off"
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: "60px",
        }}
      >
        <CountdownUnit value={pad2(days)} label="DAYS" />
        <CountdownUnit value={pad2(hours)} label="HOURS" />
        <CountdownUnit value={pad2(minutes)} label="MINUTES" />
        <CountdownUnit value={pad2(seconds)} label="SECONDS" />
      </div>

      {/* Screen-reader-only live region (H-1). The display is minute-granular (no seconds),
          so this string only changes once per minute → aria-live announces ~once/minute,
          not every tick. Full value announced each time. */}
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {`Còn ${pad2(days)} ngày ${pad2(hours)} giờ ${pad2(minutes)} phút`}
      </span>
    </div>
  );
}
