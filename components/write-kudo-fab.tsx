"use client";

// Self-contained FAB + modal wrapper for pages that don't already own a WriteKudoModal.
// Used on: /home, /he-thong-giai, /profile
// NOT used on /sun-kudos — that page pre-fetches catalog in its RSC and passes via shell.
//
// Catalog data (recipients, hashtags) is fetched lazily on first modal open via a server
// action so pages stay propless — they render <WriteKudoFab/> with no props.
// React-Compiler safe: useState functional updater, no setState-in-effect body.

import { useState, useCallback } from "react";
import { FabButton } from "@/components/fab-button";
import { WriteKudoModal } from "@/app/sun-kudos/write-kudo/write-kudo-modal";
import { TheLeModal } from "@/app/the-le/the-le-modal";
import { fetchWriteCatalog } from "@/app/sun-kudos/write-kudo/write-kudo-catalog-actions";
import type { WriteCatalog } from "@/app/sun-kudos/write-kudo/write-kudo-catalog-actions";

export function WriteKudoFab() {
  const [writeOpen, setWriteOpen] = useState(false);
  const [theleOpen, setTheleOpen] = useState(false);
  const [catalog, setCatalog] = useState<WriteCatalog | null>(null);
  const [catalogLoading, setCatalogLoading] = useState(false);

  // Fetch catalog lazily on first open — subsequent opens reuse cached state.
  const openWrite = useCallback(async () => {
    if (!catalog && !catalogLoading) {
      setCatalogLoading(true);
      try {
        const data = await fetchWriteCatalog();
        setCatalog(data);
      } catch {
        // On catalog fetch failure fall back to empty lists — modal still renders
        setCatalog({ hashtags: [], departments: [], recipients: [] });
      } finally {
        setCatalogLoading(false);
      }
    }
    setWriteOpen(true);
  }, [catalog, catalogLoading]);

  // "Viết KUDOS" from inside Thể lệ: close Thể lệ, open Write modal.
  const handleTheleWrite = useCallback(() => {
    setTheleOpen(false);
    void openWrite();
  }, [openWrite]);

  return (
    <>
      <FabButton
        onWrite={() => void openWrite()}
        onThele={() => setTheleOpen(true)}
      />
      <TheLeModal
        open={theleOpen}
        onClose={() => setTheleOpen(false)}
        onWrite={handleTheleWrite}
      />
      <WriteKudoModal
        open={writeOpen}
        onClose={() => setWriteOpen(false)}
        recipients={catalog?.recipients ?? []}
        hashtags={catalog?.hashtags ?? []}
      />
    </>
  );
}
