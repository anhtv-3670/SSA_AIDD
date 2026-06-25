"use client";

// Footer actions: "Hủy" (cancel) and "Gửi" (submit, disabled until required fields filled — EC-12).

import { BASE_FONT } from "./write-kudo-styles";

interface WriteKudoFooterProps {
  submittable: boolean;
  onCancel: () => void;
  onSubmit: () => void;
}

export function WriteKudoFooter({ submittable, onCancel, onSubmit }: WriteKudoFooterProps) {
  return (
    <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
      {/* Hủy button */}
      <button
        type="button"
        onClick={onCancel}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "16px 40px",
          border: "1px solid #998C5F",
          borderRadius: "4px",
          background: "rgba(255,234,158,0.10)",
          cursor: "pointer",
          ...BASE_FONT,
          fontSize: "16px",
          lineHeight: "24px",
          letterSpacing: "0.15px",
          color: "#00101A",
          whiteSpace: "nowrap",
        }}
      >
        Hủy
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M18 6L6 18M6 6l12 12" stroke="#00101A" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {/* Gửi button — disabled until required fields filled (EC-12) */}
      <button
        type="button"
        onClick={onSubmit}
        disabled={!submittable}
        aria-disabled={!submittable}
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          padding: "16px",
          border: "none",
          borderRadius: "8px",
          background: submittable ? "#FFEA9E" : "rgba(255,234,158,0.40)",
          cursor: submittable ? "pointer" : "not-allowed",
          ...BASE_FONT,
          fontSize: "22px",
          lineHeight: "28px",
          color: submittable ? "#00101A" : "#999",
          transition: "background 150ms ease, color 150ms ease",
        }}
      >
        Gửi
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
