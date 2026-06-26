"use client";

// F011 — Secret Box modal shell.
// Returns null when !open, which unmounts SecretBoxInner entirely so every
// open→close→open cycle remounts it with fresh game state (no setState-in-effect needed).
// All overlay logic lives in secret-box-inner.tsx.

import { SecretBoxInner } from "./secret-box-inner";

interface SecretBoxModalProps {
  open: boolean;
  onClose: () => void;
  /** Mock initial box count — defaults to 5 (presentational only, no backend/persistence). */
  initialCount?: number;
}

export function SecretBoxModal({ open, onClose, initialCount = 5 }: SecretBoxModalProps) {
  if (!open) return null;
  return <SecretBoxInner initialCount={initialCount} onClose={onClose} />;
}
