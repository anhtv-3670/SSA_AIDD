"use client";

// Hashtag chip picker — design node mms_E_Frame 536 (I520:11647;520:9890).
// "+ Hashtag / Tối đa 5" button opens a dropdown of DB tags → click adds chip.
// "x" removes chip. Block 6th (EC-5). Keyboard: Escape closes dropdown, arrow nav.

import { useState, useRef, useEffect, useCallback } from "react";
import type { HashtagOption } from "@/lib/data/catalog-queries";
import { WriteKudoHashtagChip } from "./write-kudo-hashtag-chip";
import { WriteKudoHashtagDropdown } from "./write-kudo-hashtag-dropdown";
import { BASE_FONT, ERROR_TEXT } from "./write-kudo-styles";

interface WriteKudoHashtagsProps {
  /** Currently selected hashtag labels (e.g. ["#Dedicated", "#Inspiring"]). */
  selected: string[];
  /** Called with (labels, ids) when the selection changes. */
  onChange: (labels: string[], ids: number[]) => void;
  /** Hashtag catalog from DB. */
  options: HashtagOption[];
  error?: string;
}

const MAX_TAGS = 5;

export function WriteKudoHashtags({
  selected,
  onChange,
  options,
  error,
}: WriteKudoHashtagsProps) {
  const [open, setOpen] = useState(false);
  const [limitMsg, setLimitMsg] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const limitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Options not yet selected (matched by label)
  const available = options.filter((o) => !selected.includes(o.label));

  // Clear limit-message timer on unmount
  useEffect(() => {
    return () => {
      if (limitTimer.current) clearTimeout(limitTimer.current);
    };
  }, []);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  // Escape closes
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Focus first option when dropdown opens
  useEffect(() => {
    if (open && available.length > 0) {
      optionRefs.current[0]?.focus();
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAdd = useCallback(
    (opt: HashtagOption) => {
      if (selected.length >= MAX_TAGS) {
        setLimitMsg(true);
        if (limitTimer.current) clearTimeout(limitTimer.current);
        limitTimer.current = setTimeout(() => setLimitMsg(false), 2500);
        setOpen(false);
        return;
      }
      const newLabels = [...selected, opt.label];
      const newIds = options
        .filter((o) => newLabels.includes(o.label))
        .map((o) => o.id);
      onChange(newLabels, newIds);
      setOpen(false);
      triggerRef.current?.focus();
    },
    [selected, options, onChange],
  );

  const handleRemove = useCallback(
    (label: string) => {
      const newLabels = selected.filter((t) => t !== label);
      const newIds = options
        .filter((o) => newLabels.includes(o.label))
        .map((o) => o.id);
      onChange(newLabels, newIds);
    },
    [selected, options, onChange],
  );

  function onTriggerKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      setOpen(true);
    }
  }

  function onOptionKeyDown(e: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      optionRefs.current[(index + 1) % available.length]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      optionRefs.current[(index - 1 + available.length) % available.length]?.focus();
    }
  }

  const hasError = Boolean(error);
  const borderColor = hasError ? "#D4271D" : "#998C5F";
  const atMax = selected.length >= MAX_TAGS;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      {/* Chips row + add button */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
        {selected.map((label) => (
          <WriteKudoHashtagChip
            key={label}
            tag={label}
            borderColor={borderColor}
            onRemove={handleRemove}
          />
        ))}

        {/* "+ Hashtag" button — hidden at max (EC-6 pattern) */}
        {!atMax && (
          <div ref={containerRef} style={{ position: "relative" }}>
            <button
              ref={triggerRef}
              type="button"
              onClick={() => setOpen((p) => !p)}
              onKeyDown={onTriggerKeyDown}
              aria-haspopup="listbox"
              aria-expanded={open}
              aria-label="Thêm hashtag"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "2px",
                padding: "4px 8px",
                border: `1px solid ${borderColor}`,
                borderRadius: "8px",
                background: "#FFF",
                cursor: "pointer",
                minWidth: "80px",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M8 3v10M3 8h10"
                    stroke="#00101A"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <span
                  style={{
                    ...BASE_FONT,
                    fontSize: "11px",
                    lineHeight: "16px",
                    letterSpacing: "0.5px",
                    color: "#00101A",
                  }}
                >
                  Hashtag
                </span>
              </span>
              <span
                style={{
                  ...BASE_FONT,
                  fontSize: "11px",
                  lineHeight: "16px",
                  letterSpacing: "0.5px",
                  color: "#999",
                }}
              >
                Tối đa {MAX_TAGS}
              </span>
            </button>

            {open && available.length > 0 && (
              <WriteKudoHashtagDropdown
                options={available}
                optionRefs={optionRefs}
                onAdd={handleAdd}
                onOptionKeyDown={onOptionKeyDown}
              />
            )}
          </div>
        )}
      </div>

      {/* EC-5: limit message */}
      {limitMsg && (
        <p role="alert" style={ERROR_TEXT}>
          Tối đa 5 hashtag
        </p>
      )}

      {/* Validation error */}
      {hasError && !limitMsg && (
        <p id="hashtags-error" role="alert" style={ERROR_TEXT}>
          {error}
        </p>
      )}
    </div>
  );
}
