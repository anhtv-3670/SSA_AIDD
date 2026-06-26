"use client";

// Recipient autocomplete over real DB profiles list.
// Design: 56px tall input, border #998C5F, radius 8px, white bg, placeholder "Tìm kiếm" + chevron.
// A11y: WAI-ARIA combobox pattern (role=combobox on input), Escape closes, outside-click closes.

import { useState, useRef, useEffect, useCallback } from "react";
import type { RecipientOption } from "./write-kudo-modal";
import { WriteKudoRecipientList } from "./write-kudo-recipient-list";
import { BASE_FONT } from "./write-kudo-styles";

interface WriteKudoRecipientProps {
  /** Display name of the currently selected recipient (empty = none selected). */
  value: string;
  /** Called with (id, name) when a recipient is selected. */
  onSelect: (id: string, name: string) => void;
  /** Profiles from DB — passed from the modal. */
  recipients: RecipientOption[];
  error?: string;
}

export function WriteKudoRecipient({
  value,
  onSelect,
  recipients,
  error,
}: WriteKudoRecipientProps) {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const filtered = recipients.filter((s) =>
    s.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

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

  // Escape closes and returns focus to input
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        inputRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
      setOpen(true);
      // Clear selection when user types again
      if (value) onSelect("", "");
    },
    [value, onSelect],
  );

  const handleSelect = useCallback(
    (id: string, name: string) => {
      setQuery(name);
      onSelect(id, name);
      setOpen(false);
      inputRef.current?.focus();
    },
    [onSelect],
  );

  function onInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if ((e.key === "ArrowDown" || e.key === "ArrowUp") && filtered.length > 0) {
      e.preventDefault();
      setOpen(true);
      optionRefs.current[0]?.focus();
    }
  }

  function onOptionKeyDown(e: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      optionRefs.current[(index + 1) % filtered.length]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (index === 0) {
        inputRef.current?.focus();
        setOpen(false);
      } else {
        optionRefs.current[index - 1]?.focus();
      }
    }
  }

  const hasError = Boolean(error);
  const listOpen = open && filtered.length > 0;

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 24px",
          border: `1px solid ${hasError ? "#D4271D" : "#998C5F"}`,
          borderRadius: "8px",
          background: "#FFF",
          gap: "8px",
        }}
      >
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setOpen(true)}
          onKeyDown={onInputKeyDown}
          placeholder="Tìm kiếm"
          aria-label="Tìm kiếm người nhận"
          aria-autocomplete="list"
          aria-controls="recipient-listbox"
          aria-expanded={listOpen}
          aria-required="true"
          aria-describedby={hasError ? "recipient-error" : undefined}
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            background: "transparent",
            ...BASE_FONT,
            fontSize: "16px",
            lineHeight: "24px",
            letterSpacing: "0.15px",
            color: "#00101A",
          }}
        />
        {/* Chevron icon */}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          style={{
            transform: open ? "rotate(180deg)" : undefined,
            transition: "transform 150ms",
            flexShrink: 0,
          }}
        >
          <path
            d="M6 9L12 15L18 9"
            stroke="#999"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Dropdown */}
      {listOpen && (
        <WriteKudoRecipientList
          options={filtered}
          selectedName={value}
          optionRefs={optionRefs}
          onSelect={handleSelect}
          onOptionKeyDown={onOptionKeyDown}
        />
      )}

      {/* Error message */}
      {hasError && (
        <p
          id="recipient-error"
          role="alert"
          style={{
            margin: "4px 0 0",
            ...BASE_FONT,
            fontSize: "13px",
            color: "#D4271D",
            lineHeight: "20px",
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
