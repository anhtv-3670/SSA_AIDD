import { describe, it, expect } from "vitest";
import {
  PROFILE,
  SENT_KUDOS,
  RECEIVED_KUDOS,
  type ProfileData,
  type ProfileKudosEntry,
  type ProfileStats,
} from "./profile-data";

describe("PROFILE constant", () => {
  it("has name, dept, title, avatarInitial as non-empty strings", () => {
    expect(typeof PROFILE.name).toBe("string");
    expect(PROFILE.name.length).toBeGreaterThan(0);
    expect(typeof PROFILE.dept).toBe("string");
    expect(PROFILE.dept.length).toBeGreaterThan(0);
    expect(typeof PROFILE.title).toBe("string");
    expect(PROFILE.title.length).toBeGreaterThan(0);
    expect(typeof PROFILE.avatarInitial).toBe("string");
    expect(PROFILE.avatarInitial.length).toBeGreaterThan(0);
  });

  it("has stats object with all required numeric properties", () => {
    expect(PROFILE.stats).toBeDefined();
    expect(typeof PROFILE.stats.kudosReceived).toBe("number");
    expect(typeof PROFILE.stats.kudosSent).toBe("number");
    expect(typeof PROFILE.stats.hearts).toBe("number");
    expect(typeof PROFILE.stats.boxOpened).toBe("number");
    expect(typeof PROFILE.stats.boxUnopened).toBe("number");
  });

  it("all stats are non-negative integers", () => {
    expect(PROFILE.stats.kudosReceived).toBeGreaterThanOrEqual(0);
    expect(PROFILE.stats.kudosSent).toBeGreaterThanOrEqual(0);
    expect(PROFILE.stats.hearts).toBeGreaterThanOrEqual(0);
    expect(PROFILE.stats.boxOpened).toBeGreaterThanOrEqual(0);
    expect(PROFILE.stats.boxUnopened).toBeGreaterThanOrEqual(0);
    expect(Number.isInteger(PROFILE.stats.kudosReceived)).toBe(true);
    expect(Number.isInteger(PROFILE.stats.kudosSent)).toBe(true);
    expect(Number.isInteger(PROFILE.stats.hearts)).toBe(true);
    expect(Number.isInteger(PROFILE.stats.boxOpened)).toBe(true);
    expect(Number.isInteger(PROFILE.stats.boxUnopened)).toBe(true);
  });

  it("is a valid ProfileData object", () => {
    const data: ProfileData = PROFILE;
    expect(data).toBeDefined();
    expect(data.stats).toBeDefined();
  });
});

describe("SENT_KUDOS constant", () => {
  it("is a non-empty array", () => {
    expect(Array.isArray(SENT_KUDOS)).toBe(true);
    expect(SENT_KUDOS.length).toBeGreaterThan(0);
  });

  it("each entry has sender, receiver, time, message, hashtags, likeCount", () => {
    SENT_KUDOS.forEach((entry) => {
      expect(entry.sender).toBeDefined();
      expect(entry.receiver).toBeDefined();
      expect(typeof entry.time).toBe("string");
      expect(typeof entry.message).toBe("string");
      expect(Array.isArray(entry.hashtags)).toBe(true);
      expect(typeof entry.likeCount).toBe("number");
    });
  });

  it("each entry has sender and receiver with id, name, dept, title, initial", () => {
    SENT_KUDOS.forEach((entry) => {
      expect(typeof entry.sender.id).toBe("string");
      expect(typeof entry.sender.name).toBe("string");
      expect(typeof entry.sender.dept).toBe("string");
      expect(typeof entry.sender.title).toBe("string");
      expect(typeof entry.sender.initial).toBe("string");

      expect(typeof entry.receiver.id).toBe("string");
      expect(typeof entry.receiver.name).toBe("string");
      expect(typeof entry.receiver.dept).toBe("string");
      expect(typeof entry.receiver.title).toBe("string");
      expect(typeof entry.receiver.initial).toBe("string");
    });
  });

  it("spam property is optional boolean (defaults to false when absent)", () => {
    SENT_KUDOS.forEach((entry) => {
      expect(typeof entry.spam === "boolean" || entry.spam === undefined).toBe(true);
      // Mock data explicitly sets spam, but the interface allows it to be optional
      if (entry.spam !== undefined) {
        expect(typeof entry.spam).toBe("boolean");
      }
    });
  });

  it("contains at least one spam entry (F007 requirement)", () => {
    const spamEntries = SENT_KUDOS.filter((e) => e.spam === true);
    expect(spamEntries.length).toBeGreaterThan(0);
  });

  it("likeCount is non-negative integer", () => {
    SENT_KUDOS.forEach((entry) => {
      expect(typeof entry.likeCount).toBe("number");
      expect(entry.likeCount).toBeGreaterThanOrEqual(0);
      expect(Number.isInteger(entry.likeCount)).toBe(true);
    });
  });
});

describe("RECEIVED_KUDOS constant", () => {
  it("is a non-empty array", () => {
    expect(Array.isArray(RECEIVED_KUDOS)).toBe(true);
    expect(RECEIVED_KUDOS.length).toBeGreaterThan(0);
  });

  it("each entry has sender, receiver, time, message, hashtags, likeCount", () => {
    RECEIVED_KUDOS.forEach((entry) => {
      expect(entry.sender).toBeDefined();
      expect(entry.receiver).toBeDefined();
      expect(typeof entry.time).toBe("string");
      expect(typeof entry.message).toBe("string");
      expect(Array.isArray(entry.hashtags)).toBe(true);
      expect(typeof entry.likeCount).toBe("number");
    });
  });

  it("each entry has sender and receiver with id, name, dept, title, initial", () => {
    RECEIVED_KUDOS.forEach((entry) => {
      expect(typeof entry.sender.id).toBe("string");
      expect(typeof entry.sender.name).toBe("string");
      expect(typeof entry.sender.dept).toBe("string");
      expect(typeof entry.sender.title).toBe("string");
      expect(typeof entry.sender.initial).toBe("string");

      expect(typeof entry.receiver.id).toBe("string");
      expect(typeof entry.receiver.name).toBe("string");
      expect(typeof entry.receiver.dept).toBe("string");
      expect(typeof entry.receiver.title).toBe("string");
      expect(typeof entry.receiver.initial).toBe("string");
    });
  });

  it("spam property is optional boolean", () => {
    RECEIVED_KUDOS.forEach((entry) => {
      expect(typeof entry.spam === "boolean" || entry.spam === undefined).toBe(true);
    });
  });

  it("contains at least one spam entry (F007 requirement)", () => {
    const spamEntries = RECEIVED_KUDOS.filter((e) => e.spam === true);
    expect(spamEntries.length).toBeGreaterThan(0);
  });

  it("likeCount is non-negative integer", () => {
    RECEIVED_KUDOS.forEach((entry) => {
      expect(typeof entry.likeCount).toBe("number");
      expect(entry.likeCount).toBeGreaterThanOrEqual(0);
      expect(Number.isInteger(entry.likeCount)).toBe(true);
    });
  });
});

describe("Data consistency checks", () => {
  it("SENT_KUDOS and RECEIVED_KUDOS both have at least 1 entry", () => {
    expect(SENT_KUDOS.length).toBeGreaterThan(0);
    expect(RECEIVED_KUDOS.length).toBeGreaterThan(0);
  });

  it("each SENT_KUDOS entry has sender id 'me'", () => {
    SENT_KUDOS.forEach((entry) => {
      expect(entry.sender.id).toBe("me");
    });
  });

  it("each RECEIVED_KUDOS entry has receiver id 'me'", () => {
    RECEIVED_KUDOS.forEach((entry) => {
      expect(entry.receiver.id).toBe("me");
    });
  });

  it("hashtags in each entry are non-empty strings starting with #", () => {
    [...SENT_KUDOS, ...RECEIVED_KUDOS].forEach((entry) => {
      expect(entry.hashtags.length).toBeGreaterThan(0);
      entry.hashtags.forEach((tag) => {
        expect(typeof tag).toBe("string");
        expect(tag.length).toBeGreaterThan(0);
        expect(tag.startsWith("#")).toBe(true);
      });
    });
  });
});
