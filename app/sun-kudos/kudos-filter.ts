// Pure kudos filtering — shared by KudosClientShell (highlight) and KudosAll (feed)
// so the two lists always filter identically (DRY). No React here → unit-testable.

import type { KudosEntry } from "./kudos-data";

export interface KudosFilters {
  /** Exact hashtag match (case-insensitive), e.g. "#Dedicated". Empty = no hashtag filter. */
  hashtag?: string;
  /** Department code matched against sender OR receiver, e.g. "CEVC10". Empty = no dept filter. */
  dept?: string;
  /** Free-text query matched against sender name, receiver name, or message. Empty = no search. */
  query?: string;
}

/** Filter a kudos list by hashtag, department, and free-text query. Returns a new array. */
export function filterKudos(list: KudosEntry[], { hashtag, dept, query }: KudosFilters): KudosEntry[] {
  let result = list;

  if (hashtag) {
    const tag = hashtag.toLowerCase();
    result = result.filter((e) => e.hashtags.some((h) => h.toLowerCase() === tag));
  }

  if (dept) {
    result = result.filter((e) => e.sender.dept === dept || e.receiver.dept === dept);
  }

  const q = query?.trim().toLowerCase();
  if (q) {
    result = result.filter(
      (e) =>
        e.sender.name.toLowerCase().includes(q) ||
        e.receiver.name.toLowerCase().includes(q) ||
        e.message.toLowerCase().includes(q),
    );
  }

  return result;
}
