"use client";

// Compose bar — two pills side by side.
// A.1 (738x72px): button-styled trigger — pencil icon + placeholder text, opens Write Kudo modal.
//   Was previously an <input> that fed `query`. Per F006 integration spec, it no longer feeds
//   query; it now calls onOpenWrite. The pill look (border #998C5F, radius 68px, bg translucent)
//   is preserved exactly.
// A.2 (381x72px): Sunner search input — still drives `query` for highlight/all filtering.
// Authoritative design: Button chuc nang (2940:13448)

import { useCallback } from "react";

interface KudosComposeBarProps {
  query: string;
  onQueryChange: (val: string) => void;
  onOpenWrite: () => void;
}

export function KudosComposeBar({ query, onQueryChange, onOpenWrite }: KudosComposeBarProps) {
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onQueryChange(e.target.value);
    },
    [onQueryChange],
  );

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "32px",
        padding: "0 144px",
        width: "100%",
      }}
    >
      {/* A.1 — Write Kudo trigger button (pill-styled, not an input) */}
      <button
        type="button"
        onClick={onOpenWrite}
        aria-label="Gửi lời cảm ơn và ghi nhận đến ai đó"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          width: "738px",
          height: "72px",
          border: "1px solid #998C5F",
          borderRadius: "68px",
          background: "rgba(255,234,158,0.10)",
          padding: "24px 16px",
          flexShrink: 0,
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        {/* Pencil icon */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span
          style={{
            flex: 1,
            fontFamily: "Montserrat, sans-serif",
            fontSize: "16px",
            fontWeight: 700,
            lineHeight: "24px",
            letterSpacing: "0.15px",
            color: "rgba(255,255,255,0.5)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          Hôm nay, bạn muốn gửi lời cảm ơn và ghi nhận đến ai?
        </span>
      </button>

      {/* A.2 — Sunner search — EC-11: maxLength 100 */}
      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          width: "381px",
          height: "72px",
          border: "1px solid #998C5F",
          borderRadius: "68px",
          background: "rgba(255,234,158,0.10)",
          padding: "24px 16px",
          flexShrink: 0,
          cursor: "text",
        }}
      >
        {/* Search icon */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="11" cy="11" r="8" stroke="#FFFFFF" strokeWidth="2" />
          <path d="M21 21l-4.35-4.35" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={handleSearchChange}
          maxLength={100}
          aria-label="Tìm kiếm profile Sunner"
          placeholder="Tìm kiếm profile Sunner"
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            fontFamily: "Montserrat, sans-serif",
            fontSize: "16px",
            fontWeight: 700,
            lineHeight: "24px",
            letterSpacing: "0.15px",
            color: "#FFFFFF",
          }}
        />
      </label>
    </div>
  );
}
