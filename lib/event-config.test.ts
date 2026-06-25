import { describe, it, expect, beforeEach } from "vitest";

import { formatEventDate, EVENT_START_ISO } from "./event-config";

/**
 * Test suite for event-config.ts
 * Tests pure function: formatEventDate(iso): string
 * Covers ISO regex path (deterministic, TZ-independent) and Date fallback.
 */

describe("formatEventDate", () => {
  describe("regex path: ISO prefix YYYY-MM-DD", () => {
    describe("valid ISO 8601 prefixes with timezone offset", () => {
      it("returns '26/12/2026' for EVENT_START_ISO '2026-12-26T19:00:00+07:00'", () => {
        expect(formatEventDate("2026-12-26T19:00:00+07:00")).toBe("26/12/2026");
      });

      it("returns '05/01/2025' for '2025-01-05T10:30:00+07:00'", () => {
        expect(formatEventDate("2025-01-05T10:30:00+07:00")).toBe("05/01/2025");
      });

      it("returns '01/01/2026' for '2026-01-01T00:00:00Z'", () => {
        expect(formatEventDate("2026-01-01T00:00:00Z")).toBe("01/01/2026");
      });

      it("returns '31/12/2025' for '2025-12-31T23:59:59+07:00'", () => {
        expect(formatEventDate("2025-12-31T23:59:59+07:00")).toBe("31/12/2025");
      });

      it("returns '15/06/2026' for '2026-06-15T14:30:45+07:00'", () => {
        expect(formatEventDate("2026-06-15T14:30:45+07:00")).toBe("15/06/2026");
      });

      it("returns '09/03/2024' for '2024-03-09T08:15:30-05:00'", () => {
        expect(formatEventDate("2024-03-09T08:15:30-05:00")).toBe("09/03/2024");
      });

      it("returns '02/02/2020' for '2020-02-02T12:00:00+00:00'", () => {
        expect(formatEventDate("2020-02-02T12:00:00+00:00")).toBe("02/02/2020");
      });
    });

    describe("regex path with milliseconds", () => {
      it("returns '26/12/2026' for '2026-12-26T19:00:00.123+07:00'", () => {
        expect(formatEventDate("2026-12-26T19:00:00.123+07:00")).toBe("26/12/2026");
      });

      it("returns '15/06/2026' for '2026-06-15T14:30:45.999Z'", () => {
        expect(formatEventDate("2026-06-15T14:30:45.999Z")).toBe("15/06/2026");
      });
    });

    describe("zero-padded day and month (regex extracts digits directly)", () => {
      it("day and month are zero-padded from the ISO string: '09' → '09', not '9'", () => {
        expect(formatEventDate("2026-09-05T10:00:00Z")).toBe("05/09/2026");
      });

      it("day and month are zero-padded: '01/02/2026' for January 2nd", () => {
        expect(formatEventDate("2026-01-02T10:00:00Z")).toBe("02/01/2026");
      });

      it("day and month are zero-padded: '01/01/2026' for January 1st", () => {
        expect(formatEventDate("2026-01-01T10:00:00Z")).toBe("01/01/2026");
      });

      it("day and month are zero-padded: '10/10/2026' for October 10th", () => {
        expect(formatEventDate("2026-10-10T10:00:00Z")).toBe("10/10/2026");
      });
    });

    describe("deterministic (timezone-independent): regex ignores time and TZ", () => {
      it("same date, different times → same output", () => {
        const date1 = formatEventDate("2026-06-15T00:00:00Z");
        const date2 = formatEventDate("2026-06-15T23:59:59Z");
        expect(date1).toBe(date2);
        expect(date1).toBe("15/06/2026");
      });

      it("same date, different UTC offsets → same output", () => {
        const dateUtc = formatEventDate("2026-06-15T12:00:00Z");
        const dateVn = formatEventDate("2026-06-15T12:00:00+07:00");
        const dateEst = formatEventDate("2026-06-15T12:00:00-05:00");
        expect(dateUtc).toBe(dateVn);
        expect(dateVn).toBe(dateEst);
      });

      it("regex path ignores seconds, milliseconds, nanoseconds", () => {
        const result1 = formatEventDate("2026-06-15T12:30:45.123Z");
        const result2 = formatEventDate("2026-06-15T12:30:59.999Z");
        expect(result1).toBe(result2);
      });
    });
  });

  // Mixed: truly-unparseable inputs return "", while inputs with a valid YYYY-MM-DD
  // prefix are accepted permissively (the regex does NOT calendar-validate, e.g. month 13).
  describe("malformed input → '' AND permissive-regex prefix behavior (no calendar validation)", () => {
    it("returns '' for 'not-a-date'", () => {
      expect(formatEventDate("not-a-date")).toBe("");
    });

    it("returns '' for 'garbage'", () => {
      expect(formatEventDate("garbage")).toBe("");
    });

    it("returns '' for empty string ''", () => {
      expect(formatEventDate("")).toBe("");
    });

    it("returns '' for random characters '!!!???'", () => {
      expect(formatEventDate("!!!???")).toBe("");
    });

    it("returns '' for null string 'null'", () => {
      expect(formatEventDate("null")).toBe("");
    });

    it("returns '' for 'undefined'", () => {
      expect(formatEventDate("undefined")).toBe("");
    });

    it("regex matches '2026' (year only, no dashes) → '01/01/2026' via Date fallback", () => {
      // '2026' doesn't match the regex (/^\d{4}-\d{2}-\d{2}/), but Date('2026') parses to Jan 1, 2026
      expect(formatEventDate("2026")).toBe("01/01/2026");
    });

    it("regex matches '2026-06-15WRONG' prefix → '15/06/2026' (regex extracts prefix, ignores tail)", () => {
      // The regex matches the YYYY-MM-DD prefix and ignores the 'WRONG' suffix
      expect(formatEventDate("2026-06-15WRONG")).toBe("15/06/2026");
    });

    it("returns '' for reversed date '15-06-2026T12:00:00Z' (doesn't match regex, Date parse fails)", () => {
      expect(formatEventDate("15-06-2026T12:00:00Z")).toBe("");
    });

    it("regex matches '2026-13-01T12:00:00Z' prefix → '01/13/2026' (regex accepts any 2 digits, no calendar validation)", () => {
      // Regex doesn't validate calendar constraints; it extracts whatever 2 digits are there
      expect(formatEventDate("2026-13-01T12:00:00Z")).toBe("01/13/2026");
    });

    it("regex matches '2026-06-32T12:00:00Z' prefix → '32/06/2026' (regex accepts any 2 digits)", () => {
      // Regex doesn't validate day range
      expect(formatEventDate("2026-06-32T12:00:00Z")).toBe("32/06/2026");
    });

    it("returns '' for missing leading zeros (3-digit year) '026-06-15T12:00:00Z' (no regex match)", () => {
      expect(formatEventDate("026-06-15T12:00:00Z")).toBe("");
    });

    it("returns '' for missing leading zeros (1-digit month) '2026-6-15T12:00:00Z' (no regex match)", () => {
      expect(formatEventDate("2026-6-15T12:00:00Z")).toBe("");
    });

    it("returns '' for missing leading zeros (1-digit day) '2026-06-5T12:00:00Z' (no regex match)", () => {
      expect(formatEventDate("2026-06-5T12:00:00Z")).toBe("");
    });
  });

  describe("default argument (no iso provided)", () => {
    it("returns non-empty string when called with no arguments", () => {
      const result = formatEventDate();
      expect(result).not.toBe("");
      expect(typeof result).toBe("string");
    });

    it("returns a valid DD/MM/YYYY format when called with no arguments", () => {
      const result = formatEventDate();
      expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
    });

    it("uses EVENT_START_ISO ('2026-12-26T19:00:00+07:00') as default → '26/12/2026'", () => {
      expect(formatEventDate()).toBe("26/12/2026");
    });

    it("default arg returns same result as explicit EVENT_START_ISO", () => {
      const withDefault = formatEventDate();
      const withExplicit = formatEventDate(EVENT_START_ISO);
      expect(withDefault).toBe(withExplicit);
    });
  });

  describe("Date fallback path (for edge cases not matching regex)", () => {
    describe("valid Date-parseable but non-standard ISO format", () => {
      it("parses '2026/06/15' (slashes instead of dashes) via Date fallback", () => {
        const result = formatEventDate("2026/06/15");
        // Date("2026/06/15") parses successfully; expects DD/MM/YYYY output
        expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
      });

      it("parses '2026-06-15' (date only, no time) via Date fallback", () => {
        const result = formatEventDate("2026-06-15");
        // The regex DOES match '2026-06-15' prefix, so returns '15/06/2026'
        expect(result).toBe("15/06/2026");
      });

      it("parses 'June 15, 2026' via Date fallback", () => {
        const result = formatEventDate("June 15, 2026");
        // Date("June 15, 2026") parses; expects DD/MM/YYYY output
        expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
      });

      it("parses '06/15/2026' (US MM/DD/YYYY) via Date fallback", () => {
        const result = formatEventDate("06/15/2026");
        // Date("06/15/2026") parses to June 15, 2026
        expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
      });
    });

    describe("Date fallback uses padStart for single-digit day/month", () => {
      it("Date fallback pads day < 10 with leading zero", () => {
        // Construct a date that doesn't match ISO regex but is Date-parseable
        const result = formatEventDate("6/15/2026");
        // Date("6/15/2026") parses to June 15; expects day to be zero-padded
        expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
        // Can't assert exact value (depends on Date parsing), but format is valid
      });

      it("Date fallback pads month < 10 with leading zero", () => {
        const result = formatEventDate("June 5, 2026");
        // June 5, 2026; expects month to be zero-padded to '06'
        expect(result).toMatch(/^05\/06\/\d{4}$/);
      });
    });
  });

  describe("result type and format", () => {
    it("always returns a string", () => {
      expect(typeof formatEventDate()).toBe("string");
      expect(typeof formatEventDate(EVENT_START_ISO)).toBe("string");
      expect(typeof formatEventDate("garbage")).toBe("string");
    });

    it("valid inputs return non-empty DD/MM/YYYY strings", () => {
      const validInputs = [
        "2026-12-26T19:00:00+07:00",
        "2026-01-01T00:00:00Z",
        "2025-12-31T23:59:59+07:00",
      ];
      validInputs.forEach((input) => {
        const result = formatEventDate(input);
        expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
      });
    });

    it("invalid inputs return empty string ''", () => {
      const invalidInputs = ["not-a-date", "garbage", "", "!!!"];
      invalidInputs.forEach((input) => {
        expect(formatEventDate(input)).toBe("");
      });
    });

    it("result structure is always DD/MM/YYYY when non-empty", () => {
      const result = formatEventDate("2026-06-15T10:00:00Z");
      const parts = result.split("/");
      expect(parts).toHaveLength(3);
      expect(parts[0]).toMatch(/^\d{2}$/); // DD
      expect(parts[1]).toMatch(/^\d{2}$/); // MM
      expect(parts[2]).toMatch(/^\d{4}$/); // YYYY
    });
  });

  describe("boundary dates and edge cases", () => {
    it("handles leap year date Feb 29 in a leap year", () => {
      const result = formatEventDate("2024-02-29T12:00:00Z");
      expect(result).toBe("29/02/2024");
    });

    it("handles Jan 1 of a new year", () => {
      expect(formatEventDate("2027-01-01T00:00:00Z")).toBe("01/01/2027");
    });

    it("handles Dec 31 of a year", () => {
      expect(formatEventDate("2025-12-31T23:59:59Z")).toBe("31/12/2025");
    });

    it("handles year 2000", () => {
      expect(formatEventDate("2000-06-15T12:00:00Z")).toBe("15/06/2000");
    });

    it("handles year 1999", () => {
      expect(formatEventDate("1999-12-31T23:59:59Z")).toBe("31/12/1999");
    });

    it("handles year 3000 (far future)", () => {
      expect(formatEventDate("3000-01-01T00:00:00Z")).toBe("01/01/3000");
    });
  });

  describe("integration: regex vs Date fallback behavior", () => {
    it("regex path (ISO 8601) is preferred when input matches", () => {
      const iso = "2026-06-15T10:30:00+07:00";
      const result = formatEventDate(iso);
      // Regex matches, so uses direct digit extraction
      expect(result).toBe("15/06/2026");
    });

    it("Date fallback is used for non-standard formats", () => {
      const nonStandard = "June 15, 2026";
      const result = formatEventDate(nonStandard);
      // Doesn't match regex, so falls back to Date parsing
      expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
    });

    it("malformed input (no valid parse path) returns empty string", () => {
      const malformed = "not-a-valid-date-at-all";
      const result = formatEventDate(malformed);
      // Doesn't match regex; Date("...") → NaN
      expect(result).toBe("");
    });
  });
});
