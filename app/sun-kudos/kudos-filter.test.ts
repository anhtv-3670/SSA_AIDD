import { describe, it, expect } from "vitest";

import { filterKudos, type KudosFilters } from "./kudos-filter";
import { highlightKudos, allKudos, type KudosEntry, type KudosPerson } from "./kudos-data";

// --- Test fixtures (minimal kudos entries for unit tests) ---

const personA: KudosPerson = {
  id: "a1",
  name: "Alice",
  dept: "CEVC10",
  title: "New Hero",
  initial: "A",
};

const personB: KudosPerson = {
  id: "b1",
  name: "Bob",
  dept: "DXD01",
  title: "Rising Hero",
  initial: "B",
};

const personC: KudosPerson = {
  id: "c1",
  name: "Charlie",
  dept: "PMG02",
  title: "Legend Hero",
  initial: "C",
};

const personD: KudosPerson = {
  id: "d1",
  name: "Diana",
  dept: "HRD01",
  title: "Legend Hero",
  initial: "D",
};

const entry1: KudosEntry = {
  id: "e1",
  sender: personA,
  receiver: personB,
  time: "10:00 - 01/01/2025",
  message: "Great work on the project",
  hashtags: ["#Dedicated", "#Teamwork"],
  likeCount: 10,
};

const entry2: KudosEntry = {
  id: "e2",
  sender: personB,
  receiver: personC,
  time: "11:00 - 01/01/2025",
  message: "Excellent leadership and inspiration",
  hashtags: ["#Inspiring", "#Leadership"],
  likeCount: 20,
};

const entry3: KudosEntry = {
  id: "e3",
  sender: personC,
  receiver: personD,
  time: "12:00 - 01/01/2025",
  message: "Technical expertise is remarkable",
  hashtags: ["#Technical", "#Mentoring"],
  likeCount: 30,
};

const entry4: KudosEntry = {
  id: "e4",
  sender: personD,
  receiver: personA,
  time: "13:00 - 01/01/2025",
  message: "Communication skills are top-notch",
  hashtags: ["#Communication"],
  likeCount: 5,
};

// Entries with overlapping properties for cross-filter testing
const entry5: KudosEntry = {
  id: "e5",
  sender: personA,
  receiver: personC,
  time: "14:00 - 01/01/2025",
  message: "Dedicated to helping the team",
  hashtags: ["#Dedicated"],
  likeCount: 15,
};

const testList: KudosEntry[] = [entry1, entry2, entry3, entry4, entry5];

describe("filterKudos", () => {
  describe("no filters (empty filters object)", () => {
    it("returns all entries when filters is empty object", () => {
      const result = filterKudos(testList, {});
      expect(result).toHaveLength(5);
      expect(result).toEqual(testList);
    });

    it("returns all entries when filters is empty object (same reference integrity)", () => {
      const result = filterKudos(testList, {});
      result.forEach((entry, idx) => {
        expect(entry).toEqual(testList[idx]);
      });
    });

    it("returns all entries when all filter fields are undefined", () => {
      const filters: KudosFilters = {
        hashtag: undefined,
        dept: undefined,
        query: undefined,
      };
      const result = filterKudos(testList, filters);
      expect(result).toHaveLength(5);
    });
  });

  describe("hashtag filter", () => {
    it("matches hashtag case-insensitively (lowercase input)", () => {
      const result = filterKudos(testList, { hashtag: "#dedicated" });
      expect(result).toHaveLength(2);
      expect(result.map((e) => e.id)).toEqual(["e1", "e5"]);
    });

    it("matches hashtag case-insensitively (uppercase input)", () => {
      const result = filterKudos(testList, { hashtag: "#DEDICATED" });
      expect(result).toHaveLength(2);
      expect(result.map((e) => e.id)).toEqual(["e1", "e5"]);
    });

    it("matches hashtag case-insensitively (mixed case input)", () => {
      const result = filterKudos(testList, { hashtag: "#DeDiCaTeD" });
      expect(result).toHaveLength(2);
    });

    it("matches hashtag when entry has multiple hashtags", () => {
      const result = filterKudos(testList, { hashtag: "#Teamwork" });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("e1");
    });

    it("matches any hashtag in an entry with multiple tags", () => {
      const result = filterKudos(testList, { hashtag: "#Leadership" });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("e2");
    });

    it("returns empty when hashtag does not match any entry", () => {
      const result = filterKudos(testList, { hashtag: "#NonExistent" });
      expect(result).toHaveLength(0);
    });

    it("returns empty when hashtag is empty string", () => {
      const result = filterKudos(testList, { hashtag: "" });
      expect(result).toHaveLength(5);
    });

    it("does not filter when hashtag contains only whitespace (truthy but non-matching)", () => {
      // Whitespace-only string is truthy, so it attempts filtering.
      // "   " lowercased is "   ", which matches no hashtags (all are like "#Dedicated")
      const result = filterKudos(testList, { hashtag: "   " });
      // Result is empty because "   " doesn't match any actual hashtags
      expect(result).toHaveLength(0);
    });

    it("matches hashtag with # symbol", () => {
      const result = filterKudos(testList, { hashtag: "#Inspiring" });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("e2");
    });
  });

  describe("dept filter", () => {
    it("matches department against sender.dept", () => {
      const result = filterKudos(testList, { dept: "CEVC10" });
      expect(result.length).toBeGreaterThan(0);
      const allMatch = result.every(
        (e) => e.sender.dept === "CEVC10" || e.receiver.dept === "CEVC10"
      );
      expect(allMatch).toBe(true);
    });

    it("matches department against receiver.dept", () => {
      const result = filterKudos(testList, { dept: "DXD01" });
      // personB (receiver in entry1) and personB (sender in entry2) both in DXD01
      expect(result.length).toBeGreaterThan(0);
      const allMatch = result.every(
        (e) => e.sender.dept === "DXD01" || e.receiver.dept === "DXD01"
      );
      expect(allMatch).toBe(true);
    });

    it("matches department against sender OR receiver (inclusive)", () => {
      const result = filterKudos(testList, { dept: "PMG02" });
      // personC is in PMG02
      expect(result.length).toBeGreaterThan(0);
      result.forEach((e) => {
        const matches =
          e.sender.dept === "PMG02" || e.receiver.dept === "PMG02";
        expect(matches).toBe(true);
      });
    });

    it("returns empty when department does not match any entry", () => {
      const result = filterKudos(testList, { dept: "NONEXIST" });
      expect(result).toHaveLength(0);
    });

    it("returns all entries when dept is empty string", () => {
      const result = filterKudos(testList, { dept: "" });
      expect(result).toHaveLength(5);
    });

    it("is case-sensitive (exact match required)", () => {
      const result = filterKudos(testList, { dept: "cevc10" });
      expect(result).toHaveLength(0);
    });

    it("matches exactly (no partial match)", () => {
      const result = filterKudos(testList, { dept: "CEC" });
      expect(result).toHaveLength(0);
    });
  });

  describe("query filter (free-text search)", () => {
    it("matches substring in sender.name (case-insensitive)", () => {
      const result = filterKudos(testList, { query: "alice" });
      expect(result.length).toBeGreaterThan(0);
      const allMatch = result.every(
        (e) =>
          e.sender.name.toLowerCase().includes("alice") ||
          e.receiver.name.toLowerCase().includes("alice") ||
          e.message.toLowerCase().includes("alice")
      );
      expect(allMatch).toBe(true);
    });

    it("matches substring in receiver.name (case-insensitive)", () => {
      const result = filterKudos(testList, { query: "bob" });
      expect(result.length).toBeGreaterThan(0);
      const allMatch = result.every(
        (e) =>
          e.sender.name.toLowerCase().includes("bob") ||
          e.receiver.name.toLowerCase().includes("bob") ||
          e.message.toLowerCase().includes("bob")
      );
      expect(allMatch).toBe(true);
    });

    it("matches substring in message (case-insensitive)", () => {
      const result = filterKudos(testList, { query: "great" });
      expect(result.length).toBeGreaterThan(0);
      const allMatch = result.every(
        (e) =>
          e.sender.name.toLowerCase().includes("great") ||
          e.receiver.name.toLowerCase().includes("great") ||
          e.message.toLowerCase().includes("great")
      );
      expect(allMatch).toBe(true);
    });

    it("matches substring in message 'project'", () => {
      const result = filterKudos(testList, { query: "project" });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("e1");
    });

    it("matches substring in message 'leadership'", () => {
      const result = filterKudos(testList, { query: "leadership" });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("e2");
    });

    it("returns empty when query does not match any field", () => {
      const result = filterKudos(testList, { query: "xyzabc" });
      expect(result).toHaveLength(0);
    });

    it("returns all entries when query is empty string", () => {
      const result = filterKudos(testList, { query: "" });
      expect(result).toHaveLength(5);
    });

    it("returns all entries when query is whitespace only", () => {
      const result = filterKudos(testList, { query: "   " });
      expect(result).toHaveLength(5);
    });

    it("trims whitespace from query before matching", () => {
      const result = filterKudos(testList, { query: "  alice  " });
      expect(result.length).toBeGreaterThan(0);
    });

    it("matches case-insensitively (lowercase query vs uppercase name)", () => {
      const result = filterKudos(testList, { query: "ALICE" });
      expect(result.length).toBeGreaterThan(0);
    });

    it("matches case-insensitively (uppercase query vs lowercase message)", () => {
      const result = filterKudos(testList, { query: "GREAT" });
      expect(result).toHaveLength(1);
    });

    it("matches substring 'di' across multiple entries", () => {
      const result = filterKudos(testList, { query: "di" });
      // "Diana", "Dedicated" contain "di"
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe("combined filters (AND logic)", () => {
    it("applies hashtag AND dept filters together", () => {
      const result = filterKudos(testList, {
        hashtag: "#Dedicated",
        dept: "CEVC10",
      });
      // entry1 (sender Alice/CEVC10, receiver Bob/DXD01) has #Dedicated
      // entry5 (sender Alice/CEVC10, receiver Charlie/PMG02) has #Dedicated
      // Both match: Alice is CEVC10, and both have #Dedicated
      expect(result.length).toBeGreaterThan(0);
      result.forEach((e) => {
        expect(e.hashtags.map((h) => h.toLowerCase())).toContain("#dedicated");
        const deptMatch =
          e.sender.dept === "CEVC10" || e.receiver.dept === "CEVC10";
        expect(deptMatch).toBe(true);
      });
    });

    it("applies hashtag AND query filters together", () => {
      const result = filterKudos(testList, {
        hashtag: "#Dedicated",
        query: "alice",
      });
      // entry1: #Dedicated, sender Alice
      // entry5: #Dedicated, sender Alice, message contains "Dedicated"
      result.forEach((e) => {
        expect(e.hashtags.map((h) => h.toLowerCase())).toContain("#dedicated");
        const nameMatch =
          e.sender.name.toLowerCase().includes("alice") ||
          e.receiver.name.toLowerCase().includes("alice") ||
          e.message.toLowerCase().includes("alice");
        expect(nameMatch).toBe(true);
      });
    });

    it("applies dept AND query filters together", () => {
      const result = filterKudos(testList, {
        dept: "CEVC10",
        query: "alice",
      });
      result.forEach((e) => {
        const deptMatch =
          e.sender.dept === "CEVC10" || e.receiver.dept === "CEVC10";
        expect(deptMatch).toBe(true);
        const queryMatch =
          e.sender.name.toLowerCase().includes("alice") ||
          e.receiver.name.toLowerCase().includes("alice") ||
          e.message.toLowerCase().includes("alice");
        expect(queryMatch).toBe(true);
      });
    });

    it("applies all three filters together (hashtag AND dept AND query)", () => {
      const result = filterKudos(testList, {
        hashtag: "#Dedicated",
        dept: "CEVC10",
        query: "alice",
      });
      result.forEach((e) => {
        expect(e.hashtags.map((h) => h.toLowerCase())).toContain("#dedicated");
        const deptMatch =
          e.sender.dept === "CEVC10" || e.receiver.dept === "CEVC10";
        expect(deptMatch).toBe(true);
        const queryMatch =
          e.sender.name.toLowerCase().includes("alice") ||
          e.receiver.name.toLowerCase().includes("alice") ||
          e.message.toLowerCase().includes("alice");
        expect(queryMatch).toBe(true);
      });
    });

    it("returns empty when one combined filter matches but another does not", () => {
      const result = filterKudos(testList, {
        hashtag: "#Technical",
        dept: "CEVC10",
      });
      // #Technical is only in entry3 (sender Charlie/PMG02, receiver Diana/HRD01)
      // CEVC10 does not match entry3
      expect(result).toHaveLength(0);
    });

    it("returns results only when all filters are satisfied", () => {
      const result = filterKudos(testList, {
        hashtag: "#Inspiring",
        query: "excellent",
      });
      // #Inspiring is in entry2, message contains "Excellent"
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("e2");
    });
  });

  describe("empty input list", () => {
    it("returns empty array when input list is empty", () => {
      const result = filterKudos([], {});
      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });

    it("returns empty array when input list is empty with hashtag filter", () => {
      const result = filterKudos([], { hashtag: "#Dedicated" });
      expect(result).toHaveLength(0);
    });

    it("returns empty array when input list is empty with dept filter", () => {
      const result = filterKudos([], { dept: "CEVC10" });
      expect(result).toHaveLength(0);
    });

    it("returns empty array when input list is empty with query filter", () => {
      const result = filterKudos([], { query: "alice" });
      expect(result).toHaveLength(0);
    });

    it("returns empty array when input list is empty with all filters", () => {
      const result = filterKudos([], {
        hashtag: "#Dedicated",
        dept: "CEVC10",
        query: "alice",
      });
      expect(result).toHaveLength(0);
    });
  });

  describe("exported data arrays (smoke tests)", () => {
    it("highlightKudos is a non-empty array", () => {
      expect(Array.isArray(highlightKudos)).toBe(true);
      expect(highlightKudos.length).toBeGreaterThan(0);
    });

    it("allKudos is a non-empty array", () => {
      expect(Array.isArray(allKudos)).toBe(true);
      expect(allKudos.length).toBeGreaterThan(0);
    });

    it("highlightKudos entries have required KudosEntry fields", () => {
      highlightKudos.forEach((entry) => {
        expect(entry.id).toBeTruthy();
        expect(entry.sender).toBeTruthy();
        expect(entry.receiver).toBeTruthy();
        expect(entry.time).toBeTruthy();
        expect(entry.message).toBeTruthy();
        expect(Array.isArray(entry.hashtags)).toBe(true);
        expect(typeof entry.likeCount).toBe("number");
      });
    });

    it("allKudos entries have required KudosEntry fields", () => {
      allKudos.forEach((entry) => {
        expect(entry.id).toBeTruthy();
        expect(entry.sender).toBeTruthy();
        expect(entry.receiver).toBeTruthy();
        expect(entry.time).toBeTruthy();
        expect(entry.message).toBeTruthy();
        expect(Array.isArray(entry.hashtags)).toBe(true);
        expect(typeof entry.likeCount).toBe("number");
      });
    });

    it("filterKudos works with highlightKudos data", () => {
      const result = filterKudos(highlightKudos, { hashtag: "#Dedicated" });
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      result.forEach((e) => {
        expect(e.hashtags.map((h) => h.toLowerCase())).toContain("#dedicated");
      });
    });

    it("filterKudos works with allKudos data", () => {
      const result = filterKudos(allKudos, { dept: "CEVC10" });
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      result.forEach((e) => {
        const deptMatch =
          e.sender.dept === "CEVC10" || e.receiver.dept === "CEVC10";
        expect(deptMatch).toBe(true);
      });
    });

    it("filterKudos returns empty when filtering with non-existent hashtag from actual data", () => {
      const result = filterKudos(allKudos, { hashtag: "#NonExistentTag" });
      expect(result).toHaveLength(0);
    });
  });

  describe("edge cases and boundary conditions", () => {
    it("handles single entry in list", () => {
      const singleList = [entry1];
      const result = filterKudos(singleList, { hashtag: "#Dedicated" });
      expect(result).toHaveLength(1);
    });

    it("handles entries with empty hashtags array", () => {
      const entryNoTags: KudosEntry = {
        ...entry1,
        id: "e-no-tags",
        hashtags: [],
      };
      const result = filterKudos([entryNoTags], { hashtag: "#Dedicated" });
      expect(result).toHaveLength(0);
    });

    it("returns same array reference when no filters applied (optimization)", () => {
      // When no filters are active, the function returns the original array reference
      const result = filterKudos(testList, {});
      expect(result).toBe(testList);
    });

    it("does not mutate input array", () => {
      const inputCopy = [...testList];
      filterKudos(testList, { hashtag: "#Dedicated" });
      expect(testList).toEqual(inputCopy);
    });

    it("handles whitespace in sender name for query matching", () => {
      const entryWithSpace: KudosEntry = {
        ...entry1,
        id: "e-space",
        sender: { ...personA, name: "Alice Smith" },
      };
      const result = filterKudos([entryWithSpace], { query: "alice" });
      expect(result).toHaveLength(1);
    });

    it("handles special characters in message", () => {
      const entrySpecial: KudosEntry = {
        ...entry1,
        id: "e-special",
        message: "Great work! @team #awesome",
      };
      const result = filterKudos([entrySpecial], { query: "awesome" });
      expect(result).toHaveLength(1);
    });

    it("matches query with numbers in message", () => {
      const entryWithNumber: KudosEntry = {
        ...entry1,
        id: "e-number",
        message: "Fixed 42 bugs this sprint",
      };
      const result = filterKudos([entryWithNumber], { query: "42" });
      expect(result).toHaveLength(1);
    });
  });

  describe("filter order independence", () => {
    it("hashtag + dept produces same result regardless of filter order", () => {
      const filters1: KudosFilters = {
        hashtag: "#Dedicated",
        dept: "CEVC10",
      };
      const filters2: KudosFilters = {
        dept: "CEVC10",
        hashtag: "#Dedicated",
      };
      const result1 = filterKudos(testList, filters1);
      const result2 = filterKudos(testList, filters2);
      expect(result1).toEqual(result2);
    });

    it("all three filters produce same result regardless of filter order", () => {
      const filters1: KudosFilters = {
        hashtag: "#Dedicated",
        dept: "CEVC10",
        query: "alice",
      };
      const filters2: KudosFilters = {
        query: "alice",
        hashtag: "#Dedicated",
        dept: "CEVC10",
      };
      const result1 = filterKudos(testList, filters1);
      const result2 = filterKudos(testList, filters2);
      expect(result1).toEqual(result2);
    });
  });
});
