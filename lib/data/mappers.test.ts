/**
 * Unit tests for lib/data/mappers.ts — pure functions only, no DB.
 */

import { describe, it, expect } from "vitest";
import {
  heroTierName,
  castTitleBadge,
  formatKudosTime,
  mapProfileToKudosPerson,
  mapAnonymousSender,
  mapKudosRow,
  mapAward,
  mapBadge,
  mapProfileStats,
  type KudosRowWithJoins,
} from "./mappers";
import type { Database } from "@/lib/supabase/database.types";

type HeroTierRow = Database["public"]["Tables"]["hero_tiers"]["Row"];
type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const TIERS: HeroTierRow[] = [
  { id: 1, name: "New Hero",    min_received: 1,  max_received: 4,    color: "#A8D8A8" },
  { id: 2, name: "Rising Hero", min_received: 5,  max_received: 9,    color: "#FFD700" },
  { id: 3, name: "Super Hero",  min_received: 10, max_received: 20,   color: "#FF6B35" },
  { id: 4, name: "Legend Hero", min_received: 21, max_received: null, color: "#C0392B" },
];

const PROFILE_A: ProfileRow = {
  id: "uid-a",
  full_name: "Nguyễn Văn A",
  dept_code: "CEVC10",
  avatar_initial: "N",
  email: "a@example.com",
  created_at: "2025-01-01T00:00:00Z",
};

const PROFILE_B: ProfileRow = {
  id: "uid-b",
  full_name: "Trần Thị B",
  dept_code: "HRD01",
  avatar_initial: "T",
  email: "b@example.com",
  created_at: "2025-01-01T00:00:00Z",
};

function makeKudosRow(overrides: Partial<KudosRowWithJoins> = {}): KudosRowWithJoins {
  return {
    id: "kudos-1",
    created_at: "2025-10-30T10:00:00.000Z",
    message: "Great work!",
    is_anonymous: false,
    anonymous_name: null,
    danh_hieu: null,
    sender: PROFILE_A,
    receiver: PROFILE_B,
    kudos_hashtags: [
      { hashtags: { tag: "Dedicated" } },
      { hashtags: { tag: "Inspiring" } },
    ],
    kudos_images: [],
    hearts: [{ user_id: "uid-x" }, { user_id: "uid-y" }],
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// heroTierName
// ---------------------------------------------------------------------------

describe("heroTierName", () => {
  it("returns New Hero for 1 received", () => {
    expect(heroTierName(1, TIERS)).toBe("New Hero");
  });

  it("returns New Hero for 4 received (upper boundary)", () => {
    expect(heroTierName(4, TIERS)).toBe("New Hero");
  });

  it("returns Rising Hero for 5 received (lower boundary)", () => {
    expect(heroTierName(5, TIERS)).toBe("Rising Hero");
  });

  it("returns Rising Hero for 9 received (upper boundary)", () => {
    expect(heroTierName(9, TIERS)).toBe("Rising Hero");
  });

  it("returns Super Hero for 10 received (lower boundary)", () => {
    expect(heroTierName(10, TIERS)).toBe("Super Hero");
  });

  it("returns Super Hero for 20 received (upper boundary)", () => {
    expect(heroTierName(20, TIERS)).toBe("Super Hero");
  });

  it("returns Legend Hero for 21 received (lower boundary)", () => {
    expect(heroTierName(21, TIERS)).toBe("Legend Hero");
  });

  it("returns Legend Hero for 100 received", () => {
    expect(heroTierName(100, TIERS)).toBe("Legend Hero");
  });

  it("returns fallback New Hero for 0 received (below all tiers)", () => {
    expect(heroTierName(0, TIERS)).toBe("New Hero");
  });

  it("returns fallback New Hero when tiers array is empty", () => {
    expect(heroTierName(10, [])).toBe("New Hero");
  });
});

// ---------------------------------------------------------------------------
// castTitleBadge
// ---------------------------------------------------------------------------

describe("castTitleBadge", () => {
  it("passes through all known tier values", () => {
    expect(castTitleBadge("New Hero")).toBe("New Hero");
    expect(castTitleBadge("Rising Hero")).toBe("Rising Hero");
    expect(castTitleBadge("Super Hero")).toBe("Super Hero");
    expect(castTitleBadge("Legend Hero")).toBe("Legend Hero");
  });

  it("falls back to New Hero for an unrecognised string", () => {
    expect(castTitleBadge("IDOL GIỚI TRẺ")).toBe("New Hero");
    expect(castTitleBadge("unknown")).toBe("New Hero");
  });
});

// ---------------------------------------------------------------------------
// formatKudosTime
// ---------------------------------------------------------------------------

describe("formatKudosTime", () => {
  it("formats ISO timestamp to HH:mm - MM/DD/YYYY using local time", () => {
    // Build a date we can predict: 2025-10-30 at local midnight+10h
    const d = new Date(2025, 9, 30, 10, 0, 0); // month is 0-indexed
    const result = formatKudosTime(d.toISOString());
    expect(result).toBe("10:00 - 10/30/2025");
  });

  it("zero-pads hours and minutes", () => {
    const d = new Date(2025, 0, 5, 9, 5, 0); // Jan 5 09:05
    const result = formatKudosTime(d.toISOString());
    expect(result).toBe("09:05 - 01/05/2025");
  });

  it("returns the original string when input is not a valid ISO date", () => {
    expect(formatKudosTime("not-a-date")).toBe("not-a-date");
  });
});

// ---------------------------------------------------------------------------
// mapProfileToKudosPerson
// ---------------------------------------------------------------------------

describe("mapProfileToKudosPerson", () => {
  it("maps all fields correctly", () => {
    const person = mapProfileToKudosPerson(PROFILE_A, TIERS, 7);
    expect(person).toEqual({
      id: "uid-a",
      name: "Nguyễn Văn A",
      dept: "CEVC10",
      title: "Rising Hero",
      initial: "N",
    });
  });

  it("falls back initial to first char of full_name when avatar_initial is null", () => {
    const profile: ProfileRow = { ...PROFILE_A, avatar_initial: null };
    const person = mapProfileToKudosPerson(profile, TIERS, 1);
    expect(person.initial).toBe("N");
  });

  it("uses ? initial when both avatar_initial and full_name are null", () => {
    const profile: ProfileRow = {
      ...PROFILE_A,
      avatar_initial: null,
      full_name: null,
    };
    const person = mapProfileToKudosPerson(profile, TIERS, 0);
    expect(person.initial).toBe("?");
  });

  it("uses empty string for dept when dept_code is null", () => {
    const profile: ProfileRow = { ...PROFILE_A, dept_code: null };
    const person = mapProfileToKudosPerson(profile, TIERS, 1);
    expect(person.dept).toBe("");
  });
});

// ---------------------------------------------------------------------------
// mapAnonymousSender
// ---------------------------------------------------------------------------

describe("mapAnonymousSender", () => {
  it("uses anonymous_name when provided", () => {
    const person = mapAnonymousSender("Bí Ẩn Nhân");
    expect(person.name).toBe("Bí Ẩn Nhân");
  });

  it("falls back to Người giấu tên when anonymous_name is null", () => {
    const person = mapAnonymousSender(null);
    expect(person.name).toBe("Người giấu tên");
  });

  it("hides identity fields: empty dept, ? initial, New Hero title", () => {
    const person = mapAnonymousSender(null);
    expect(person.dept).toBe("");
    expect(person.initial).toBe("?");
    expect(person.title).toBe("New Hero");
    expect(person.id).toBe("anonymous");
  });
});

// ---------------------------------------------------------------------------
// mapKudosRow
// ---------------------------------------------------------------------------

describe("mapKudosRow", () => {
  it("maps a normal (non-anonymous) kudos row to KudosEntry", () => {
    const row = makeKudosRow();
    const entry = mapKudosRow(row, TIERS, "uid-x", 3, 12);

    expect(entry.id).toBe("kudos-1");
    expect(entry.message).toBe("Great work!");
    expect(entry.sender.id).toBe("uid-a");
    expect(entry.sender.title).toBe("New Hero"); // 3 received → New Hero (1-4)
    expect(entry.receiver.id).toBe("uid-b");
    expect(entry.receiver.title).toBe("Super Hero"); // 12 received → Super Hero (10-20)
    expect(entry.hashtags).toEqual(["#Dedicated", "#Inspiring"]);
    expect(entry.likeCount).toBe(2);
    expect(entry.liked).toBe(true); // uid-x is in hearts
  });

  it("sets liked=false when current user has not liked", () => {
    const row = makeKudosRow();
    const entry = mapKudosRow(row, TIERS, "uid-z", 3, 12);
    expect(entry.liked).toBe(false);
  });

  it("sets liked=false when currentUserId is null", () => {
    const row = makeKudosRow();
    const entry = mapKudosRow(row, TIERS, null, 3, 12);
    expect(entry.liked).toBe(false);
  });

  it("hides sender identity when is_anonymous=true", () => {
    const row = makeKudosRow({ is_anonymous: true, anonymous_name: "Secret Person" });
    const entry = mapKudosRow(row, TIERS, null, 3, 12);
    expect(entry.sender.id).toBe("anonymous");
    expect(entry.sender.name).toBe("Secret Person");
    expect(entry.sender.dept).toBe("");
  });

  it("hides sender identity with default name when is_anonymous=true and anonymous_name=null", () => {
    const row = makeKudosRow({ is_anonymous: true, anonymous_name: null });
    const entry = mapKudosRow(row, TIERS, null, 3, 12);
    expect(entry.sender.name).toBe("Người giấu tên");
  });

  it("sorts images by sort_idx and sets images field", () => {
    const row = makeKudosRow({
      kudos_images: [
        { url: "https://img/b.png", sort_idx: 2 },
        { url: "https://img/a.png", sort_idx: 1 },
      ],
    });
    const entry = mapKudosRow(row, TIERS, null, 0, 0);
    expect(entry.images).toEqual(["https://img/a.png", "https://img/b.png"]);
  });

  it("leaves images undefined when no images", () => {
    const row = makeKudosRow({ kudos_images: [] });
    const entry = mapKudosRow(row, TIERS, null, 0, 0);
    expect(entry.images).toBeUndefined();
  });

  it("normalises hashtag tags: strips leading # from DB tag if present", () => {
    const row = makeKudosRow({
      kudos_hashtags: [{ hashtags: { tag: "#Leadership" } }],
    });
    const entry = mapKudosRow(row, TIERS, null, 0, 0);
    expect(entry.hashtags).toEqual(["#Leadership"]);
  });

  it("formats time using formatKudosTime", () => {
    const d = new Date(2025, 9, 30, 10, 0, 0);
    const row = makeKudosRow({ created_at: d.toISOString() });
    const entry = mapKudosRow(row, TIERS, null, 0, 0);
    expect(entry.time).toBe("10:00 - 10/30/2025");
  });
});

// ---------------------------------------------------------------------------
// mapAward
// ---------------------------------------------------------------------------

describe("mapAward", () => {
  it("maps all award fields", () => {
    const row = {
      id: "top-talent",
      name: "Top Talent",
      description: "Desc",
      quantity: "10",
      prize_value: "7M VND",
      ring_color: "#FAE287",
      image: "/medal.png",
      sort_idx: 1,
    };
    const award = mapAward(row);
    expect(award).toEqual({
      id: "top-talent",
      name: "Top Talent",
      description: "Desc",
      quantity: "10",
      prizeValue: "7M VND",
      ringColor: "#FAE287",
      image: "/medal.png",
    });
  });

  it("uses fallback ringColor when null", () => {
    const row = {
      id: "a",
      name: "Award",
      description: null,
      quantity: null,
      prize_value: null,
      ring_color: null,
      image: null,
      sort_idx: 0,
    };
    const award = mapAward(row);
    expect(award.ringColor).toBe("#FAE287");
    expect(award.description).toBe("");
    expect(award.image).toBe("");
  });
});

// ---------------------------------------------------------------------------
// mapBadge
// ---------------------------------------------------------------------------

describe("mapBadge", () => {
  it("maps badge fields to BadgeReward", () => {
    const row = { id: "stay-gold", name: "Stay Gold", image: "/badge.png", weight: 0.3 };
    expect(mapBadge(row)).toEqual({ id: "stay-gold", name: "Stay Gold", image: "/badge.png" });
  });

  it("uses empty string when image is null", () => {
    const row = { id: "x", name: "X", image: null, weight: 0.1 };
    expect(mapBadge(row).image).toBe("");
  });
});

// ---------------------------------------------------------------------------
// mapProfileStats
// ---------------------------------------------------------------------------

describe("mapProfileStats", () => {
  it("maps all stats fields from RPC row", () => {
    const row = {
      kudos_received: 10,
      kudos_sent: 5,
      hearts_received: 42,
      boxes_opened: 3,
      boxes_unopened: 2,
      hero_tier_name: "Legend Hero",
    };
    const stats = mapProfileStats(row);
    expect(stats).toEqual({
      kudosReceived: 10,
      kudosSent: 5,
      hearts: 42,
      boxOpened: 3,
      boxUnopened: 2,
      heroTierName: "Legend Hero",
    });
  });
});
