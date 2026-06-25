"use client";

// A single selected-hashtag chip with an "x" remove button.

import { BASE_FONT } from "./write-kudo-styles";

interface WriteKudoHashtagChipProps {
  tag: string;
  borderColor: string;
  onRemove: (tag: string) => void;
}

export function WriteKudoHashtagChip({ tag, borderColor, onRemove }: WriteKudoHashtagChipProps) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "4px 12px",
        border: `1px solid ${borderColor}`,
        borderRadius: "20px",
        background: "rgba(255,234,158,0.20)",
        ...BASE_FONT,
        fontSize: "14px",
        color: "#00101A",
        lineHeight: "20px",
      }}
    >
      {tag}
      <button
        type="button"
        aria-label={`Xóa ${tag}`}
        onClick={() => onRemove(tag)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          lineHeight: 1,
          color: "#998C5F",
          fontSize: "14px",
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
        }}
      >
        ×
      </button>
    </span>
  );
}
