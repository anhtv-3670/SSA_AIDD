"use client";

// Dropdown listbox of available hashtag options for the hashtag picker.

import { BASE_FONT } from "./write-kudo-styles";

interface WriteKudoHashtagDropdownProps {
  options: string[];
  optionRefs: React.MutableRefObject<(HTMLButtonElement | null)[]>;
  onAdd: (tag: string) => void;
  onOptionKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => void;
}

export function WriteKudoHashtagDropdown({
  options,
  optionRefs,
  onAdd,
  onOptionKeyDown,
}: WriteKudoHashtagDropdownProps) {
  return (
    <ul
      role="listbox"
      aria-label="Chọn hashtag"
      style={{
        position: "absolute",
        top: "calc(100% + 4px)",
        left: 0,
        minWidth: "160px",
        background: "#FFF",
        border: "1px solid #998C5F",
        borderRadius: "8px",
        listStyle: "none",
        padding: "4px 0",
        margin: 0,
        zIndex: 200,
        boxShadow: "0 4px 16px rgba(0,16,26,0.10)",
      }}
    >
      {options.map((tag, index) => (
        <li key={tag} role="option" aria-selected="false">
          <button
            ref={(el) => { optionRefs.current[index] = el; }}
            type="button"
            onClick={() => onAdd(tag)}
            onKeyDown={(e) => onOptionKeyDown(e, index)}
            style={{
              display: "block",
              width: "100%",
              textAlign: "left",
              padding: "8px 16px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              ...BASE_FONT,
              fontSize: "14px",
              color: "#D4271D",
              lineHeight: "20px",
            }}
          >
            {tag}
          </button>
        </li>
      ))}
    </ul>
  );
}
