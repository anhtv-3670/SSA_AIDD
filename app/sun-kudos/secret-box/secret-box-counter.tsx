"use client";

// F011 — Bottom counter strip: label (small white) + number (large bold gold).

import { SECRET_BOX_COPY } from "./secret-box-data";

interface SecretBoxCounterProps {
  count: number;
}

export function SecretBoxCounter({ count }: SecretBoxCounterProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "4px",
      }}
    >
      <span
        style={{
          fontFamily: "Montserrat, sans-serif",
          fontSize: "12px",
          fontWeight: 500,
          color: "rgba(255,255,255,0.70)",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        {SECRET_BOX_COPY.counterLabel}
      </span>
      <span
        style={{
          fontFamily: "Montserrat, sans-serif",
          fontSize: "48px",
          fontWeight: 800,
          color: "rgba(255,234,158,1)",
          lineHeight: 1,
        }}
      >
        {count}
      </span>
    </div>
  );
}
