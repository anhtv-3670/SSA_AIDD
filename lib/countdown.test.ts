import { describe, it, expect } from "vitest";

import { computeCountdown, pad2, type CountdownResult } from "./countdown";

/**
 * Test suite for countdown.ts
 * Tests pure math functions: computeCountdown(targetMs, nowMs) and pad2(n)
 * Mapped to F008 test cases (EC-1 through EC-11)
 */

describe("pad2", () => {
  describe("single-digit numbers (EC-2)", () => {
    it("returns '00' for 0", () => {
      expect(pad2(0)).toBe("00");
    });

    it("returns '05' for 5", () => {
      expect(pad2(5)).toBe("05");
    });

    it("returns '09' for 9", () => {
      expect(pad2(9)).toBe("09");
    });
  });

  describe("two-digit numbers", () => {
    it("returns '10' for 10", () => {
      expect(pad2(10)).toBe("10");
    });

    it("returns '23' for 23 (max HOURS)", () => {
      expect(pad2(23)).toBe("23");
    });

    it("returns '31' for 31 (max DAYS in display)", () => {
      expect(pad2(31)).toBe("31");
    });

    it("returns '59' for 59 (max MINUTES)", () => {
      expect(pad2(59)).toBe("59");
    });
  });

  describe("numbers > 99 (EC-4 over-range)", () => {
    it("returns '99' for 100 (clamped to 99)", () => {
      expect(pad2(100)).toBe("99");
    });

    it("returns '99' for 999", () => {
      expect(pad2(999)).toBe("99");
    });

    it("returns '99' for 120 (hours = 120 would be over-range)", () => {
      expect(pad2(120)).toBe("99");
    });
  });

  describe("negative numbers (EC-5, negative HOURS/MINUTES)", () => {
    it("returns '00' for -1", () => {
      expect(pad2(-1)).toBe("00");
    });

    it("returns '00' for -23", () => {
      expect(pad2(-23)).toBe("00");
    });

    it("returns '00' for -100", () => {
      expect(pad2(-100)).toBe("00");
    });
  });

  describe("non-finite and special values", () => {
    it("returns '00' for NaN", () => {
      expect(pad2(NaN)).toBe("00");
    });

    it("returns '00' for Infinity", () => {
      expect(pad2(Infinity)).toBe("00");
    });

    it("returns '00' for -Infinity", () => {
      expect(pad2(-Infinity)).toBe("00");
    });
  });

  describe("floating-point numbers (truncated via Math.floor)", () => {
    it("returns '05' for 5.9 (floor → 5)", () => {
      expect(pad2(5.9)).toBe("05");
    });

    it("returns '23' for 23.5 (floor → 23)", () => {
      expect(pad2(23.5)).toBe("23");
    });

    it("returns '99' for 99.1 (floor → 99)", () => {
      expect(pad2(99.1)).toBe("99");
    });

    it("returns '00' for 0.5 (floor → 0)", () => {
      expect(pad2(0.5)).toBe("00");
    });
  });
});

describe("computeCountdown", () => {
  describe("zero and negative diffs (EC-8 ≤0)", () => {
    it("returns {0, 0, 0, 0} when diff is exactly 0", () => {
      const target = 1000;
      const now = 1000;
      expect(computeCountdown(target, now)).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    });

    it("returns {0, 0, 0, 0} when diff is negative (target < now)", () => {
      const target = 500;
      const now = 1000;
      expect(computeCountdown(target, now)).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    });

    it("returns {0, 0, 0, 0} when target is far in the past", () => {
      const target = 0;
      const now = 86_400_000 * 100; // 100 days later
      expect(computeCountdown(target, now)).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    });
  });

  describe("sub-day countdowns (EC-6 <1 day)", () => {
    it("returns {0, 0, 30, 0} for 30 minutes remaining", () => {
      const now = 1000;
      const target = now + 30 * 60_000; // 30 minutes
      expect(computeCountdown(target, now)).toEqual({ days: 0, hours: 0, minutes: 30, seconds: 0 });
    });

    it("returns {0, 23, 59, 0} for 23:59 remaining", () => {
      const now = 1000;
      const target = now + (23 * 3_600_000 + 59 * 60_000);
      expect(computeCountdown(target, now)).toEqual({ days: 0, hours: 23, minutes: 59, seconds: 0 });
    });

    it("returns {0, 0, 59, 0} for 59 minutes remaining", () => {
      const now = 1000;
      const target = now + 59 * 60_000;
      expect(computeCountdown(target, now)).toEqual({ days: 0, hours: 0, minutes: 59, seconds: 0 });
    });

    it("returns {0, 1, 0, 0} for exactly 1 hour remaining", () => {
      const now = 1000;
      const target = now + 3_600_000;
      expect(computeCountdown(target, now)).toEqual({ days: 0, hours: 1, minutes: 0, seconds: 0 });
    });
  });

  describe("single-day countdown (EC-3, days=0)", () => {
    it("returns {0, 0, 0, 0} for exactly 0 days remaining", () => {
      const now = 1000;
      const target = now + 1; // just 1ms
      expect(computeCountdown(target, now)).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    });

    it("returns {0, 12, 30, 0} for 12 hours 30 minutes", () => {
      const now = 1000;
      const target = now + 12 * 3_600_000 + 30 * 60_000;
      expect(computeCountdown(target, now)).toEqual({ days: 0, hours: 12, minutes: 30, seconds: 0 });
    });
  });

  describe("multi-day countdowns (EC-7, days>1)", () => {
    it("returns {1, 0, 0, 0} for exactly 1 day", () => {
      const now = 1000;
      const target = now + 86_400_000; // exactly 1 day
      expect(computeCountdown(target, now)).toEqual({ days: 1, hours: 0, minutes: 0, seconds: 0 });
    });

    it("returns {31, 0, 0, 0} for 31 days", () => {
      const now = 1000;
      const target = now + 31 * 86_400_000;
      expect(computeCountdown(target, now)).toEqual({ days: 31, hours: 0, minutes: 0, seconds: 0 });
    });

    it("returns {99, 23, 59, 0} for 99 days, 23 hours, 59 minutes", () => {
      const now = 1000;
      const target = now + (99 * 86_400_000 + 23 * 3_600_000 + 59 * 60_000);
      expect(computeCountdown(target, now)).toEqual({ days: 99, hours: 23, minutes: 59, seconds: 0 });
    });

    it("returns {2, 10, 30, 0} for 2 days, 10 hours, 30 minutes", () => {
      const now = 1000;
      const target = now + (2 * 86_400_000 + 10 * 3_600_000 + 30 * 60_000);
      expect(computeCountdown(target, now)).toEqual({ days: 2, hours: 10, minutes: 30, seconds: 0 });
    });

    it("returns {5, 0, 0, 0} for exactly 5 days", () => {
      const now = 1000;
      const target = now + 5 * 86_400_000;
      expect(computeCountdown(target, now)).toEqual({ days: 5, hours: 0, minutes: 0, seconds: 0 });
    });
  });

  describe("hours wrapping (% 24, EC-4)", () => {
    it("hours % 24 = 0 for exactly 1 day (24 hours wraps to 0)", () => {
      const now = 1000;
      const target = now + 86_400_000; // 1 day = 24 hours, % 24 = 0
      const result = computeCountdown(target, now);
      expect(result.hours).toBe(0);
    });

    it("hours % 24 = 0 for 2 days (48 hours wraps to 0)", () => {
      const now = 1000;
      const target = now + 2 * 86_400_000;
      const result = computeCountdown(target, now);
      expect(result.hours).toBe(0);
    });

    it("hours % 24 = 1 for 1 day + 1 hour", () => {
      const now = 1000;
      const target = now + 86_400_000 + 3_600_000;
      const result = computeCountdown(target, now);
      expect(result.hours).toBe(1);
    });

    it("hours % 24 = 23 for 1 day + 23 hours", () => {
      const now = 1000;
      const target = now + 86_400_000 + 23 * 3_600_000;
      const result = computeCountdown(target, now);
      expect(result.hours).toBe(23);
    });

    it("hours % 24 = 12 for 2 days + 12 hours", () => {
      const now = 1000;
      const target = now + 2 * 86_400_000 + 12 * 3_600_000;
      const result = computeCountdown(target, now);
      expect(result.hours).toBe(12);
    });
  });

  describe("minutes wrapping (% 60, EC-5)", () => {
    it("minutes % 60 = 0 for exactly 1 hour", () => {
      const now = 1000;
      const target = now + 3_600_000; // 1 hour = 60 minutes, % 60 = 0
      const result = computeCountdown(target, now);
      expect(result.minutes).toBe(0);
    });

    it("minutes % 60 = 0 for 2 hours", () => {
      const now = 1000;
      const target = now + 2 * 3_600_000;
      const result = computeCountdown(target, now);
      expect(result.minutes).toBe(0);
    });

    it("minutes % 60 = 1 for 1 hour + 1 minute", () => {
      const now = 1000;
      const target = now + 3_600_000 + 60_000;
      const result = computeCountdown(target, now);
      expect(result.minutes).toBe(1);
    });

    it("minutes % 60 = 59 for 1 hour + 59 minutes", () => {
      const now = 1000;
      const target = now + 3_600_000 + 59 * 60_000;
      const result = computeCountdown(target, now);
      expect(result.minutes).toBe(59);
    });

    it("minutes % 60 = 30 for 1 hour + 30 minutes", () => {
      const now = 1000;
      const target = now + 3_600_000 + 30 * 60_000;
      const result = computeCountdown(target, now);
      expect(result.minutes).toBe(30);
    });
  });

  describe("combined multi-unit examples", () => {
    it("returns {0, 5, 30, 0} for 5 hours 30 minutes", () => {
      const now = 1000;
      const target = now + 5 * 3_600_000 + 30 * 60_000;
      expect(computeCountdown(target, now)).toEqual({ days: 0, hours: 5, minutes: 30, seconds: 0 });
    });

    it("returns {7, 15, 45, 0} for 7 days 15 hours 45 minutes", () => {
      const now = 1000;
      const target = now + (7 * 86_400_000 + 15 * 3_600_000 + 45 * 60_000);
      expect(computeCountdown(target, now)).toEqual({ days: 7, hours: 15, minutes: 45, seconds: 0 });
    });

    it("returns {10, 0, 1, 0} for 10 days and 1 minute", () => {
      const now = 1000;
      const target = now + 10 * 86_400_000 + 60_000;
      expect(computeCountdown(target, now)).toEqual({ days: 10, hours: 0, minutes: 1, seconds: 0 });
    });

    it("returns {1, 23, 59, 0} for 1 day 23 hours 59 minutes", () => {
      const now = 1000;
      const target = now + 86_400_000 + 23 * 3_600_000 + 59 * 60_000;
      expect(computeCountdown(target, now)).toEqual({ days: 1, hours: 23, minutes: 59, seconds: 0 });
    });
  });

  describe("boundary cases and truncation (floor behavior)", () => {
    it("truncates (floors) milliseconds within a minute", () => {
      const now = 1000;
      const target = now + 5 * 60_000 + 30_000; // 5.5 minutes → floor to 5
      const result = computeCountdown(target, now);
      expect(result.minutes).toBe(5);
    });

    it("truncates milliseconds within an hour", () => {
      const now = 1000;
      const target = now + 2 * 3_600_000 + 30_000; // 2 hours + 30 sec → hours = 2
      const result = computeCountdown(target, now);
      expect(result.hours).toBe(2);
    });

    it("truncates milliseconds within a day", () => {
      const now = 1000;
      const target = now + 3 * 86_400_000 + 30_000; // 3 days + 30 sec → days = 3
      const result = computeCountdown(target, now);
      expect(result.days).toBe(3);
    });

    it("handles 59 minutes 59 seconds (floors to 59 minutes)", () => {
      const now = 1000;
      const target = now + 59 * 60_000 + 59_000;
      const result = computeCountdown(target, now);
      expect(result.minutes).toBe(59);
    });
  });

  describe("result type validation", () => {
    it("always returns a CountdownResult object with days, hours, minutes, seconds", () => {
      const result = computeCountdown(100_000, 1000);
      expect(typeof result).toBe("object");
      expect("days" in result).toBe(true);
      expect("hours" in result).toBe(true);
      expect("minutes" in result).toBe(true);
      expect("seconds" in result).toBe(true);
    });

    it("returned values are always numbers", () => {
      const result = computeCountdown(500_000, 1000);
      expect(typeof result.days).toBe("number");
      expect(typeof result.hours).toBe("number");
      expect(typeof result.minutes).toBe("number");
      expect(typeof result.seconds).toBe("number");
    });

    it("returned values are always non-negative", () => {
      const result = computeCountdown(86_400_000 + 3_600_000 + 60_000, 1000);
      expect(result.days).toBeGreaterThanOrEqual(0);
      expect(result.hours).toBeGreaterThanOrEqual(0);
      expect(result.minutes).toBeGreaterThanOrEqual(0);
      expect(result.seconds).toBeGreaterThanOrEqual(0);
    });

    it("hours are always 0–23", () => {
      const result = computeCountdown(500_000_000, 1000);
      expect(result.hours).toBeGreaterThanOrEqual(0);
      expect(result.hours).toBeLessThanOrEqual(23);
    });

    it("minutes are always 0–59", () => {
      const result = computeCountdown(500_000_000, 1000);
      expect(result.minutes).toBeGreaterThanOrEqual(0);
      expect(result.minutes).toBeLessThanOrEqual(59);
    });

    it("seconds are always 0–59", () => {
      const result = computeCountdown(500_000_000, 1000);
      expect(result.seconds).toBeGreaterThanOrEqual(0);
      expect(result.seconds).toBeLessThanOrEqual(59);
    });
  });

  describe("seconds regression coverage (new field)", () => {
    it("correctly computes seconds for sub-minute remainder", () => {
      // diff = 90_500ms → minutes = 1, seconds = floor(90_500/1000) % 60 = 90 % 60 = 30
      const now = 1000;
      const target = now + 90_500;
      const result = computeCountdown(target, now);
      expect(result.minutes).toBe(1);
      expect(result.seconds).toBe(30);
    });

    it("returns 59 seconds for 59 second remainder", () => {
      // diff = 59_000ms → seconds = floor(59_000/1000) % 60 = 59 % 60 = 59
      const now = 1000;
      const target = now + 59_000;
      const result = computeCountdown(target, now);
      expect(result.minutes).toBe(0);
      expect(result.seconds).toBe(59);
    });

    it("wraps seconds to 0 at exact minute boundary", () => {
      // diff = 60_000ms → minutes = 1, seconds = floor(60_000/1000) % 60 = 60 % 60 = 0
      const now = 1000;
      const target = now + 60_000;
      const result = computeCountdown(target, now);
      expect(result.minutes).toBe(1);
      expect(result.seconds).toBe(0);
    });

    it("returns seconds 1 for 1 second remainder", () => {
      // diff = 1_000ms → seconds = floor(1_000/1000) % 60 = 1 % 60 = 1
      const now = 1000;
      const target = now + 1_000;
      const result = computeCountdown(target, now);
      expect(result.minutes).toBe(0);
      expect(result.seconds).toBe(1);
    });

    it("returns 0 seconds when diff <= 0", () => {
      // diff = 0 (or negative) → {0,0,0,0}
      const target = 1000;
      const now = 1000;
      const result = computeCountdown(target, now);
      expect(result.seconds).toBe(0);
    });

    it("combined: 2 days 5 hours 45 minutes 30 seconds", () => {
      // diff = 2*86_400_000 + 5*3_600_000 + 45*60_000 + 30_000
      const now = 1000;
      const target = now + (2 * 86_400_000 + 5 * 3_600_000 + 45 * 60_000 + 30_000);
      const result = computeCountdown(target, now);
      expect(result.days).toBe(2);
      expect(result.hours).toBe(5);
      expect(result.minutes).toBe(45);
      expect(result.seconds).toBe(30);
    });
  });

  describe("large countdown values (stress test)", () => {
    it("handles 365 days", () => {
      const now = 1000;
      const target = now + 365 * 86_400_000;
      const result = computeCountdown(target, now);
      expect(result.days).toBe(365);
      expect(result.hours).toBe(0);
      expect(result.minutes).toBe(0);
    });

    it("handles 999 days (large multi-day)", () => {
      const now = 1000;
      const target = now + 999 * 86_400_000;
      const result = computeCountdown(target, now);
      expect(result.days).toBe(999);
    });
  });
});

describe("Integration: computeCountdown → pad2 (display pipeline)", () => {
  const displayCountdown = (targetMs: number, nowMs: number) => {
    const result = computeCountdown(targetMs, nowMs);
    return {
      days: pad2(result.days),
      hours: pad2(result.hours),
      minutes: pad2(result.minutes),
      seconds: pad2(result.seconds),
    };
  };

  describe("EC-2: single-digit padding", () => {
    it("displays 0 minutes as '00'", () => {
      const now = 1000;
      const target = now + 3_600_000; // 1 hour
      const display = displayCountdown(target, now);
      expect(display.minutes).toBe("00");
    });

    it("displays 5 minutes as '05'", () => {
      const now = 1000;
      const target = now + 5 * 60_000;
      const display = displayCountdown(target, now);
      expect(display.minutes).toBe("05");
    });

    it("displays 9 hours as '09'", () => {
      const now = 1000;
      const target = now + 9 * 3_600_000;
      const display = displayCountdown(target, now);
      expect(display.hours).toBe("09");
    });
  });

  describe("EC-3: day display range", () => {
    it("displays 0 days as '00'", () => {
      const now = 1000;
      const target = now + 12 * 3_600_000; // < 1 day
      const display = displayCountdown(target, now);
      expect(display.days).toBe("00");
    });

    it("displays 9 days as '09'", () => {
      const now = 1000;
      const target = now + 9 * 86_400_000;
      const display = displayCountdown(target, now);
      expect(display.days).toBe("09");
    });

    it("displays 10 days as '10'", () => {
      const now = 1000;
      const target = now + 10 * 86_400_000;
      const display = displayCountdown(target, now);
      expect(display.days).toBe("10");
    });

    it("displays 31 days as '31'", () => {
      const now = 1000;
      const target = now + 31 * 86_400_000;
      const display = displayCountdown(target, now);
      expect(display.days).toBe("31");
    });
  });

  describe("EC-4: hours over-range clamped to 00", () => {
    it("countdown with invalid hours gets clamped by pad2 to '00'", () => {
      // Manually construct an invalid scenario by testing pad2 on bad input
      // (computeCountdown always returns 0–23 hours)
      const display = pad2(-1);
      expect(display).toBe("00");
    });

    it("displays valid hours 0–23 correctly", () => {
      for (let h = 0; h <= 23; h++) {
        const display = pad2(h);
        expect(display).toBeTruthy();
        expect(display).toMatch(/^\d{2}$/);
      }
    });
  });

  describe("EC-5: minutes over-range clamped to 00", () => {
    it("countdown with invalid minutes gets clamped by pad2 to '00'", () => {
      // (computeCountdown always returns 0–59 minutes)
      const display = pad2(-1);
      expect(display).toBe("00");
    });

    it("displays valid minutes 0–59 correctly", () => {
      for (let m = 0; m <= 59; m++) {
        const display = pad2(m);
        expect(display).toBeTruthy();
        expect(display).toMatch(/^\d{2}$/);
      }
    });
  });

  describe("EC-6: sub-day countdown (days=0)", () => {
    it("displays countdown < 1 day with days='00'", () => {
      const now = 1000;
      const target = now + (23 * 3_600_000 + 59 * 60_000); // < 1 day
      const display = displayCountdown(target, now);
      expect(display.days).toBe("00");
    });
  });

  describe("EC-8: zero or negative countdown frozen at 00:00:00", () => {
    it("displays {0, 0, 0, 0} when countdown is exactly 0", () => {
      const now = 1000;
      const display = displayCountdown(now, now);
      expect(display).toEqual({ days: "00", hours: "00", minutes: "00", seconds: "00" });
    });

    it("displays {0, 0, 0, 0} when countdown is negative", () => {
      const now = 1000;
      const target = 500; // target < now
      const display = displayCountdown(target, now);
      expect(display).toEqual({ days: "00", hours: "00", minutes: "00", seconds: "00" });
    });
  });

  describe("EC-7: multi-day countdown updates (simulation)", () => {
    it("displays 2 days 10 hours 30 minutes as '02', '10', '30', '00'", () => {
      const now = 1000;
      const target = now + (2 * 86_400_000 + 10 * 3_600_000 + 30 * 60_000);
      const display = displayCountdown(target, now);
      expect(display).toEqual({ days: "02", hours: "10", minutes: "30", seconds: "00" });
    });

    it("displays decreasing countdown (simulated by passing different now times)", () => {
      const target = 1000 + 86_400_000 * 2 + 3_600_000 * 10 + 60_000 * 30; // fixed target
      const now1 = 1000;
      const now2 = now1 + 3_600_000; // advance by 1 hour

      const display1 = displayCountdown(target, now1);
      const display2 = displayCountdown(target, now2);

      // After 1 hour, remaining time should decrease
      // display1: 2d 10h 30m = 2*1440 + 10*60 + 30 = 2880 + 600 + 30 = 3510 minutes
      // display2: 2d 9h 30m = 2*1440 + 9*60 + 30 = 2880 + 540 + 30 = 3450 minutes
      expect(display1.hours).toBe("10");
      expect(display2.hours).toBe("09");
    });
  });

  describe("representative GUI test cases", () => {
    it("displays 0:00:00:00 when countdown is expired", () => {
      const display = displayCountdown(1000, 1000);
      expect(display).toEqual({ days: "00", hours: "00", minutes: "00", seconds: "00" });
    });

    it("displays 00:23:59:00 for 23 hours 59 minutes", () => {
      const now = 1000;
      const target = now + (23 * 3_600_000 + 59 * 60_000);
      const display = displayCountdown(target, now);
      expect(display).toEqual({ days: "00", hours: "23", minutes: "59", seconds: "00" });
    });

    it("displays 01:00:00:00 for 1 day", () => {
      const now = 1000;
      const target = now + 86_400_000;
      const display = displayCountdown(target, now);
      expect(display).toEqual({ days: "01", hours: "00", minutes: "00", seconds: "00" });
    });

    it("displays 31:00:00:00 for 31 days (max typical month)", () => {
      const now = 1000;
      const target = now + 31 * 86_400_000;
      const display = displayCountdown(target, now);
      expect(display).toEqual({ days: "31", hours: "00", minutes: "00", seconds: "00" });
    });
  });
});
