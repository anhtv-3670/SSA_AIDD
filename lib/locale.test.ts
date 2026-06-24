import { describe, it, expect } from "vitest";

import {
  parseLocale,
  localeOption,
  LOCALES,
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  type Locale,
  type LocaleOption,
} from "./locale";

describe("parseLocale", () => {
  it("returns 'vi' when passed 'vi'", () => {
    expect(parseLocale("vi")).toBe("vi");
  });

  it("returns 'en' when passed 'en'", () => {
    expect(parseLocale("en")).toBe("en");
  });

  it("returns DEFAULT_LOCALE when passed undefined", () => {
    expect(parseLocale(undefined)).toBe(DEFAULT_LOCALE);
  });

  it("returns DEFAULT_LOCALE when passed null", () => {
    expect(parseLocale(null)).toBe(DEFAULT_LOCALE);
  });

  it("returns DEFAULT_LOCALE when passed empty string", () => {
    expect(parseLocale("")).toBe(DEFAULT_LOCALE);
  });

  it("returns DEFAULT_LOCALE when passed unsupported locale code 'fr'", () => {
    expect(parseLocale("fr")).toBe(DEFAULT_LOCALE);
  });

  it("returns DEFAULT_LOCALE when passed uppercase 'EN'", () => {
    expect(parseLocale("EN")).toBe(DEFAULT_LOCALE);
  });

  it("returns DEFAULT_LOCALE when passed value with leading whitespace ' vi'", () => {
    expect(parseLocale(" vi")).toBe(DEFAULT_LOCALE);
  });

  it("returns DEFAULT_LOCALE when passed value with trailing whitespace 'vi '", () => {
    expect(parseLocale("vi ")).toBe(DEFAULT_LOCALE);
  });

  it("returns DEFAULT_LOCALE when passed arbitrary string", () => {
    expect(parseLocale("garbage")).toBe(DEFAULT_LOCALE);
  });

  it("returns DEFAULT_LOCALE when passed locale code mixed case 'En'", () => {
    expect(parseLocale("En")).toBe(DEFAULT_LOCALE);
  });
});

describe("localeOption", () => {
  it("returns the option object for locale 'vi'", () => {
    const option = localeOption("vi");
    expect(option).toBeDefined();
    expect(option.code).toBe("vi");
  });

  it("returns the option object for locale 'en'", () => {
    const option = localeOption("en");
    expect(option).toBeDefined();
    expect(option.code).toBe("en");
  });

  it("returns correct label 'VN' for locale 'vi'", () => {
    expect(localeOption("vi").label).toBe("VN");
  });

  it("returns correct label 'EN' for locale 'en'", () => {
    expect(localeOption("en").label).toBe("EN");
  });

  it("returns correct flag path '/home-saa/flag-vn.svg' for locale 'vi'", () => {
    expect(localeOption("vi").flag).toBe("/home-saa/flag-vn.svg");
  });

  it("returns correct flag path '/home-saa/flag-gb.svg' for locale 'en'", () => {
    expect(localeOption("en").flag).toBe("/home-saa/flag-gb.svg");
  });

  it("returns correct flag alt text 'Cờ Việt Nam' for locale 'vi'", () => {
    expect(localeOption("vi").flagAlt).toBe("Cờ Việt Nam");
  });

  it("returns correct flag alt text 'United Kingdom flag' for locale 'en'", () => {
    expect(localeOption("en").flagAlt).toBe("United Kingdom flag");
  });

  it("always resolves — never throws for a valid Locale type", () => {
    const vi: Locale = "vi";
    const en: Locale = "en";
    expect(() => localeOption(vi)).not.toThrow();
    expect(() => localeOption(en)).not.toThrow();
  });
});

describe("LOCALES constant", () => {
  it("is an array", () => {
    expect(Array.isArray(LOCALES)).toBe(true);
  });

  it("has exactly 2 entries", () => {
    expect(LOCALES).toHaveLength(2);
  });

  it("has entries in order [vi, en]", () => {
    expect(LOCALES[0].code).toBe("vi");
    expect(LOCALES[1].code).toBe("en");
  });

  it("every entry has a non-empty code", () => {
    LOCALES.forEach((option) => {
      expect(option.code).toBeTruthy();
      expect(typeof option.code).toBe("string");
    });
  });

  it("every entry has a non-empty label", () => {
    LOCALES.forEach((option) => {
      expect(option.label).toBeTruthy();
      expect(typeof option.label).toBe("string");
    });
  });

  it("every entry has a non-empty flag path", () => {
    LOCALES.forEach((option) => {
      expect(option.flag).toBeTruthy();
      expect(typeof option.flag).toBe("string");
    });
  });

  it("every entry has a non-empty flagAlt", () => {
    LOCALES.forEach((option) => {
      expect(option.flagAlt).toBeTruthy();
      expect(typeof option.flagAlt).toBe("string");
    });
  });

  it("every entry has a flag path under /home-saa/", () => {
    LOCALES.forEach((option) => {
      expect(option.flag).toMatch(/^\/home-saa\//);
    });
  });

  it("every entry is a valid LocaleOption with all required fields", () => {
    LOCALES.forEach((option) => {
      const isValid: boolean =
        typeof option.code === "string" &&
        typeof option.label === "string" &&
        typeof option.flag === "string" &&
        typeof option.flagAlt === "string" &&
        option.code.length > 0 &&
        option.label.length > 0 &&
        option.flag.length > 0 &&
        option.flagAlt.length > 0;
      expect(isValid).toBe(true);
    });
  });
});

describe("DEFAULT_LOCALE constant", () => {
  it("is 'vi'", () => {
    expect(DEFAULT_LOCALE).toBe("vi");
  });

  it("matches the first LOCALES entry code", () => {
    expect(DEFAULT_LOCALE).toBe(LOCALES[0].code);
  });

  it("is a valid Locale type", () => {
    const validCodes: Locale[] = ["vi", "en"];
    expect(validCodes).toContain(DEFAULT_LOCALE);
  });
});

describe("LOCALE_COOKIE constant", () => {
  it("is 'locale'", () => {
    expect(LOCALE_COOKIE).toBe("locale");
  });

  it("is a non-empty string", () => {
    expect(typeof LOCALE_COOKIE).toBe("string");
    expect(LOCALE_COOKIE.length).toBeGreaterThan(0);
  });
});

describe("Integration: parseLocale → localeOption", () => {
  it("parseLocale('vi') → localeOption returns VN option", () => {
    const locale = parseLocale("vi");
    const option = localeOption(locale);
    expect(option.label).toBe("VN");
  });

  it("parseLocale('en') → localeOption returns EN option", () => {
    const locale = parseLocale("en");
    const option = localeOption(locale);
    expect(option.label).toBe("EN");
  });

  it("parseLocale(undefined) → localeOption returns default (VN) option", () => {
    const locale = parseLocale(undefined);
    const option = localeOption(locale);
    expect(option.code).toBe("vi");
    expect(option.label).toBe("VN");
  });

  it("parseLocale('invalid') → localeOption returns default (VN) option", () => {
    const locale = parseLocale("invalid");
    const option = localeOption(locale);
    expect(option.code).toBe("vi");
    expect(option.label).toBe("VN");
  });
});
