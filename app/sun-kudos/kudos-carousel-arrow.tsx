"use client";

// Shared arrow button used by KudosHighlight carousel nav.

interface CarouselArrowProps {
  dir: "prev" | "next";
  disabled: boolean;
  size?: 48 | 80;
  onClick: () => void;
}

export function CarouselArrow({ dir, disabled, size = 48, onClick }: CarouselArrowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "prev" ? "Previous kudos" : "Next kudos"}
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "10px",
        borderRadius: "4px",
        border: "none",
        background: "transparent",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.3 : 1,
        flexShrink: 0,
      }}
    >
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        {dir === "prev" ? (
          <path d="M17.5 21L10.5 14L17.5 7" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <path d="M10.5 7L17.5 14L10.5 21" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
    </button>
  );
}
