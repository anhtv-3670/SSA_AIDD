"use client";

// Success toast (EC-12) — fixed top-center, outside the modal card.

import { BASE_FONT } from "./write-kudo-styles";

export function WriteKudoToast({ message }: { message: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        top: "24px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 400,
        background: "#00101A",
        color: "#FFEA9E",
        border: "1px solid #998C5F",
        borderRadius: "8px",
        padding: "12px 24px",
        ...BASE_FONT,
        fontSize: "16px",
        lineHeight: "24px",
        pointerEvents: "none",
        whiteSpace: "nowrap",
      }}
    >
      {message}
    </div>
  );
}
