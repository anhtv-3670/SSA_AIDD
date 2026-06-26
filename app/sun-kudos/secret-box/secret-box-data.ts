// F011 — Static copy strings and asset paths for the Secret Box modal.
// Vietnamese text verbatim from spec. Centralised so sub-components stay DRY.

export const SECRET_BOX_COPY = {
  // State 1 — idle (chưa mở)
  titleIdle: "KHÁM PHÁ SECRET BOX CỦA BẠN",
  instructionIdle: "Click vào box để mở",

  // State 3 — revealed (đã mở)
  titleRevealed: "MỞ SECRET BOX THÀNH CÔNG",
  instructionRevealed: "Click vào box để tiếp tục mở",

  // Counter label (appears in all states)
  counterLabel: "Secretbox chưa mở",
} as const;

export const SECRET_BOX_IMAGE = "/saa-2025/secret-box-closed.png";
