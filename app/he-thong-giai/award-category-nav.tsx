"use client";

// Authoritative node data — mms_C_Menu list (313:8459):
// col, gap 16px, width 178px, height 448px
// Active item (mms_C.1_Top talent 313:8460): gap 4px, padding 16px,
//   border-bottom: 1px solid #FFEA9E, text color #FFEA9E, text-shadow 0 4px 4px rgba(0,0,0,.25) 0 0 6px #FAE287
// Inactive items (e.g. 313:8461): gap 4px, padding 16px, border-radius 4px, text white Montserrat 700 14px

import { useScrollSpy } from "./use-scroll-spy";

export interface NavItem {
  id: string;
  name: string;
}

interface AwardCategoryNavProps {
  items: NavItem[];
}

const HEADER_HEIGHT = 80;

export function AwardCategoryNav({ items }: AwardCategoryNavProps) {
  const sectionIds = items.map((item) => `award-${item.id}`);
  const activeFullId = useScrollSpy(sectionIds, HEADER_HEIGHT);

  function handleClick(id: string) {
    // EC-2: null-safe — if section doesn't exist, silently no-op
    const el = document.getElementById(`award-${id}`);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <nav
      aria-label="Danh mục giải thưởng"
      style={{
        // Sticky: stays visible while scrolling cards column
        position: "sticky",
        top: `${HEADER_HEIGHT + 24}px`,
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        width: "178px",
        flexShrink: 0,
      }}
    >
      {items.map((item) => {
        const isActive = activeFullId === `award-${item.id}`;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => handleClick(item.id)}
            aria-current={isActive ? "page" : undefined}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              padding: "16px",
              background: "none",
              border: "none",
              borderBottom: isActive
                ? "1px solid #FFEA9E"
                : "1px solid transparent",
              borderRadius: isActive ? "0" : "4px",
              cursor: "pointer",
              textAlign: "left",
              // Active: gold #FFEA9E + gold glow; inactive: white
              color: isActive ? "#FFEA9E" : "#FFFFFF",
              textShadow: isActive
                ? "0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287"
                : "none",
              fontFamily: "Montserrat, sans-serif",
              fontSize: "14px",
              fontWeight: 700,
              lineHeight: "20px",
              letterSpacing: "0.25px",
              // Hover highlight (non-active)
              transition: "color 200ms ease, background 200ms ease",
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(255,234,158,0.06)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                (e.currentTarget as HTMLButtonElement).style.background = "none";
              }
            }}
          >
            {/* Target icon — RECONSTRUCTED: MM_MEDIA_Target raster unavailable */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              style={{ flexShrink: 0 }}
            >
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke={isActive ? "#FFEA9E" : "#FFFFFF"}
                strokeWidth="1.5"
              />
              <circle
                cx="12"
                cy="12"
                r="5"
                stroke={isActive ? "#FFEA9E" : "#FFFFFF"}
                strokeWidth="1.5"
              />
              <circle
                cx="12"
                cy="12"
                r="1.5"
                fill={isActive ? "#FFEA9E" : "#FFFFFF"}
              />
            </svg>
            <span>{item.name}</span>
          </button>
        );
      })}
    </nav>
  );
}
