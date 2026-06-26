"use client";

// FAB pill toggle — gold bottom-right fixed button with speed-dial expand state.
// Collapsed: gold pill toggle (aria-expanded, aria-controls → fab-speed-dial).
// Expanded: FabExpandedMenu floats above, right-aligned.
// MoMorph: collapsed node I313:9138;214:3839 · expanded node 313:9140.
// z-index 40 — above page content, BELOW site header (z:50) and modal overlay (z:300).
// React Compiler safe: setState only in event handlers / listener callbacks, never in effect body.

import Image from "next/image";
import { useState, useRef, useEffect, useCallback } from "react";
import { FabExpandedMenu } from "@/components/fab-expanded-menu";
import { PenIcon } from "@/components/icons/pen-icon";

interface FabButtonProps {
  onWrite: () => void;
  onThele: () => void;
}

export function FabButton({ onWrite, onThele }: FabButtonProps) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLButtonElement>(null);
  // Ref to the first focusable item in the menu (cancel button = last in DOM, but
  // we want focus on cancel so user can immediately dismiss, or tab forward to menu items).
  const cancelBtnRef = useRef<HTMLButtonElement>(null);

  // Escape key and click-outside both collapse the menu.
  // useEffect adds/removes listeners only — setState is called inside the callback (allowed).
  const handleClose = useCallback(() => {
    setOpen(false);
    // Return focus to the pill when menu collapses.
    pillRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        handleClose();
      }
    }

    function onPointerDown(e: PointerEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        handleClose();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open, handleClose]);

  // Move focus into menu when it opens.
  useEffect(() => {
    if (open) {
      // Small rAF so CSS transition has started before focus moves.
      const id = requestAnimationFrame(() => {
        cancelBtnRef.current?.focus();
      });
      return () => cancelAnimationFrame(id);
    }
  }, [open]);

  function handleToggle() {
    setOpen((prev) => !prev);
  }

  function handleWrite() {
    onWrite();
    setOpen(false);
  }

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 40,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "20px",
      }}
    >
      {/* Speed-dial menu — rendered above the pill via column-reverse visual order.
          Gap comes from the parent flex container. */}
      <FabExpandedMenu
        open={open}
        onWrite={handleWrite}
        onThele={onThele}
        onClose={handleClose}
        cancelRef={cancelBtnRef}
      />

      {/* Collapsed pill toggle */}
      <button
        ref={pillRef}
        type="button"
        aria-expanded={open}
        aria-controls="fab-speed-dial"
        aria-label={open ? "Đóng menu" : "Mở menu nhanh"}
        onClick={handleToggle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00101A]"
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "8px",
          width: "108px",
          height: "64px",
          padding: "16px",
          borderRadius: "100px",
          backgroundColor: "rgba(255, 234, 158, 1)",
          boxSizing: "border-box",
          boxShadow: hovered
            ? "0 4px 4px 0 rgba(0, 0, 0, 0.25), 0 0 6px 0 #FAE287"
            : "0 2px 4px 0 rgba(0, 0, 0, 0.15)",
          transition: "box-shadow 200ms ease",
          border: "none",
          cursor: "pointer",
          flexShrink: 0,
        }}
      >
        {/* Pencil icon — 24×24px dark fill (shared PenIcon) */}
        <PenIcon style={{ flexShrink: 0 }} />

        {/* Divider "/" — Montserrat 700 24px */}
        <span
          aria-hidden="true"
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: "24px",
            fontWeight: 700,
            lineHeight: "32px",
            color: "rgba(0, 16, 26, 1)",
            letterSpacing: "0px",
            userSelect: "none",
            flexShrink: 0,
          }}
        >
          /
        </span>

        {/* Sun* logo — 24×24px (visual decoration only; pill is now a single toggle) */}
        <Image
          src="/saa-2025/logo-sun.png"
          alt=""
          width={24}
          height={24}
          aria-hidden="true"
          style={{ objectFit: "contain", flexShrink: 0 }}
        />
      </button>
    </div>
  );
}
