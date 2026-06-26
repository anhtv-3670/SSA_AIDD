"use client";

// F011 — Inner game component for the Secret Box modal.
// Mounted fresh each time the modal opens (SecretBoxModal returns null when !open,
// causing a full remount). This avoids any setState-in-effect reset pattern.
//
// Runtime source of truth: open_secret_box() RPC via openBox() server action.
// draw-badge.ts is kept for unit tests only — it is NOT called here.

import { useEffect, useRef, useCallback, useState, useTransition } from "react";
import { SecretBoxStage } from "./secret-box-stage";
import { SecretBoxCounter } from "./secret-box-counter";
import { SECRET_BOX_COPY } from "./secret-box-data";
import { openBox } from "./secret-box-actions";
import type { BadgeReward } from "@/lib/data/types";

export type Phase = "idle" | "opening" | "revealed" | "empty";

export interface SecretBoxInnerProps {
  initialCount: number;
  onClose: () => void;
}

function trapFocus(container: HTMLElement, e: KeyboardEvent) {
  const focusable = container.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  );
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (!first) return;
  if (e.shiftKey) {
    if (document.activeElement === first) { e.preventDefault(); last.focus(); }
  } else {
    if (document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
}

export function SecretBoxInner({ initialCount, onClose }: SecretBoxInnerProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const [phase, setPhase] = useState<Phase>(initialCount > 0 ? "idle" : "empty");
  const [count, setCount] = useState(initialCount);
  const [reward, setReward] = useState<BadgeReward | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Read prefers-reduced-motion synchronously (lazy initialiser — no setState in effect).
  const [reducedMotion] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  // Capture / restore focus via rAF — never setState in effect body.
  useEffect(() => {
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const id = requestAnimationFrame(() => dialogRef.current?.focus());
    return () => {
      cancelAnimationFrame(id);
      previouslyFocused.current?.focus?.();
    };
  }, []);

  // Body scroll-lock while mounted.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "Tab" && dialogRef.current) trapFocus(dialogRef.current, e);
    },
    [onClose],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Box click — calls the server action for authoritative random + atomic decrement.
  const handleBoxClick = useCallback(() => {
    if (phase !== "idle" && phase !== "revealed") return;
    if (count <= 0 || isPending) return;

    setPhase("opening");
    setErrorMsg(null);

    startTransition(async () => {
      try {
        const result = await openBox();
        setReward(result.badge);
        setCount(result.newCount);
        setPhase("revealed");
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Đã có lỗi xảy ra.";
        // "hộp quà" = friendly Vietnamese message from secret-box.ts
        // "no_box" = raw RPC token in case it surfaces directly
        if (msg.includes("hộp quà") || msg.includes("no_box")) {
          setCount(0);
          setPhase("empty");
        } else {
          setErrorMsg(msg);
          setPhase(count > 0 ? "idle" : "empty");
        }
      }
    });
  }, [phase, count, isPending]);

  const title =
    phase === "revealed"
      ? SECRET_BOX_COPY.titleRevealed
      : SECRET_BOX_COPY.titleIdle;

  const showInstruction =
    count > 0 && !isPending && (phase === "idle" || phase === "revealed");
  const instruction =
    phase === "revealed"
      ? SECRET_BOX_COPY.instructionRevealed
      : SECRET_BOX_COPY.instructionIdle;

  return (
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "rgba(0,16,26,0.80)", zIndex: 300 }}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="secret-box-title"
        tabIndex={-1}
        style={{
          position: "fixed", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)", zIndex: 301,
          width: "400px", maxWidth: "calc(100vw - 32px)",
          background: "#00101A", borderRadius: "13px",
          border: "1px solid rgba(255,234,158,0.15)",
          display: "flex", flexDirection: "column", alignItems: "center",
          padding: "36px 32px 32px", gap: "24px",
          boxSizing: "border-box", outline: "none",
        }}
      >
        <button
          aria-label="Đóng Secret Box"
          onClick={onClose}
          style={{
            position: "absolute", top: "16px", right: "16px",
            background: "none", border: "none",
            color: "rgba(255,255,255,0.60)", fontSize: "20px",
            lineHeight: 1, cursor: "pointer", padding: "4px",
          }}
        >×</button>

        <h2
          id="secret-box-title"
          style={{
            fontFamily: "Montserrat, sans-serif", fontSize: "18px", fontWeight: 800,
            color: "rgba(255,234,158,1)", margin: 0, textAlign: "center",
            letterSpacing: "0.04em", lineHeight: 1.3,
          }}
        >
          {phase === "empty" ? "Không còn hộp quà" : title}
        </h2>

        <p
          style={{
            fontFamily: "Montserrat, sans-serif", fontSize: "14px", fontWeight: 400,
            color: "rgba(255,255,255,0.75)", margin: 0, textAlign: "center",
            minHeight: "20px",
            visibility: showInstruction ? "visible" : "hidden",
          }}
        >
          {isPending ? "Đang mở..." : instruction}
        </p>

        {/* Error banner — shown only for unexpected RPC errors */}
        {errorMsg && (
          <p
            role="alert"
            style={{
              fontFamily: "Montserrat, sans-serif", fontSize: "13px", fontWeight: 700,
              color: "#D4271D", margin: 0, textAlign: "center",
            }}
          >
            {errorMsg}
          </p>
        )}

        <SecretBoxStage
          phase={phase === "empty" ? "idle" : phase}
          reward={reward}
          count={count}
          onBoxClick={handleBoxClick}
          reducedMotion={reducedMotion}
        />

        {/* aria-live — announces won badge name to screen readers on reveal */}
        <div
          aria-live="polite"
          aria-atomic="true"
          style={{
            position: "absolute", width: "1px", height: "1px",
            overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap",
          }}
        >
          {phase === "revealed" && reward ? `Bạn nhận được huy hiệu ${reward.name}` : ""}
        </div>

        <SecretBoxCounter count={count} />
      </div>
    </>
  );
}
