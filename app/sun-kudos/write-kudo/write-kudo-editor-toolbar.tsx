"use client";

// Decorative editor toolbar (B/I/S/number-list/link/quote) + non-nav "Tiêu chuẩn cộng đồng".
// All buttons are type="button" no-ops — purely presentational per design (520:9877).

import { BASE_FONT } from "./write-kudo-styles";

function BoldIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M5 10h7a3 3 0 0 0 0-6H5v6zm0 0h8a3 3 0 0 1 0 6H5v-6z" stroke="#00101A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ItalicIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M8 4h8M4 16h8M12 4l-4 12" stroke="#00101A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function StrikeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4 10h12M8 6c0-1.1.9-2 2-2h2a2 2 0 0 1 0 4H8a2 2 0 0 0 0 4h4a2 2 0 0 0 2-2" stroke="#00101A" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function ListIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M7 5h9M7 10h9M7 15h9M3 5h.01M3 10h.01M3 15h.01" stroke="#00101A" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function LinkIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M8 11a4 4 0 0 0 6 0l2-2a4 4 0 0 0-6-6L9 4" stroke="#00101A" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 9a4 4 0 0 0-6 0L4 11a4 4 0 0 0 6 6l1-1" stroke="#00101A" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function QuoteIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M3 8c0-2.2 1.8-4 4-4v3a2 2 0 0 0-2 2v5H3V8zm8 0c0-2.2 1.8-4 4-4v3a2 2 0 0 0-2 2v5h-4V8z" stroke="#00101A" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

const TOOLBAR_BUTTONS = [
  { label: "Bold", icon: <BoldIcon />, borderRadius: "8px 0 0 0" },
  { label: "Italic", icon: <ItalicIcon />, borderRadius: "0" },
  { label: "Strikethrough", icon: <StrikeIcon />, borderRadius: "0" },
  { label: "Numbered list", icon: <ListIcon />, borderRadius: "0" },
  { label: "Link", icon: <LinkIcon />, borderRadius: "0" },
  { label: "Quote", icon: <QuoteIcon />, borderRadius: "0" },
];

export function WriteKudoEditorToolbar({ borderColor }: { borderColor: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        borderTop: `1px solid ${borderColor}`,
        borderLeft: `1px solid ${borderColor}`,
        borderRight: `1px solid ${borderColor}`,
        borderRadius: "8px 8px 0 0",
        background: "transparent",
      }}
      role="toolbar"
      aria-label="Định dạng văn bản (trang trí)"
    >
      {TOOLBAR_BUTTONS.map((btn) => (
        <button
          key={btn.label}
          type="button"
          aria-label={btn.label}
          onClick={() => undefined}
          style={{
            height: "40px",
            padding: "10px 16px",
            border: `1px solid ${borderColor}`,
            borderRadius: btn.borderRadius,
            background: "transparent",
            cursor: "default",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {btn.icon}
        </button>
      ))}

      {/* "Tiêu chuẩn cộng đồng" — non-nav decorative link */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "flex-end",
          padding: "10px 16px",
          borderTop: `1px solid ${borderColor}`,
          borderRight: `1px solid ${borderColor}`,
          borderRadius: "0 8px 0 0",
        }}
      >
        <span
          aria-hidden="true"
          style={{
            ...BASE_FONT,
            fontSize: "16px",
            lineHeight: "24px",
            letterSpacing: "0.15px",
            color: "#E46060",
            cursor: "default",
            userSelect: "none",
          }}
        >
          Tiêu chuẩn cộng đồng
        </span>
      </div>
    </div>
  );
}
