// F009 FAB — authoritative show/hide for the speed-dial menu items.
//
// Visibility is driven INLINE from the `open` state (not a global CSS class) so it
// ships with the component JS and cannot desync from a stale/missing global stylesheet
// chunk. (Bug 260626: a stale Turbopack dev `globals.css` chunk dropped the
// `.fab-menu-item` rule, leaving the menu permanently expanded and un-collapsible.)
//
// Pure + unit-tested: given open/reducedMotion, returns the inline style for one item.

import type { CSSProperties } from "react";

export function fabItemVisibility(
  open: boolean,
  reducedMotion: boolean,
): CSSProperties {
  return {
    opacity: open ? 1 : 0,
    transform: open ? "translateY(0)" : "translateY(8px)",
    pointerEvents: open ? "auto" : "none",
    transition: reducedMotion
      ? "none"
      : "opacity 180ms ease, transform 180ms ease",
  };
}
