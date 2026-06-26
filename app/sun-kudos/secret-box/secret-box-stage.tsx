"use client";

// F011 — Stage area: the clickable box (idle/opening) or won badge (revealed).
// Opening/revealed states follow the spec; companion Figma frames (action bấm mở /
// standby revealed) had no published render — animations built from spec copy.
// Presentational client mock: randomness + count are local state only, no persistence.

import Image from "next/image";
import { BadgeReward } from "./draw-badge";
import { SECRET_BOX_IMAGE } from "./secret-box-data";

type Phase = "idle" | "opening" | "revealed";

interface SecretBoxStageProps {
  phase: Phase;
  reward: BadgeReward | null;
  count: number;
  onBoxClick: () => void;
  /** true when @media (prefers-reduced-motion: reduce) is active */
  reducedMotion: boolean;
}

export function SecretBoxStage({
  phase,
  reward,
  count,
  onBoxClick,
  reducedMotion,
}: SecretBoxStageProps) {
  const isDisabled = count === 0 || phase === "opening";
  const transitionDuration = reducedMotion ? "0ms" : "280ms";

  // Opening: box dims + scales down slightly with glow pulse.
  const boxOpacity =
    phase === "opening" ? 0.5 : phase === "revealed" ? 0.3 : 1;
  const boxScale =
    phase === "opening" ? 0.92 : phase === "revealed" ? 0.85 : 1;
  const glowOpacity = phase === "opening" ? 1 : 0;

  // Revealed: badge fades + scales in.
  const badgeOpacity = phase === "revealed" ? 1 : 0;
  const badgeScale = phase === "revealed" ? 1 : 0.7;

  return (
    <div
      style={{
        position: "relative",
        width: "220px",
        height: "220px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Glow ring — appears during opening */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "-20px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,234,158,0.35) 0%, transparent 70%)",
          opacity: glowOpacity,
          transition: `opacity ${transitionDuration} ease`,
          pointerEvents: "none",
        }}
      />

      {/* Closed box — always rendered; dims when opening/revealed */}
      <button
        aria-label="Mở Secret Box"
        disabled={isDisabled}
        onClick={onBoxClick}
        style={{
          background: "none",
          border: "none",
          padding: 0,
          cursor: isDisabled ? "not-allowed" : "pointer",
          opacity: boxOpacity,
          transform: `scale(${boxScale})`,
          transition: `opacity ${transitionDuration} ease, transform ${transitionDuration} ease`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          inset: 0,
        }}
      >
        <Image
          src={SECRET_BOX_IMAGE}
          alt="Secret Box đóng"
          width={200}
          height={200}
          style={{ objectFit: "contain" }}
          priority
        />
      </button>

      {/* Won badge — fades + scales in when revealed */}
      {reward && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: badgeOpacity,
            transform: `scale(${badgeScale})`,
            transition: `opacity ${transitionDuration} ease, transform ${transitionDuration} ease`,
            pointerEvents: "none",
          }}
        >
          <Image
            src={reward.image}
            alt={reward.name}
            width={180}
            height={180}
            style={{ objectFit: "contain" }}
          />
        </div>
      )}
    </div>
  );
}
