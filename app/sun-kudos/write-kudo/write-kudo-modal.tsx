"use client";

// Modal orchestrator — open/close, form state, submit, Escape + overlay close, toast.
// Design: cream card #FFF8E1, 752px wide, 40px padding, radius 24px, centered on dark overlay.
// Toast pattern: useRef timer + clearTimeout in effect cleanup (copied from kudos-card.tsx).
// React-Compiler safe: functional setState, no setState-in-effect, refs for timers.

import { useState, useEffect, useRef, useCallback } from "react";
import type { ImagePreview } from "./write-kudo-images";
import { WriteKudoRecipient } from "./write-kudo-recipient";
import { WriteKudoEditor } from "./write-kudo-editor";
import { WriteKudoHashtags } from "./write-kudo-hashtags";
import { WriteKudoImages } from "./write-kudo-images";
import { WriteKudoDanhHieu } from "./write-kudo-danh-hieu";
import { WriteKudoAnonymous } from "./write-kudo-anonymous";
import { WriteKudoFooter } from "./write-kudo-footer";
import { WriteKudoToast } from "./write-kudo-toast";
import { WriteKudoDialogShell } from "./write-kudo-dialog-shell";
import { FieldLabel } from "./write-kudo-field-label";
import { validateWriteKudo } from "./write-kudo-validation";
import type { WriteKudoErrors } from "./write-kudo-validation";

interface WriteKudoModalProps {
  open: boolean;
  onClose: () => void;
}

const EMPTY_FORM = {
  recipient: "",
  danhHieu: "",
  content: "",
  hashtags: [] as string[],
  images: [] as ImagePreview[],
  anonymous: false,
  anonymousName: "",
  imageFormatError: undefined as string | undefined,
};

export function WriteKudoModal({ open, onClose }: WriteKudoModalProps) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<WriteKudoErrors>({});
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClose = useCallback(() => {
    setForm(EMPTY_FORM);
    setErrors({});
    onClose();
  }, [onClose]);

  // Clean up toast timer on unmount
  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  // Escape key closes modal (EC-11)
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        handleClose();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, handleClose]);

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // M-4: return focus to the element that opened the modal (the compose-bar trigger)
  // when it closes — WCAG 2.4.3. Capture on open, restore on close.
  const previouslyFocused = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (open) {
      previouslyFocused.current = document.activeElement as HTMLElement | null;
    } else {
      previouslyFocused.current?.focus?.();
    }
  }, [open]);

  // Derived: Gửi is disabled until required fields are filled (EC-12).
  // Must mirror validateWriteKudo exactly (incl. danhHieu) so the button never enables
  // into a guaranteed validation error (H-2).
  const isSubmittable =
    form.recipient.trim() !== "" &&
    form.danhHieu.trim() !== "" &&
    form.content.trim() !== "" &&
    form.hashtags.length >= 1;

  const handleSubmit = useCallback(() => {
    const result = validateWriteKudo({
      recipient: form.recipient,
      danhHieu: form.danhHieu,
      content: form.content,
      hashtags: form.hashtags,
    });
    if (!result.isValid) {
      setErrors(result.errors);
      return;
    }
    setErrors({});
    // Valid: show toast + close + reset (EC-12)
    setToastVisible(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastVisible(false), 2500);
    setForm(EMPTY_FORM);
    onClose();
  }, [form, onClose]);

  // H-1: the toast must outlive the modal. On valid submit we close (open→false) AND show the
  // toast; render it OUTSIDE the open guard so it isn't unmounted before the user can read it.
  // (This component stays mounted across open/close — the shell always renders it.)
  return (
    <>
      {open && (
      <WriteKudoDialogShell onOverlayClick={handleClose}>
        {/* B — Người nhận */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <FieldLabel text="Người nhận" required />
          <WriteKudoRecipient
            value={form.recipient}
            onChange={(val) => setForm((f) => ({ ...f, recipient: val }))}
            error={errors.recipient}
          />
        </div>

        {/* Danh hiệu */}
        <WriteKudoDanhHieu
          value={form.danhHieu}
          onChange={(val) => setForm((f) => ({ ...f, danhHieu: val }))}
          error={errors.danhHieu}
        />

        {/* C/D — Editor (toolbar + textarea + helper) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <WriteKudoEditor
            value={form.content}
            onChange={(val) => setForm((f) => ({ ...f, content: val }))}
            error={errors.content}
          />
        </div>

        {/* E — Hashtag */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <FieldLabel text="Hashtag" required />
          <WriteKudoHashtags
            selected={form.hashtags}
            onChange={(tags) => setForm((f) => ({ ...f, hashtags: tags }))}
            error={errors.hashtags}
          />
        </div>

        {/* F — Image */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <FieldLabel text="Image" />
          <WriteKudoImages
            images={form.images}
            onAdd={(previews) => setForm((f) => ({ ...f, images: [...f.images, ...previews] }))}
            onRemove={(id) =>
              setForm((f) => ({
                ...f,
                images: f.images.filter((img) => img.id !== id),
                imageFormatError: undefined, // M-5: clear stale format error on remove
              }))
            }
            formatError={form.imageFormatError}
            onFormatError={(msg) => setForm((f) => ({ ...f, imageFormatError: msg }))}
          />
        </div>

        {/* G — Anonymous checkbox + name field */}
        <WriteKudoAnonymous
          anonymous={form.anonymous}
          anonymousName={form.anonymousName}
          onToggle={(checked) => setForm((f) => ({ ...f, anonymous: checked }))}
          onNameChange={(val) => setForm((f) => ({ ...f, anonymousName: val }))}
        />

        {/* H — Footer buttons */}
        <WriteKudoFooter submittable={isSubmittable} onCancel={handleClose} onSubmit={handleSubmit} />
      </WriteKudoDialogShell>
      )}

      {/* Success toast (EC-12) — rendered regardless of `open` so it survives modal close */}
      {toastVisible && <WriteKudoToast message="Đã gửi Kudos!" />}
    </>
  );
}
