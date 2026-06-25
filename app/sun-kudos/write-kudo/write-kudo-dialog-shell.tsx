"use client";

// Modal chrome: dark overlay (click closes — EC-11) + the centered cream dialog card.
// Design: cream card #FFF8E1, 752px wide, 40px padding, radius 24px, centered on dark overlay.

import type { ReactNode } from "react";
import { BASE_FONT } from "./write-kudo-styles";

interface WriteKudoDialogShellProps {
  onOverlayClick: () => void;
  children: ReactNode;
}

export function WriteKudoDialogShell({ onOverlayClick, children }: WriteKudoDialogShellProps) {
  return (
    <>
      {/* Dark overlay — click closes (EC-11) */}
      <div
        aria-hidden="true"
        onClick={onOverlayClick}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,16,26,0.72)",
          zIndex: 300,
        }}
      />

      {/* Modal card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="write-kudo-title"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 301,
          width: "752px",
          maxWidth: "calc(100vw - 32px)",
          maxHeight: "calc(100vh - 48px)",
          overflowY: "auto",
          background: "#FFF8E1",
          borderRadius: "24px",
          padding: "40px",
          display: "flex",
          flexDirection: "column",
          gap: "32px",
          boxSizing: "border-box",
        }}
      >
        {/* A — Title */}
        <h2
          id="write-kudo-title"
          style={{
            ...BASE_FONT,
            fontSize: "32px",
            lineHeight: "40px",
            color: "#00101A",
            textAlign: "center",
            margin: 0,
          }}
        >
          Gửi lời cám ơn và ghi nhận đến đồng đội
        </h2>

        {children}
      </div>
    </>
  );
}
