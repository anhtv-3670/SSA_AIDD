"use client";

import { useEffect, useState } from "react";

/**
 * Tracks which section id is most visible in the viewport.
 * Uses IntersectionObserver; degrades gracefully when unavailable (EC-6).
 *
 * @param ids  Ordered list of section id strings (without the "award-" prefix).
 * @param rootMarginTop  Pixels to subtract from the top of the root (e.g. sticky header height).
 */
export function useScrollSpy(ids: string[], rootMarginTop = 80): string {
  const [activeId, setActiveId] = useState<string>(ids[0] ?? "");

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    // Map from element id → latest intersection ratio
    const ratioMap = new Map<string, number>(ids.map((id) => [id, 0]));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratioMap.set(entry.target.id, entry.intersectionRatio);
        });

        // Pick the id with the highest visible ratio
        let bestId = "";
        let bestRatio = -1;
        ratioMap.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        });

        if (bestId && bestRatio > 0) {
          setActiveId(bestId);
        }
      },
      {
        // Shrink root by header height so sections are observed below the header
        rootMargin: `-${rootMarginTop}px 0px 0px 0px`,
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1.0],
      },
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [ids, rootMarginTop]);

  return activeId;
}
