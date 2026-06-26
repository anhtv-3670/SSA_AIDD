"use client";

// Sticky footer for the Thể lệ modal — B.1 Đóng + B.2 Viết KUDOS.

import { PenIcon } from "@/components/icons/pen-icon";

interface TheLeFooterProps {
  onClose: () => void;
  onWrite: () => void;
}

const BASE_FONT: React.CSSProperties = { fontFamily: "Montserrat, sans-serif" };

export function TheLeFooter({ onClose, onWrite }: TheLeFooterProps) {
  return (
    <div style={{
      flexShrink: 0,
      padding: "20px 32px",
      borderTop: "1px solid rgba(255,234,158,0.12)",
      display: "flex",
      gap: "12px",
      justifyContent: "flex-end",
      background: "#00101A",
      borderRadius: "0 0 16px 16px",
    }}>
      {/* B.1 — Đóng (secondary/outlined) */}
      <button
        type="button"
        onClick={onClose}
        style={{
          ...BASE_FONT,
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "10px 20px",
          borderRadius: "8px",
          border: "1px solid rgba(255,234,158,0.45)",
          background: "transparent",
          color: "rgba(255,234,158,1)",
          fontSize: "14px",
          fontWeight: 600,
          cursor: "pointer",
          lineHeight: "1.4",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
            fill="rgba(255,234,158,1)"
          />
        </svg>
        Đóng
      </button>

      {/* B.2 — Viết KUDOS (primary gold) */}
      <button
        type="button"
        onClick={onWrite}
        style={{
          ...BASE_FONT,
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "10px 20px",
          borderRadius: "8px",
          border: "none",
          background: "rgba(255,234,158,1)",
          color: "rgba(0,16,26,1)",
          fontSize: "14px",
          fontWeight: 700,
          cursor: "pointer",
          lineHeight: "1.4",
        }}
      >
        <PenIcon style={{ width: "16px", height: "16px", flexShrink: 0 }} />
        Viết KUDOS
      </button>
    </div>
  );
}
