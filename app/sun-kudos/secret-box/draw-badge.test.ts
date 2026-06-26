// F011 — Test suite for drawBadge pure function.
// Validates band mapping, boundary precision, clamping, and asset paths.

import { describe, it, expect } from "vitest";
import { drawBadge, BADGE_TABLE } from "./draw-badge";

describe("drawBadge - pure reward mapping", () => {
  describe("BADGE_TABLE structure", () => {
    it("has 6 entries", () => {
      expect(BADGE_TABLE).toHaveLength(6);
    });

    it("cumulative weights sum to 1.0", () => {
      const lastCumulative = BADGE_TABLE[BADGE_TABLE.length - 1].cumulative;
      expect(lastCumulative).toBe(1.0);
    });

    it("cumulative weights are in ascending order", () => {
      for (let i = 0; i < BADGE_TABLE.length - 1; i++) {
        expect(BADGE_TABLE[i].cumulative).toBeLessThan(
          BADGE_TABLE[i + 1].cumulative
        );
      }
    });

    it("all rewards have id, name, and image", () => {
      for (const entry of BADGE_TABLE) {
        const reward = entry.reward;
        expect(reward.id).toBeTruthy();
        expect(typeof reward.id).toBe("string");
        expect(reward.name).toBeTruthy();
        expect(typeof reward.name).toBe("string");
        expect(reward.image).toBeTruthy();
        expect(typeof reward.image).toBe("string");
      }
    });

    it("all image paths point to /saa-2025/badge-*.png", () => {
      for (const entry of BADGE_TABLE) {
        const image = entry.reward.image;
        expect(image).toMatch(/^\/saa-2025\/badge-\w+(-\w+)*\.png$/);
      }
    });
  });

  describe("band mapping — Stay Gold (0.30)", () => {
    it("roll=0.0 → Stay Gold", () => {
      const result = drawBadge(0.0);
      expect(result.id).toBe("stay-gold");
      expect(result.name).toBe("Stay Gold");
    });

    it("roll=0.15 (interior) → Stay Gold", () => {
      const result = drawBadge(0.15);
      expect(result.id).toBe("stay-gold");
    });

    it("roll=0.29999 (just before boundary) → Stay Gold", () => {
      const result = drawBadge(0.29999);
      expect(result.id).toBe("stay-gold");
    });

    it("roll=0.30 (exact boundary, exclusive) → Flow to Horizon", () => {
      const result = drawBadge(0.30);
      expect(result.id).toBe("flow-to-horizon");
    });
  });

  describe("band mapping — Flow to Horizon (0.30..0.55)", () => {
    it("roll=0.30 (inclusive boundary) → Flow to Horizon", () => {
      const result = drawBadge(0.30);
      expect(result.id).toBe("flow-to-horizon");
    });

    it("roll=0.42 (interior) → Flow to Horizon", () => {
      const result = drawBadge(0.42);
      expect(result.id).toBe("flow-to-horizon");
    });

    it("roll=0.54999 (just before boundary) → Flow to Horizon", () => {
      const result = drawBadge(0.54999);
      expect(result.id).toBe("flow-to-horizon");
    });

    it("roll=0.55 (exact boundary, exclusive) → Touch of Light", () => {
      const result = drawBadge(0.55);
      expect(result.id).toBe("touch-of-light");
    });
  });

  describe("band mapping — Touch of Light (0.55..0.75)", () => {
    it("roll=0.55 (inclusive boundary) → Touch of Light", () => {
      const result = drawBadge(0.55);
      expect(result.id).toBe("touch-of-light");
    });

    it("roll=0.65 (interior) → Touch of Light", () => {
      const result = drawBadge(0.65);
      expect(result.id).toBe("touch-of-light");
    });

    it("roll=0.74999 (just before boundary) → Touch of Light", () => {
      const result = drawBadge(0.74999);
      expect(result.id).toBe("touch-of-light");
    });

    it("roll=0.75 (exact boundary, exclusive) → Beyond the Boundary", () => {
      const result = drawBadge(0.75);
      expect(result.id).toBe("beyond-the-boundary");
    });
  });

  describe("band mapping — Beyond the Boundary (0.75..0.85)", () => {
    it("roll=0.75 (inclusive boundary) → Beyond the Boundary", () => {
      const result = drawBadge(0.75);
      expect(result.id).toBe("beyond-the-boundary");
    });

    it("roll=0.80 (interior) → Beyond the Boundary", () => {
      const result = drawBadge(0.80);
      expect(result.id).toBe("beyond-the-boundary");
    });

    it("roll=0.84999 (just before boundary) → Beyond the Boundary", () => {
      const result = drawBadge(0.84999);
      expect(result.id).toBe("beyond-the-boundary");
    });

    it("roll=0.85 (exact boundary, exclusive) → Revival", () => {
      const result = drawBadge(0.85);
      expect(result.id).toBe("revival");
    });
  });

  describe("band mapping — Revival (0.85..0.95)", () => {
    it("roll=0.85 (inclusive boundary) → Revival", () => {
      const result = drawBadge(0.85);
      expect(result.id).toBe("revival");
    });

    it("roll=0.90 (interior) → Revival", () => {
      const result = drawBadge(0.90);
      expect(result.id).toBe("revival");
    });

    it("roll=0.94999 (just before boundary) → Revival", () => {
      const result = drawBadge(0.94999);
      expect(result.id).toBe("revival");
    });

    it("roll=0.95 (exact boundary, exclusive) → Root Further", () => {
      const result = drawBadge(0.95);
      expect(result.id).toBe("root-further");
    });
  });

  describe("band mapping — Root Further (0.95..1.0)", () => {
    it("roll=0.95 (inclusive boundary) → Root Further", () => {
      const result = drawBadge(0.95);
      expect(result.id).toBe("root-further");
    });

    it("roll=0.975 (interior) → Root Further", () => {
      const result = drawBadge(0.975);
      expect(result.id).toBe("root-further");
    });

    it("roll=0.9999999 (clamped maximum) → Root Further", () => {
      const result = drawBadge(0.9999999);
      expect(result.id).toBe("root-further");
    });
  });

  describe("out-of-range clamping", () => {
    it("negative roll clamped to 0 → Stay Gold", () => {
      const result = drawBadge(-0.5);
      expect(result.id).toBe("stay-gold");
    });

    it("roll=NaN fails all comparisons, falls through to Root Further", () => {
      // NaN comparisons always return false; the loop never matches,
      // so it hits the fallback (last badge).
      const result = drawBadge(NaN);
      expect(result.id).toBe("root-further");
    });

    it("very large roll (>1) clamped to 0.9999999 → Root Further", () => {
      const result = drawBadge(100);
      expect(result.id).toBe("root-further");
    });

    it("roll exactly at 1.0 stays Root Further after clamp", () => {
      const result = drawBadge(1.0);
      expect(result.id).toBe("root-further");
    });
  });

  describe("return type validation", () => {
    it("always returns a BadgeReward object with correct shape", () => {
      const result = drawBadge(0.5);
      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("name");
      expect(result).toHaveProperty("image");
    });

    it("returned reward never has undefined fields", () => {
      const testRolls = [0, 0.15, 0.3, 0.55, 0.75, 0.85, 0.95, 1.0, -1];
      for (const roll of testRolls) {
        const result = drawBadge(roll);
        expect(result.id).toBeDefined();
        expect(result.name).toBeDefined();
        expect(result.image).toBeDefined();
      }
      // NaN also returns a valid reward (fallback).
      const nanResult = drawBadge(NaN);
      expect(nanResult.id).toBeDefined();
      expect(nanResult.name).toBeDefined();
      expect(nanResult.image).toBeDefined();
    });
  });

  describe("determinism", () => {
    it("same roll always produces same reward", () => {
      const roll = 0.42;
      const result1 = drawBadge(roll);
      const result2 = drawBadge(roll);
      expect(result1).toEqual(result2);
    });

    it("all rewards in table are returned for their band rolls", () => {
      const expectedIds = [
        "stay-gold",
        "flow-to-horizon",
        "touch-of-light",
        "beyond-the-boundary",
        "revival",
        "root-further",
      ];
      const foundIds = new Set<string>();

      // Sample from each band.
      const sampleRolls = [
        0.15, 0.42, 0.65, 0.80, 0.90, 0.97,
      ];
      for (const roll of sampleRolls) {
        const result = drawBadge(roll);
        foundIds.add(result.id);
      }

      for (const id of expectedIds) {
        expect(foundIds.has(id)).toBe(true);
      }
    });
  });
});
