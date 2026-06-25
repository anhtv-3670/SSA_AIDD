"use client";

// Anonymous toggle (custom checkbox) plus the optional display-name field (EC-14).

import { BASE_FONT } from "./write-kudo-styles";

interface WriteKudoAnonymousProps {
  anonymous: boolean;
  anonymousName: string;
  onToggle: (checked: boolean) => void;
  onNameChange: (val: string) => void;
}

export function WriteKudoAnonymous({ anonymous, anonymousName, onToggle, onNameChange }: WriteKudoAnonymousProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <label style={{ display: "flex", alignItems: "center", gap: "16px", cursor: "pointer" }}>
        {/* Custom checkbox — design: 24x24px, border 1px #999, radius 4px, white bg */}
        <span
          style={{
            width: "24px",
            height: "24px",
            border: `1px solid ${anonymous ? "#00101A" : "#999"}`,
            borderRadius: "4px",
            background: anonymous ? "#FFEA9E" : "#FFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
          aria-hidden="true"
        >
          {anonymous && (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7l4 4 6-7" stroke="#00101A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
        <input
          type="checkbox"
          checked={anonymous}
          onChange={(e) => onToggle(e.target.checked)}
          style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
          aria-label="Gửi lời cám ơn và ghi nhận ẩn danh"
        />
        <span style={{ ...BASE_FONT, fontSize: "22px", lineHeight: "28px", color: "#999" }}>
          Gửi lời cám ơn và ghi nhận ẩn danh
        </span>
      </label>

      {/* Anonymous name field — shown only when checkbox is on (EC-14) */}
      {anonymous && (
        <div
          style={{
            padding: "16px 24px",
            border: "1px solid #998C5F",
            borderRadius: "8px",
            background: "#FFF",
          }}
        >
          <input
            type="text"
            value={anonymousName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Tên hiển thị ẩn danh"
            aria-label="Tên hiển thị ẩn danh"
            style={{
              width: "100%",
              border: "none",
              outline: "none",
              background: "transparent",
              ...BASE_FONT,
              fontSize: "16px",
              lineHeight: "24px",
              letterSpacing: "0.15px",
              color: "#00101A",
            }}
          />
        </div>
      )}
    </div>
  );
}
