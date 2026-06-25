// Shared style constants for the Write Kudo modal and its sub-fields.

import type { CSSProperties } from "react";

// Montserrat 700 — the base typeface used across every Write Kudo field.
export const BASE_FONT: CSSProperties = {
  fontFamily: "Montserrat, sans-serif",
  fontWeight: 700,
};

// Red inline error/helper text shared by every field.
export const ERROR_TEXT: CSSProperties = {
  margin: 0,
  ...BASE_FONT,
  fontSize: "13px",
  color: "#D4271D",
  lineHeight: "20px",
};
