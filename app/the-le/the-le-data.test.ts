import { describe, it, expect } from "vitest";
import {
  HERO_TIERS,
  COLLECTIBLE_BADGES,
  SECTION_COPY,
  type HeroTier,
  type CollectibleBadge,
} from "./the-le-data";

describe("the-le-data", () => {
  describe("HERO_TIERS", () => {
    it("exports exactly 4 hero tiers", () => {
      expect(HERO_TIERS).toHaveLength(4);
    });

    it("each tier has required fields: name, countLabel, description", () => {
      HERO_TIERS.forEach((tier) => {
        expect(tier).toHaveProperty("name");
        expect(tier).toHaveProperty("countLabel");
        expect(tier).toHaveProperty("description");
        expect(typeof tier.name).toBe("string");
        expect(typeof tier.countLabel).toBe("string");
        expect(typeof tier.description).toBe("string");
      });
    });

    it("all tier fields are non-empty strings", () => {
      HERO_TIERS.forEach((tier) => {
        expect(tier.name.length).toBeGreaterThan(0);
        expect(tier.countLabel.length).toBeGreaterThan(0);
        expect(tier.description.length).toBeGreaterThan(0);
      });
    });

    it("tiers follow expected names in order", () => {
      const names = HERO_TIERS.map((t) => t.name);
      expect(names).toEqual(["New Hero", "Rising Hero", "Super Hero", "Legend Hero"]);
    });
  });

  describe("COLLECTIBLE_BADGES", () => {
    it("exports exactly 6 collectible badges", () => {
      expect(COLLECTIBLE_BADGES).toHaveLength(6);
    });

    it("each badge has required fields: name, imagePath", () => {
      COLLECTIBLE_BADGES.forEach((badge) => {
        expect(badge).toHaveProperty("name");
        expect(badge).toHaveProperty("imagePath");
        expect(typeof badge.name).toBe("string");
        expect(typeof badge.imagePath).toBe("string");
      });
    });

    it("all badge fields are non-empty strings", () => {
      COLLECTIBLE_BADGES.forEach((badge) => {
        expect(badge.name.length).toBeGreaterThan(0);
        expect(badge.imagePath.length).toBeGreaterThan(0);
      });
    });

    it("all badge image paths reference /saa-2025/ directory", () => {
      COLLECTIBLE_BADGES.forEach((badge) => {
        expect(badge.imagePath).toMatch(/^\/saa-2025\//);
      });
    });

    it("all badge image paths end with .png", () => {
      COLLECTIBLE_BADGES.forEach((badge) => {
        expect(badge.imagePath).toMatch(/\.png$/);
      });
    });

    it("badges follow expected names in order", () => {
      const names = COLLECTIBLE_BADGES.map((b) => b.name);
      expect(names).toEqual([
        "REVIVAL",
        "TOUCH OF LIGHT",
        "STAY GOLD",
        "FLOW TO HORIZON",
        "BEYOND THE BOUNDARY",
        "ROOT FUTHER",
      ]);
    });
  });

  describe("SECTION_COPY", () => {
    it("exports all required section copy keys", () => {
      expect(SECTION_COPY).toHaveProperty("section1Title");
      expect(SECTION_COPY).toHaveProperty("section1Desc");
      expect(SECTION_COPY).toHaveProperty("section2Title");
      expect(SECTION_COPY).toHaveProperty("section2Desc");
      expect(SECTION_COPY).toHaveProperty("section2Footer");
      expect(SECTION_COPY).toHaveProperty("section3Title");
      expect(SECTION_COPY).toHaveProperty("section3Desc");
    });

    it("all copy values are non-empty strings", () => {
      Object.values(SECTION_COPY).forEach((value) => {
        expect(typeof value).toBe("string");
        expect(value.length).toBeGreaterThan(0);
      });
    });

    it("section 1 copy is in Vietnamese (contains 'HUY HIỆU')", () => {
      expect(SECTION_COPY.section1Title).toMatch(/HUY HIỆU/);
    });

    it("section 2 copy is in Vietnamese (contains 'SƯU TẬP')", () => {
      expect(SECTION_COPY.section2Title).toMatch(/SƯU TẬP/);
    });

    it("section 3 copy is in Vietnamese (contains 'KUDOS QUỐC DÂN')", () => {
      expect(SECTION_COPY.section3Title).toMatch(/KUDOS QUỐC DÂN/);
    });
  });

  describe("type contracts", () => {
    it("HeroTier matches interface definition", () => {
      const tier: HeroTier = HERO_TIERS[0];
      expect(tier.name).toBeDefined();
      expect(tier.countLabel).toBeDefined();
      expect(tier.description).toBeDefined();
    });

    it("CollectibleBadge matches interface definition", () => {
      const badge: CollectibleBadge = COLLECTIBLE_BADGES[0];
      expect(badge.name).toBeDefined();
      expect(badge.imagePath).toBeDefined();
    });
  });
});
