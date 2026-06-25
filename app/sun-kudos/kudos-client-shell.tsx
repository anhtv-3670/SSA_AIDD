"use client";

// Client shell: owns the shared filter+search state and passes it down.
// KudosHighlight + KudosAll both react to the same {hashtag, dept, query}.
// Lifted here so we keep page.tsx a Server Component.
// writeOpen: F006 — Write Kudo modal state; A.1 compose bar triggers open.

import { useState, useMemo } from "react";
import { KudosComposeBar } from "./kudos-compose-bar";
import { KudosHighlight } from "./kudos-highlight";
import { KudosSpotlight } from "./kudos-spotlight";
import { KudosAll } from "./kudos-all";
import { WriteKudoModal } from "./write-kudo/write-kudo-modal";
import { highlightKudos, allKudos } from "./kudos-data";
import { filterKudos } from "./kudos-filter";

export function KudosClientShell() {
  const [query, setQuery] = useState("");
  const [hashtagFilter, setHashtagFilter] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [writeOpen, setWriteOpen] = useState(false);

  // Apply shared filters to highlight list (same logic as the All feed — see kudos-filter.ts)
  const filteredHighlight = useMemo(
    () => filterKudos(highlightKudos, { hashtag: hashtagFilter, dept: deptFilter, query }),
    [query, hashtagFilter, deptFilter],
  );

  return (
    <>
      {/* A.1 Compose bar — pencil pill opens Write Kudo modal; Sunner search drives query */}
      <KudosComposeBar
        query={query}
        onQueryChange={setQuery}
        onOpenWrite={() => setWriteOpen(true)}
      />

      {/* F006 Write Kudo modal */}
      <WriteKudoModal open={writeOpen} onClose={() => setWriteOpen(false)} />

      {/* B — Highlight Kudos carousel */}
      <KudosHighlight
        entries={filteredHighlight}
        hashtagFilter={hashtagFilter}
        deptFilter={deptFilter}
        onHashtagChange={setHashtagFilter}
        onDeptChange={setDeptFilter}
      />

      {/* B.6/B.7 — Spotlight Board */}
      <KudosSpotlight />

      {/* C + D — All Kudos feed + sidebar.
          Note: Highlight receives a pre-filtered list (above); All receives the raw list +
          the filter inputs and applies the SAME filterKudos() internally. Both paths share
          kudos-filter.ts, so results stay consistent. */}
      <KudosAll
        entries={allKudos}
        hashtagFilter={hashtagFilter}
        deptFilter={deptFilter}
        query={query}
      />
    </>
  );
}
