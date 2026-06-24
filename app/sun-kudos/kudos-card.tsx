"use client";

// Authoritative: B.3_KUDO - Highlight (2940:13464)
// Card: bg #FFF8E1, border 4px solid #FFEA9E, radius 16px, padding 24px 24px 16px 24px, col gap 16px
// Time: Montserrat 700 16px #999 letterSpacing 0.5px
// Title label: 16px #00101A center (e.g. "IDOL GIỚI TRẺ")
// Message box: bg rgba(255,234,158,0.40) border 1px #FFEA9E radius 12px
// Message text: 20px #00101A lineHeight 32px — 3 lines max (highlight) / 5 lines (feed)
// Hashtags: 16px #D4271D single line ellipsis
// Action: like count+heart left; Copy Link + Xem chi tiết right

import { useState, useCallback, useRef, useEffect } from "react";
import type { CSSProperties } from "react";
import type { KudosEntry } from "./kudos-data";
import { PersonBlock } from "./kudos-person-block";

interface KudosCardProps {
  entry: KudosEntry;
  /** highlight cards clip to 3 lines; feed cards to 5 */
  variant?: "highlight" | "feed";
  /** width override for feed cards */
  fullWidth?: boolean;
}

// Module-scope helper — safe for React Compiler (no mutation of outer-scope values)
function copyToClipboard(text: string): Promise<void> {
  try {
    return navigator.clipboard.writeText(text);
  } catch {
    return Promise.reject(new Error("clipboard unavailable"));
  }
}

const FONT_BASE: CSSProperties = {
  fontFamily: "Montserrat, sans-serif",
  fontWeight: 700,
};

export function KudosCard({ entry, variant = "highlight", fullWidth }: KudosCardProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(entry.likeCount);
  const [toastVisible, setToastVisible] = useState(false);
  // H-2: keep the toast timer so we can cancel it if the card unmounts (e.g. filtered out)
  // before it fires — avoids setState-on-unmounted-component.
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    },
    [],
  );

  const handleLike = useCallback(() => {
    setLiked((prev) => {
      const next = !prev;
      setLikeCount((c) => (next ? c + 1 : c - 1));
      return next;
    });
  }, []);

  const handleCopyLink = useCallback(() => {
    // EC-8: clipboard may be unavailable; toast shows regardless
    copyToClipboard(typeof window !== "undefined" ? window.location.href : "")
      .catch(() => undefined)
      .finally(() => {
        setToastVisible(true);
        if (toastTimer.current) clearTimeout(toastTimer.current);
        toastTimer.current = setTimeout(() => setToastVisible(false), 2500);
      });
  }, []);

  const msgLines = variant === "highlight" ? 3 : 5;

  return (
    <div
      style={{
        background: "#FFF8E1",
        border: "4px solid #FFEA9E",
        borderRadius: "16px",
        padding: "24px 24px 16px 24px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        width: fullWidth ? "100%" : "528px",
        flexShrink: 0,
        position: "relative",
      }}
    >
      {/* Toast */}
      {toastVisible && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: "absolute", top: "12px", right: "12px",
            background: "#00101A", color: "#FFEA9E",
            border: "1px solid #998C5F", borderRadius: "8px",
            padding: "8px 14px", zIndex: 10, pointerEvents: "none",
            ...FONT_BASE, fontSize: "13px",
          }}
        >
          Link copied — ready to share!
        </div>
      )}

      {/* Sender → Arrow → Receiver */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "24px" }}>
        <PersonBlock name={entry.sender.name} dept={entry.sender.dept} title={entry.sender.title} initial={entry.sender.initial} />
        <div style={{ width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }} aria-label="to">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <path d="M6 16H26M26 16L18 8M26 16L18 24" stroke="#00101A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <PersonBlock name={entry.receiver.name} dept={entry.receiver.dept} title={entry.receiver.title} initial={entry.receiver.initial} />
      </div>

      {/* Gold divider */}
      <div style={{ height: "1px", backgroundColor: "#FFEA9E" }} aria-hidden="true" />

      {/* Content */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <p style={{ ...FONT_BASE, fontSize: "16px", lineHeight: "24px", letterSpacing: "0.5px", color: "#999", margin: 0 }}>{entry.time}</p>
        <p style={{ ...FONT_BASE, fontSize: "16px", lineHeight: "24px", letterSpacing: "0.5px", color: "#00101A", textAlign: "center", margin: 0 }}>{entry.receiver.title}</p>

        {/* Message box */}
        <div style={{ border: "1px solid #FFEA9E", borderRadius: "12px", background: "rgba(255,234,158,0.40)", padding: "16px 24px" }}>
          <p
            style={{
              ...FONT_BASE, fontSize: "20px", lineHeight: "32px", color: "#00101A", margin: 0,
              display: "-webkit-box", WebkitLineClamp: msgLines, WebkitBoxOrient: "vertical", overflow: "hidden",
            } as CSSProperties}
          >
            {entry.message}
          </p>
        </div>

        {/* Hashtags */}
        <p style={{ ...FONT_BASE, fontSize: "16px", lineHeight: "24px", letterSpacing: "0.5px", color: "#D4271D", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {entry.hashtags.join(" ")}
        </p>
      </div>

      {/* Gold divider */}
      <div style={{ height: "1px", backgroundColor: "#FFEA9E" }} aria-hidden="true" />

      {/* Action row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "24px" }}>
        {/* Like */}
        <button type="button" onClick={handleLike} aria-label={liked ? "Unlike" : "Like"}
          style={{ display: "flex", alignItems: "center", gap: "4px", background: "transparent", border: "none", cursor: "pointer", padding: 0 }}>
          <span style={{ ...FONT_BASE, fontSize: "24px", lineHeight: "32px", color: "#00101A" }}>
            {likeCount.toLocaleString("vi-VN")}
          </span>
          <svg width="32" height="32" viewBox="0 0 32 32" fill={liked ? "#D4271D" : "none"} stroke={liked ? "#D4271D" : "#999"} strokeWidth="2" aria-hidden="true">
            <path d="M16 27s-11-7.037-11-14a7 7 0 0 1 11-5.74A7 7 0 0 1 27 13c0 6.963-11 14-11 14z" />
          </svg>
        </button>

        {/* Copy Link + Xem chi tiết */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button type="button" onClick={handleCopyLink}
            style={{ display: "flex", alignItems: "center", gap: "4px", padding: "16px", background: "transparent", border: "none", cursor: "pointer", borderRadius: "4px", ...FONT_BASE, fontSize: "16px", lineHeight: "24px", letterSpacing: "0.15px", color: "#00101A" }}>
            Copy Link
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="#00101A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="#00101A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Xem chi tiết — placeholder, no navigation (EC-9). Real <button disabled> so it's
              keyboard-correct and skipped in the tab order (M-3) rather than a fake role span. */}
          <button type="button" disabled aria-label="Xem chi tiết (chưa khả dụng)"
            style={{ display: "flex", alignItems: "center", gap: "4px", padding: "16px", background: "transparent", border: "none", cursor: "default", opacity: 0.6, ...FONT_BASE, fontSize: "16px", lineHeight: "24px", letterSpacing: "0.15px", color: "#00101A" }}>
            Xem chi tiết
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M7 17L17 7M17 7H7M17 7V17" stroke="#00101A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
