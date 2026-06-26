"use client";

// F010 — Thể lệ modal overlay.
// Pattern: mirrors F006 (write-kudo-modal.tsx) — scroll-lock, Escape, backdrop click,
// focus-trap, return-focus-on-close, z-index 300.
// Dark #00101A panel. Scrollable content, sticky footer.
// Props: open, onClose, onWrite (onWrite = close this + open F006 write modal).

import { useEffect, useRef, useCallback } from "react";
import { TheLeHeroTiers } from "./the-le-hero-tiers";
import { TheLeBadges } from "./the-le-badges";
import { TheLeKudosQuocDan } from "./the-le-kudos-quoc-dan";
import { TheLeFooter } from "./the-le-footer";

interface TheLeModalProps {
  open: boolean;
  onClose: () => void;
  /** Called when user picks "Viết KUDOS" — caller should close this modal then open F006. */
  onWrite: () => void;
}

// Trap focus within the modal: cycle through tabbable children.
function trapFocus(container: HTMLElement, e: KeyboardEvent) {
  const focusable = container.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  );
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (!first) return;
  if (e.shiftKey) {
    if (document.activeElement === first) {
      e.preventDefault();
      last.focus();
    }
  } else {
    if (document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
}

export function TheLeModal({ open, onClose, onWrite }: TheLeModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  // Capture / restore focus (WCAG 2.4.3) — listener/rAF callbacks only, never effect body.
  useEffect(() => {
    if (open) {
      previouslyFocused.current = document.activeElement as HTMLElement | null;
      // Move focus into the dialog after paint.
      const id = requestAnimationFrame(() => {
        dialogRef.current?.focus();
      });
      return () => cancelAnimationFrame(id);
    } else {
      previouslyFocused.current?.focus?.();
    }
  }, [open]);

  // Body scroll-lock while open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // Escape closes; Tab trapped within dialog.
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab" && dialogRef.current) {
        trapFocus(dialogRef.current, e);
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop — click closes */}
      <div
        aria-hidden="true"
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,16,26,0.80)",
          zIndex: 300,
        }}
      />

      {/* Dialog panel */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="the-le-title"
        tabIndex={-1}
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 301,
          width: "560px",
          maxWidth: "calc(100vw - 32px)",
          maxHeight: "calc(100vh - 48px)",
          background: "#00101A",
          borderRadius: "16px",
          border: "1px solid rgba(255,234,158,0.15)",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
          outline: "none",
        }}
      >
        {/* Scrollable content area */}
        <div style={{
          overflowY: "auto",
          flex: 1,
          padding: "32px 32px 0",
          display: "flex",
          flexDirection: "column",
          gap: "28px",
        }}>
          {/* Title */}
          <h2
            id="the-le-title"
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "28px",
              fontWeight: 700,
              color: "rgba(255,234,158,1)",
              margin: 0,
              textAlign: "center",
              lineHeight: "1.3",
            }}
          >
            Thể lệ
          </h2>

          {/* Section 1 — Hero tiers */}
          <TheLeHeroTiers />

          {/* Divider */}
          <hr style={{ border: "none", borderTop: "1px solid rgba(255,234,158,0.12)", margin: 0 }} />

          {/* Section 2 — Collectible badges */}
          <TheLeBadges />

          {/* Divider */}
          <hr style={{ border: "none", borderTop: "1px solid rgba(255,234,158,0.12)", margin: 0 }} />

          {/* Section 3 — Kudos Quốc dân */}
          <TheLeKudosQuocDan />
        </div>

        {/* Sticky footer */}
        <TheLeFooter onClose={onClose} onWrite={onWrite} />
      </div>
    </>
  );
}
