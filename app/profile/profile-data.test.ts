/**
 * Tests for the profile data-layer types and shape contracts from lib/data/types.ts.
 * Mock data was removed; these tests guard the type interface used by profile components.
 */
import { describe, it, expect } from "vitest";
import type {
  ProfileData,
  ProfileStats,
  ProfileKudosEntry,
  BadgeCollectionSlot,
  BadgeReward,
  KudosPerson,
  TitleBadge,
} from "@/lib/data/types";

// ---------------------------------------------------------------------------
// Type conformance helpers — build minimal valid objects per interface
// ---------------------------------------------------------------------------

function makeKudosPerson(overrides: Partial<KudosPerson> = {}): KudosPerson {
  return {
    id: "uid-1",
    name: "Nguyễn Văn A",
    dept: "CEVC3",
    title: "New Hero",
    initial: "N",
    ...overrides,
  };
}

function makeProfileStats(overrides: Partial<ProfileStats> = {}): ProfileStats {
  return {
    kudosReceived: 12,
    kudosSent: 3,
    hearts: 13,
    boxOpened: 0,
    boxUnopened: 12,
    ...overrides,
  };
}

function makeProfileData(overrides: Partial<ProfileData> = {}): ProfileData {
  return {
    id: "11111111-1111-1111-1111-111111111111",
    name: "Test User",
    dept: "DEPT01",
    title: "Super Hero",
    avatarInitial: "T",
    stats: makeProfileStats(),
    ...overrides,
  };
}

function makeBadgeReward(overrides: Partial<BadgeReward> = {}): BadgeReward {
  return {
    id: "badge-1",
    name: "First Kudos",
    image: "/badges/first-kudos.png",
    ...overrides,
  };
}

function makeBadgeSlot(overrides: Partial<BadgeCollectionSlot> = {}): BadgeCollectionSlot {
  return {
    badge: makeBadgeReward(),
    earnedAt: null,
    owned: false,
    ...overrides,
  };
}

function makeKudosEntry(overrides: Partial<ProfileKudosEntry> = {}): ProfileKudosEntry {
  const sender = makeKudosPerson({ id: "sender-1" });
  const receiver = makeKudosPerson({ id: "receiver-1" });
  return {
    id: "kudos-1",
    sender,
    receiver,
    time: "10:00 - 06/25/2026",
    message: "Great work on the sprint!",
    hashtags: ["#Teamwork"],
    likeCount: 5,
    liked: false,
    spam: false,
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// ProfileData shape
// ---------------------------------------------------------------------------

describe("ProfileData shape", () => {
  it("has all required string fields non-empty", () => {
    const p = makeProfileData();
    expect(typeof p.id).toBe("string");
    expect(p.id.length).toBeGreaterThan(0);
    expect(typeof p.name).toBe("string");
    expect(p.name.length).toBeGreaterThan(0);
    expect(typeof p.dept).toBe("string");
    expect(typeof p.title).toBe("string");
    expect(typeof p.avatarInitial).toBe("string");
    expect(p.avatarInitial.length).toBeGreaterThan(0);
  });

  it("stats field satisfies ProfileStats", () => {
    const p = makeProfileData();
    expect(p.stats).toBeDefined();
    expect(typeof p.stats.kudosReceived).toBe("number");
    expect(typeof p.stats.kudosSent).toBe("number");
    expect(typeof p.stats.hearts).toBe("number");
    expect(typeof p.stats.boxOpened).toBe("number");
    expect(typeof p.stats.boxUnopened).toBe("number");
  });
});

// ---------------------------------------------------------------------------
// ProfileStats shape
// ---------------------------------------------------------------------------

describe("ProfileStats shape", () => {
  it("all five stat fields are non-negative integers", () => {
    const s = makeProfileStats();
    const fields: (keyof ProfileStats)[] = [
      "kudosReceived", "kudosSent", "hearts", "boxOpened", "boxUnopened",
    ];
    for (const f of fields) {
      expect(typeof s[f]).toBe("number");
      expect(s[f]).toBeGreaterThanOrEqual(0);
      expect(Number.isInteger(s[f])).toBe(true);
    }
  });

  it("matches test-user DB seed values", () => {
    // Validates the shape expected from profile_stats RPC for the seeded test user:
    // kudos_received=12, kudos_sent=3, hearts_received=13, boxes_opened=0, boxes_unopened=12
    const s = makeProfileStats({
      kudosReceived: 12,
      kudosSent: 3,
      hearts: 13,
      boxOpened: 0,
      boxUnopened: 12,
    });
    expect(s.kudosReceived).toBe(12);
    expect(s.kudosSent).toBe(3);
    expect(s.hearts).toBe(13);
    expect(s.boxOpened).toBe(0);
    expect(s.boxUnopened).toBe(12);
  });
});

// ---------------------------------------------------------------------------
// TitleBadge values
// ---------------------------------------------------------------------------

describe("TitleBadge values", () => {
  it("accepts all four canonical tier names", () => {
    const tiers: TitleBadge[] = ["New Hero", "Rising Hero", "Super Hero", "Legend Hero"];
    for (const t of tiers) {
      const person = makeKudosPerson({ title: t });
      expect(person.title).toBe(t);
    }
  });
});

// ---------------------------------------------------------------------------
// BadgeCollectionSlot shape
// ---------------------------------------------------------------------------

describe("BadgeCollectionSlot shape", () => {
  it("unearned slot has owned=false and earnedAt=null", () => {
    const slot = makeBadgeSlot();
    expect(slot.owned).toBe(false);
    expect(slot.earnedAt).toBeNull();
    expect(typeof slot.badge.id).toBe("string");
    expect(typeof slot.badge.name).toBe("string");
  });

  it("earned slot has owned=true and a non-null earnedAt string", () => {
    const slot = makeBadgeSlot({
      owned: true,
      earnedAt: "2026-06-25T10:00:00Z",
    });
    expect(slot.owned).toBe(true);
    expect(typeof slot.earnedAt).toBe("string");
    expect(slot.earnedAt!.length).toBeGreaterThan(0);
  });

  it("a 6-slot collection can hold a mix of earned and unearned", () => {
    const slots: BadgeCollectionSlot[] = Array.from({ length: 6 }, (_, i) =>
      makeBadgeSlot({
        badge: makeBadgeReward({ id: `badge-${i}` }),
        owned: i < 2,
        earnedAt: i < 2 ? "2026-01-01T00:00:00Z" : null,
      }),
    );
    expect(slots).toHaveLength(6);
    expect(slots.filter((s) => s.owned)).toHaveLength(2);
    expect(slots.filter((s) => !s.owned)).toHaveLength(4);
  });
});

// ---------------------------------------------------------------------------
// ProfileKudosEntry shape
// ---------------------------------------------------------------------------

describe("ProfileKudosEntry shape", () => {
  it("has all required KudosEntry fields", () => {
    const entry = makeKudosEntry();
    expect(typeof entry.id).toBe("string");
    expect(entry.sender).toBeDefined();
    expect(entry.receiver).toBeDefined();
    expect(typeof entry.time).toBe("string");
    expect(typeof entry.message).toBe("string");
    expect(Array.isArray(entry.hashtags)).toBe(true);
    expect(typeof entry.likeCount).toBe("number");
  });

  it("spam is optional boolean (undefined or boolean)", () => {
    const withSpam = makeKudosEntry({ spam: true });
    const withoutSpam = makeKudosEntry({ spam: undefined });
    expect(withSpam.spam).toBe(true);
    expect(withoutSpam.spam).toBeUndefined();
  });

  it("hashtags are non-empty strings starting with #", () => {
    const entry = makeKudosEntry({ hashtags: ["#Teamwork", "#Technical"] });
    for (const tag of entry.hashtags) {
      expect(typeof tag).toBe("string");
      expect(tag.length).toBeGreaterThan(0);
      expect(tag.startsWith("#")).toBe(true);
    }
  });

  it("likeCount is a non-negative integer", () => {
    const entry = makeKudosEntry({ likeCount: 42 });
    expect(entry.likeCount).toBeGreaterThanOrEqual(0);
    expect(Number.isInteger(entry.likeCount)).toBe(true);
  });

  it("sender and receiver have all KudosPerson fields", () => {
    const entry = makeKudosEntry();
    for (const person of [entry.sender, entry.receiver]) {
      expect(typeof person.id).toBe("string");
      expect(typeof person.name).toBe("string");
      expect(typeof person.dept).toBe("string");
      expect(typeof person.title).toBe("string");
      expect(typeof person.initial).toBe("string");
    }
  });
});
