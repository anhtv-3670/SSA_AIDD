"use client";

// Client shell: owns the shared filter+search state and passes it down.
// KudosHighlight + KudosAll both react to the same {hashtag, dept, query}.
// Lifted here so we keep page.tsx a Server Component.
// writeOpen: F006 — Write Kudo modal state; A.1 compose bar triggers open.

import { useState, useMemo, useCallback } from "react";
import { FabButton } from "@/components/fab-button";
import { KudosComposeBar } from "./kudos-compose-bar";
import { KudosHighlight } from "./kudos-highlight";
import { KudosSpotlight } from "./kudos-spotlight";
import { KudosAll } from "./kudos-all";
import { WriteKudoModal } from "./write-kudo/write-kudo-modal";
import { TheLeModal } from "@/app/the-le/the-le-modal";
import { SecretBoxModal } from "./secret-box/secret-box-modal";
import { filterKudos } from "./kudos-filter";
import type { KudosEntry } from "@/lib/data/types";
import type { KudosStats } from "./kudos-data";
import type { HashtagOption, DepartmentOption } from "@/lib/data/catalog-queries";
import type { RecipientOption } from "./write-kudo/write-kudo-modal";

interface KudosClientShellProps {
  /** All kudos entries (feed) from DB — passed through to KudosAll and filtered for KudosHighlight. */
  allEntries: KudosEntry[];
  /** Top-N kudos by likeCount — for the highlight carousel. */
  highlightEntries: KudosEntry[];
  /** Real unopened box count for the logged-in user. */
  boxCount: number;
  /** Real stats for the logged-in user from profile_stats RPC. */
  stats: KudosStats;
  /** Hashtag catalog rows for filter dropdowns and write-kudo modal. */
  hashtags: HashtagOption[];
  /** Department catalog rows for filter dropdown. */
  departments: DepartmentOption[];
  /** Profile list for the recipient autocomplete in write-kudo modal. */
  recipients: RecipientOption[];
}

export function KudosClientShell({
  allEntries,
  highlightEntries,
  boxCount,
  stats,
  hashtags,
  departments,
  recipients,
}: KudosClientShellProps) {
  const [query, setQuery] = useState("");
  const [hashtagFilter, setHashtagFilter] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [writeOpen, setWriteOpen] = useState(false);
  const [theleOpen, setTheleOpen] = useState(false);
  const [secretBoxOpen, setSecretBoxOpen] = useState(false);

  // "Viết KUDOS" from inside Thể lệ: close Thể lệ, open the single Write modal.
  const handleTheleWrite = useCallback(() => {
    setTheleOpen(false);
    setWriteOpen(true);
  }, []);

  // Apply shared filters to highlight list (same logic as the All feed — see kudos-filter.ts)
  const filteredHighlight = useMemo(
    () => filterKudos(highlightEntries, { hashtag: hashtagFilter, dept: deptFilter, query }),
    [highlightEntries, query, hashtagFilter, deptFilter],
  );

  // Derived filter option labels for KudosHighlight dropdowns
  const hashtagLabels = useMemo(() => hashtags.map((h) => h.label), [hashtags]);
  const deptCodes = useMemo(() => departments.map((d) => d.code), [departments]);

  return (
    <>
      {/* F011 Secret Box trigger chip — real count from DB */}
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "0 16px 8px" }}>
        <button
          onClick={() => setSecretBoxOpen(true)}
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: "13px",
            fontWeight: 700,
            color: "rgba(255,234,158,1)",
            background: "rgba(255,234,158,0.10)",
            border: "1px solid rgba(255,234,158,0.30)",
            borderRadius: "20px",
            padding: "6px 16px",
            cursor: "pointer",
            letterSpacing: "0.03em",
          }}
        >
          Secret Box ({boxCount})
        </button>
      </div>

      {/* F011 Secret Box modal — initialCount from DB */}
      <SecretBoxModal
        open={secretBoxOpen}
        onClose={() => setSecretBoxOpen(false)}
        initialCount={boxCount}
      />

      {/* A.1 Compose bar — pencil pill opens Write Kudo modal; Sunner search drives query */}
      <KudosComposeBar
        query={query}
        onQueryChange={setQuery}
        onOpenWrite={() => setWriteOpen(true)}
      />

      {/* F006 Write Kudo modal — catalog data from DB; onSubmitted closes + feed revalidates */}
      <WriteKudoModal
        open={writeOpen}
        onClose={() => setWriteOpen(false)}
        recipients={recipients}
        hashtags={hashtags}
        onSubmitted={() => setWriteOpen(false)}
      />

      {/* F010 Thể lệ modal — onWrite closes this and opens the single Write modal above */}
      <TheLeModal
        open={theleOpen}
        onClose={() => setTheleOpen(false)}
        onWrite={handleTheleWrite}
      />

      {/* F009 FAB — reuses this shell's writeOpen state (EC-2: single modal on /sun-kudos) */}
      <FabButton onWrite={() => setWriteOpen(true)} onThele={() => setTheleOpen(true)} />

      {/* B — Highlight Kudos carousel */}
      <KudosHighlight
        entries={filteredHighlight}
        hashtagFilter={hashtagFilter}
        deptFilter={deptFilter}
        onHashtagChange={setHashtagFilter}
        onDeptChange={setDeptFilter}
        hashtagOptions={hashtagLabels}
        deptOptions={deptCodes}
      />

      {/* B.6/B.7 — Spotlight Board — presentational, not backed by DB this pass */}
      <KudosSpotlight />

      {/* C + D — All Kudos feed + sidebar.
          Note: Highlight receives a pre-filtered list (above); All receives the raw list +
          the filter inputs and applies the SAME filterKudos() internally. Both paths share
          kudos-filter.ts, so results stay consistent. */}
      <KudosAll
        entries={allEntries}
        hashtagFilter={hashtagFilter}
        deptFilter={deptFilter}
        query={query}
        stats={stats}
      />
    </>
  );
}
