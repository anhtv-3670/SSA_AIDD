"use client";

// Authoritative: B_Highlight (2940:13451)
// Left fade: linear-gradient(90deg, #00101A 50%, transparent 100%), width 400px
// Right fade: linear-gradient(270deg, #00101A 50%, transparent 100%), width 400px
// Slide nav B.5: row centered gap 32px; page counter 28px #999 Montserrat 700

import { useState, useCallback } from "react";
import { KudosCard } from "./kudos-card";
import { KudosSectionHeader } from "./kudos-section-header";
import { KudosFilterDropdown } from "./kudos-filter-dropdown";
import { CarouselArrow } from "./kudos-carousel-arrow";
import type { KudosEntry } from "./kudos-data";
import { hashtags, departments } from "./kudos-data";

interface KudosHighlightProps {
  entries: KudosEntry[];
  hashtagFilter: string;
  deptFilter: string;
  onHashtagChange: (v: string) => void;
  onDeptChange: (v: string) => void;
}

export function KudosHighlight({
  entries,
  hashtagFilter,
  deptFilter,
  onHashtagChange,
  onDeptChange,
}: KudosHighlightProps) {
  const [page, setPage] = useState(0);

  // H-1/EC-7: reset to page 1 whenever the filtered list changes — covers hashtag, dept AND
  // the free-text query (all reach us via `entries`). Adjust-during-render (React's documented
  // pattern for resetting state on prop change) instead of an effect; `entries` is memoized by
  // the parent so this fires only when filters actually change.
  const [trackedEntries, setTrackedEntries] = useState(entries);
  if (trackedEntries !== entries) {
    setTrackedEntries(entries);
    setPage(0);
  }

  const total = entries.length;
  const clampedPage = total === 0 ? 0 : Math.min(page, total - 1);
  const atStart = clampedPage === 0;
  const atEnd = clampedPage >= total - 1;

  const handlePrev = useCallback(() => setPage((p) => Math.max(0, p - 1)), []);
  const handleNext = useCallback(() => setPage((p) => Math.min(total - 1, p + 1)), [total]);

  const filters = (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <KudosFilterDropdown
        label="Hashtag"
        options={hashtags}
        value={hashtagFilter}
        onChange={onHashtagChange}
      />
      <KudosFilterDropdown
        label="Phòng ban"
        options={departments}
        value={deptFilter}
        onChange={onDeptChange}
      />
    </div>
  );

  return (
    <section aria-label="Highlight Kudos" style={{ display: "flex", flexDirection: "column", gap: "40px", width: "100%" }}>
      <KudosSectionHeader subtitle="Sun* Annual Awards 2025" title="HIGHLIGHT KUDOS" rightSlot={filters} />

      {/* Carousel */}
      <div style={{ position: "relative", width: "100%", overflow: "hidden" }}>
        {total === 0 ? (
          <p style={{ padding: "60px 144px", fontFamily: "Montserrat, sans-serif", fontSize: "18px", fontWeight: 700, color: "#999", textAlign: "center" }}>
            Hiện tại chưa có Kudos nào.
          </p>
        ) : (
          <>
            {/* Scrollable track */}
            <div style={{
              display: "flex", gap: "24px",
              transition: "transform 300ms ease",
              transform: `translateX(calc(-${clampedPage * (528 + 24)}px + 144px))`,
            }}>
              {entries.map((entry, i) => (
                <div key={entry.id} style={{ opacity: i === clampedPage ? 1 : 0.45, transition: "opacity 300ms ease", flexShrink: 0 }}>
                  <KudosCard entry={entry} variant="highlight" />
                </div>
              ))}
            </div>

            {/* Left gradient overlay */}
            <div aria-hidden="true" style={{ position: "absolute", top: 0, left: 0, width: "400px", height: "100%", background: "linear-gradient(90deg, #00101A 50%, rgba(255,255,255,0) 100%)", pointerEvents: "none", zIndex: 2 }} />
            {/* Right gradient overlay */}
            <div aria-hidden="true" style={{ position: "absolute", top: 0, right: 0, width: "400px", height: "100%", background: "linear-gradient(270deg, #00101A 50%, rgba(255,255,255,0) 100%)", pointerEvents: "none", zIndex: 2 }} />

            {/* Overlay prev button */}
            <div style={{ position: "absolute", top: "50%", left: "80px", transform: "translateY(-50%)", zIndex: 3 }}>
              <CarouselArrow dir="prev" disabled={atStart} size={80} onClick={handlePrev} />
            </div>
            {/* Overlay next button */}
            <div style={{ position: "absolute", top: "50%", right: "80px", transform: "translateY(-50%)", zIndex: 3 }}>
              <CarouselArrow dir="next" disabled={atEnd} size={80} onClick={handleNext} />
            </div>
          </>
        )}
      </div>

      {/* Slide nav — B.5 */}
      {total > 0 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "32px" }}>
          <CarouselArrow dir="prev" disabled={atStart} size={48} onClick={handlePrev} />
          <span
            aria-label={`Slide ${clampedPage + 1} of ${total}`}
            style={{ fontFamily: "Montserrat, sans-serif", fontSize: "28px", fontWeight: 700, lineHeight: "36px", color: "#999" }}
          >
            {clampedPage + 1}/{total}
          </span>
          <CarouselArrow dir="next" disabled={atEnd} size={48} onClick={handleNext} />
        </div>
      )}
    </section>
  );
}
