"use client";

// Authoritative: B.1.1/B.1.2 filter buttons
// Border: 1px solid #998C5F, bg: rgba(255,234,158,0.10), radius 4px
// Montserrat 700 16px white, gap 8px, padding 16px, row items
// A11y (M-1): plain button menu (not a listbox widget) — buttons are natively focusable;
// trigger opens with ArrowUp/Down, options support arrow roving + Escape-to-close.

import { useState, useRef, useEffect } from "react";

interface KudosFilterDropdownProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

export function KudosFilterDropdown({ label, options, value, onChange }: KudosFilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // "Tất cả" (clear) + the supplied options, as {label, val} rows.
  const items = [{ label: "Tất cả", val: "" }, ...options.map((o) => ({ label: o, val: o }))];

  // Close on outside pointerdown or Escape (Escape returns focus to the trigger).
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // On open, move focus onto the active option (keyboard users).
  useEffect(() => {
    if (!open) return;
    const active = Math.max(0, items.findIndex((it) => it.val === value));
    optionRefs.current[active]?.focus();
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  function onTriggerKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      setOpen(true);
    }
  }

  function onOptionKeyDown(e: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      optionRefs.current[(index + 1) % items.length]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      optionRefs.current[(index - 1 + items.length) % items.length]?.focus();
    }
  }

  function choose(val: string) {
    onChange(val);
    setOpen(false);
    triggerRef.current?.focus();
  }

  const displayLabel = value || label;

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((p) => !p)}
        onKeyDown={onTriggerKeyDown}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "16px",
          border: "1px solid #998C5F",
          borderRadius: "4px",
          background: "rgba(255,234,158,0.10)",
          cursor: "pointer",
          fontFamily: "Montserrat, sans-serif",
          fontSize: "16px",
          fontWeight: 700,
          lineHeight: "24px",
          color: value ? "#FFEA9E" : "#FFFFFF",
          whiteSpace: "nowrap",
        }}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={`Lọc theo ${label}`}
      >
        {displayLabel}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          style={{ transform: open ? "rotate(180deg)" : undefined, transition: "transform 150ms" }}
        >
          <path d="M6 9L12 15L18 9" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <ul
          aria-label={label}
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            minWidth: "100%",
            background: "#001825",
            border: "1px solid #998C5F",
            borderRadius: "4px",
            listStyle: "none",
            padding: "4px 0",
            margin: 0,
            zIndex: 100,
          }}
        >
          {items.map((it, index) => {
            const selected = value === it.val;
            return (
              <li key={it.val || "__all__"}>
                <button
                  ref={(el) => {
                    optionRefs.current[index] = el;
                  }}
                  type="button"
                  onClick={() => choose(it.val)}
                  onKeyDown={(e) => onOptionKeyDown(e, index)}
                  aria-current={selected ? "true" : undefined}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: "10px 16px",
                    background: selected ? "rgba(255,234,158,0.08)" : "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: "14px",
                    fontWeight: 700,
                    color: selected ? "#FFEA9E" : "#FFFFFF",
                  }}
                >
                  {it.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
