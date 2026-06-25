"use client";

// Dropdown listbox for the recipient autocomplete — renders the filtered Sunner options.

import type { MockSunner } from "./write-kudo-mock-data";
import { BASE_FONT } from "./write-kudo-styles";

interface WriteKudoRecipientListProps {
  options: MockSunner[];
  selectedName: string;
  optionRefs: React.MutableRefObject<(HTMLButtonElement | null)[]>;
  onSelect: (name: string) => void;
  onOptionKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => void;
}

export function WriteKudoRecipientList({
  options,
  selectedName,
  optionRefs,
  onSelect,
  onOptionKeyDown,
}: WriteKudoRecipientListProps) {
  return (
    <ul
      id="recipient-listbox"
      role="listbox"
      aria-label="Danh sách Sunner"
      style={{
        position: "absolute",
        top: "calc(100% + 4px)",
        left: 0,
        right: 0,
        background: "#FFF",
        border: "1px solid #998C5F",
        borderRadius: "8px",
        listStyle: "none",
        padding: "4px 0",
        margin: 0,
        zIndex: 200,
        maxHeight: "200px",
        overflowY: "auto",
        boxShadow: "0 4px 16px rgba(0,16,26,0.10)",
      }}
    >
      {options.map((sunner, index) => (
        <li key={sunner.id} role="option" aria-selected={selectedName === sunner.name}>
          <button
            ref={(el) => { optionRefs.current[index] = el; }}
            type="button"
            onClick={() => onSelect(sunner.name)}
            onKeyDown={(e) => onOptionKeyDown(e, index)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              width: "100%",
              padding: "10px 16px",
              background: selectedName === sunner.name ? "rgba(255,234,158,0.15)" : "transparent",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
              ...BASE_FONT,
              fontSize: "14px",
              color: "#00101A",
            }}
          >
            {/* Avatar circle */}
            <span
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: "#FFEA9E",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                color: "#00101A",
                flexShrink: 0,
              }}
              aria-hidden="true"
            >
              {sunner.initial}
            </span>
            <span>{sunner.name}</span>
            <span style={{ color: "#999", fontSize: "12px", marginLeft: "auto" }}>{sunner.dept}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
