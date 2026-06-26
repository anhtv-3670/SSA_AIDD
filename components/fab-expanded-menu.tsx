"use client";

// FAB expanded / speed-dial menu — presentational only.
// MoMorph: node 313:9140 "Widget Button" (214×224, flex-col, align-end, gap 20px).
// A: Thể lệ (149×64, gold r4, Sun* logo + label) — no-op placeholder.
// B: Viết KUDOS (214×64, gold r4, pen + label) — calls onWrite().
// C: Hủy (56×56, red round) — calls onClose().
// Animation: fade + slide-up 180ms; respects prefers-reduced-motion.

import Image from "next/image";
import { type RefObject } from "react";

import { PenIcon } from "@/components/icons/pen-icon";

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
  // Animation CSS lives in app/globals.css (.fab-menu-item / .fab-menu-open)
  // so Next.js extracts it statically instead of re-emitting it each render.
  return (
    <>
      {/*
        Container: 214×224, flex-col, align-end, gap 20px.
        Rendered as inert/hidden when closed (pointer-events off via CSS, aria-hidden).
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
          className={`fab-menu-item${open ? " fab-menu-open" : ""} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00101A]`}
          style={{ ...goldButtonBase, width: "149px", cursor: "pointer" }}
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
          className={`fab-menu-item${open ? " fab-menu-open" : ""} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00101A]`}
          style={{ ...goldButtonBase, width: "214px" }}
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
          className={`fab-menu-item${open ? " fab-menu-open" : ""} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white`}
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
