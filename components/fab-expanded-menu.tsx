"use client";

// FAB expanded / speed-dial menu — presentational only.
// MoMorph: node 313:9140 "Widget Button" (214×224, flex-col, align-end, gap 20px).
// A: Thể lệ (149×64, gold r4, Sun* logo + label) — no-op placeholder.
// B: Viết KUDOS (214×64, gold r4, pen + label) — calls onWrite().
// C: Hủy (56×56, red round) — calls onClose().
// Animation: fade + slide-up 180ms; respects prefers-reduced-motion.

import Image from "next/image";
import { type RefObject, useState } from "react";

import { PenIcon } from "@/components/icons/pen-icon";
import { fabItemVisibility } from "@/components/fab-item-visibility";

interface FabExpandedMenuProps {
  onWrite: () => void;
  onClose: () => void;
  onThele: () => void;
  open: boolean;
  /** Ref forwarded to the Hủy (cancel) button so the parent can focus it on open. */
  cancelRef?: RefObject<HTMLButtonElement | null>;
}

// Shared label style — Montserrat 700 24px, color rgba(0,16,26,1).
const labelStyle: React.CSSProperties = {
  fontFamily: "Montserrat, sans-serif",
  fontSize: "24px",
  fontWeight: 700,
  lineHeight: "32px",
  color: "rgba(0, 16, 26, 1)",
  whiteSpace: "nowrap",
  userSelect: "none",
};

// Shared gold button layout (A + B).
const goldButtonBase: React.CSSProperties = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: "8px",
  height: "64px",
  padding: "16px",
  borderRadius: "4px",
  backgroundColor: "rgba(255, 234, 158, 1)",
  border: "none",
  cursor: "pointer",
  boxSizing: "border-box",
};

export function FabExpandedMenu({ onWrite, onClose, onThele, open, cancelRef }: FabExpandedMenuProps) {
  // Show/hide is driven INLINE from `open` (see fab-item-visibility) — NOT a global
  // CSS class — so it can't desync from a stale Turbopack globals chunk (bug 260626).
  // Read prefers-reduced-motion synchronously (lazy initialiser — no setState in effect).
  const [reducedMotion] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });
  const visibility = fabItemVisibility(open, reducedMotion);

  return (
    <>
      {/*
        Container: 214×224, flex-col, align-end, gap 20px.
        Items inert/hidden when closed (inline opacity 0 + pointer-events none, aria-hidden).
      */}
      <div
        id="fab-speed-dial"
        aria-hidden={!open}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: "20px",
          width: "214px",
        }}
      >
        {/* A — Thể lệ: 149×64, opens F010 Thể lệ modal. */}
        <button
          type="button"
          aria-label="Thể lệ"
          tabIndex={open ? 0 : -1}
          onClick={() => { onThele(); onClose(); }}
          className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00101A]"
          style={{ ...goldButtonBase, ...visibility, width: "149px", cursor: "pointer" }}
        >
          <Image
            src="/saa-2025/logo-sun.png"
            alt=""
            width={24}
            height={24}
            aria-hidden="true"
            style={{ objectFit: "contain", flexShrink: 0 }}
          />
          <span style={labelStyle}>Thể lệ</span>
        </button>

        {/* B — Viết KUDOS: 214×64 */}
        <button
          type="button"
          aria-label="Viết KUDOS"
          tabIndex={open ? 0 : -1}
          onClick={() => { onWrite(); onClose(); }}
          className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00101A]"
          style={{ ...goldButtonBase, ...visibility, width: "214px" }}
        >
          <PenIcon />
          <span style={labelStyle}>Viết KUDOS</span>
        </button>

        {/* C — Hủy: 56×56, red round */}
        <button
          ref={cancelRef}
          type="button"
          aria-label="Đóng"
          tabIndex={open ? 0 : -1}
          onClick={onClose}
          className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "56px",
            height: "56px",
            borderRadius: "100px",
            backgroundColor: "rgba(212, 39, 29, 1)",
            border: "none",
            cursor: "pointer",
            flexShrink: 0,
            ...visibility,
          }}
        >
          {/* × icon — white 24×24 */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
              fill="white"
            />
          </svg>
        </button>
      </div>
    </>
  );
}
