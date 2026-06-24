"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { LOCALE_COOKIE, LOCALES, localeOption, type Locale } from "@/lib/locale";

// F004 Language Selector — interactive VN/EN dropdown for the header.
// Authoritative design: MoMorph "Dropdown-ngôn ngữ" (screenId hUyaaugye2, node 721:4942).
//   Container mms_A_Dropdown-List (525:11713): #00070C, 1px #998C5F, radius 8px, padding 6px, flex col.
//   VN item (selected): 108×56, radius 2px, bg rgba(255,234,158,0.20).
//   EN item: 110×56, transparent. Label: Montserrat 700 16px #FFF, letterSpacing 0.15px.
// Scope: UI + cookie persistence only — does NOT translate page content (i18n deferred).

const SELECTED_BG = "rgba(255,234,158,0.20)";

// Persist the choice in a 1-year cookie; path=/ so the Server Component header reads it
// on every route (EC-6). `secure` only on HTTPS so localhost dev still works. Module-scope
// side effect — kept out of the component body (React Compiler immutability rule).
function writeLocaleCookie(code: Locale) {
  const secure = window.location.protocol === "https:" ? "; secure" : "";
  document.cookie = `${LOCALE_COOKIE}=${code}; path=/; max-age=31536000; samesite=lax${secure}`;
}

interface LanguageSelectorProps {
  /** Locale resolved server-side from the cookie, so first render matches SSR. */
  initialLocale: Locale;
}

export function LanguageSelector({ initialLocale }: LanguageSelectorProps) {
  const [open, setOpen] = useState(false);
  const [locale, setLocale] = useState<Locale>(initialLocale);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // EC-2 / EC-3: close on outside pointerdown or Escape; return focus to trigger on Escape.
  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
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

  // On open, move focus into the menu onto the active option (keyboard users; M-2).
  useEffect(() => {
    if (!open) return;
    const activeIndex = Math.max(
      0,
      LOCALES.findIndex((l) => l.code === locale),
    );
    optionRefs.current[activeIndex]?.focus();
  }, [open, locale]);

  const current = localeOption(locale);

  function choose(code: Locale) {
    // EC-4: re-selecting the active locale only closes the menu — skip the redundant write.
    if (code !== locale) {
      setLocale(code);
      writeLocaleCookie(code);
    }
    setOpen(false);
    triggerRef.current?.focus();
  }

  // ArrowDown/Up open the menu from the trigger (focus then moves in via the effect above).
  function onTriggerKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
    }
  }

  // Roving focus between the option buttons (M-2).
  function onOptionKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      optionRefs.current[(index + 1) % LOCALES.length]?.focus();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      optionRefs.current[(index - 1 + LOCALES.length) % LOCALES.length]?.focus();
    }
  }

  return (
    <div ref={rootRef} className="relative">
      {/* Trigger — mirrors the prior header button: current flag + chevron */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={onTriggerKeyDown}
        className="flex items-center"
        style={{
          gap: "8px",
          padding: "16px",
          height: "56px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
        }}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Chọn ngôn ngữ"
      >
        <Image src={current.flag} alt={current.flagAlt} width={20} height={15} />
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          style={{
            transition: "transform 0.15s ease",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          <path
            d="M6 9l6 6 6-6"
            stroke="rgba(255,255,255,0.8)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Dropdown panel — mms_A_Dropdown-List. Plain list of buttons (not a listbox widget):
          correct, simple ARIA for a 2-item language menu. */}
      {open && (
        <ul
          aria-label="Ngôn ngữ"
          className="absolute"
          style={{
            top: "calc(100% + 4px)",
            right: 0,
            margin: 0,
            listStyle: "none",
            display: "flex",
            flexDirection: "column",
            padding: "6px",
            backgroundColor: "#00070C",
            border: "1px solid #998C5F",
            borderRadius: "8px",
            zIndex: 60,
          }}
        >
          {LOCALES.map((option, index) => {
            const selected = option.code === locale;
            return (
              <li key={option.code}>
                <button
                  ref={(el) => {
                    optionRefs.current[index] = el;
                  }}
                  type="button"
                  onClick={() => choose(option.code)}
                  onKeyDown={(event) => onOptionKeyDown(event, index)}
                  aria-current={selected ? "true" : undefined}
                  className={
                    selected ? "flex items-center" : "flex items-center hover:bg-[rgba(255,234,158,0.10)]"
                  }
                  style={{
                    gap: "8px",
                    width: "110px",
                    height: "56px",
                    padding: "0 16px",
                    background: selected ? SELECTED_BG : "transparent",
                    border: "none",
                    borderRadius: selected ? "2px" : "0",
                    cursor: "pointer",
                  }}
                >
                  <Image src={option.flag} alt={option.flagAlt} width={20} height={15} />
                  <span
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      fontSize: "16px",
                      fontWeight: 700,
                      lineHeight: "24px",
                      letterSpacing: "0.15px",
                      color: "#FFFFFF",
                    }}
                  >
                    {option.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
