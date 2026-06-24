// F004 Language Selector — shared locale constants/types.
// Scope: UI + locale persistence only (no content translation yet).

export type Locale = "vi" | "en";

/** Cookie key the header reads on SSR and the selector writes on change. */
export const LOCALE_COOKIE = "locale";

export const DEFAULT_LOCALE: Locale = "vi";

export interface LocaleOption {
  code: Locale;
  /** 2-letter label shown in the trigger and dropdown (per MoMorph design). */
  label: string;
  /** Flag asset path (public/). */
  flag: string;
  /** Accessible flag alt text. */
  flagAlt: string;
}

// Order matches MoMorph dropdown: VN (selected/default) above EN.
export const LOCALES: LocaleOption[] = [
  { code: "vi", label: "VN", flag: "/home-saa/flag-vn.svg", flagAlt: "Cờ Việt Nam" },
  { code: "en", label: "EN", flag: "/home-saa/flag-gb.svg", flagAlt: "United Kingdom flag" },
];

/** Narrow an arbitrary cookie value to a supported Locale, falling back to default. */
export function parseLocale(value: string | undefined | null): Locale {
  return value === "vi" || value === "en" ? value : DEFAULT_LOCALE;
}

/** Look up the option for a locale (always resolves — falls back to default option). */
export function localeOption(code: Locale): LocaleOption {
  return LOCALES.find((l) => l.code === code) ?? LOCALES[0];
}
