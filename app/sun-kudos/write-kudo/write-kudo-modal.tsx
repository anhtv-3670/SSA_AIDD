"use client";

// Modal orchestrator — open/close, form state, submit, Escape + overlay close, toast.
// Design: cream card #FFF8E1, 752px wide, 40px padding, radius 24px, centered on dark overlay.
// Toast pattern: useRef timer + clearTimeout in effect cleanup (copied from kudos-card.tsx).
// React-Compiler safe: functional setState, no setState-in-effect, refs for timers.

import { useState, useEffect, useRef, useCallback, useTransition } from "react";
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
import { submitKudo } from "./write-kudo-actions";
import type { HashtagOption } from "@/lib/data/catalog-queries";

/** Shape consumed by the recipient autocomplete. */
export interface RecipientOption {
  id: string;
  name: string;
  dept: string;
  initial: string;
}

interface WriteKudoModalProps {
  open: boolean;
  onClose: () => void;
  /** Recipients from the DB profiles table (exclude self handled server-side). */
  recipients: RecipientOption[];
  /** Hashtag catalog from DB. */
  hashtags: HashtagOption[];
  /** Called after a successful submit so the shell can take any extra action. */
  onSubmitted?: () => void;
}

const EMPTY_FORM = {
  recipientId: "",
  recipientName: "",
  danhHieu: "",
  content: "",
  hashtagIds: [] as number[],
  hashtagLabels: [] as string[],
  images: [] as ImagePreview[],
  anonymous: false,
  anonymousName: "",
  imageFormatError: undefined as string | undefined,
};

export function WriteKudoModal({
  open,
  onClose,
  recipients,
  hashtags,
  onSubmitted,
}: WriteKudoModalProps) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<WriteKudoErrors>({});
  const [toastVisible, setToastVisible] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClose = useCallback(() => {
    setForm(EMPTY_FORM);
    setErrors({});
    setSubmitError(null);
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
      if (e.key === "Escape") handleClose();
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

  // M-4: return focus to the element that opened the modal (WCAG 2.4.3).
  const previouslyFocused = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (open) {
      previouslyFocused.current = document.activeElement as HTMLElement | null;
    } else {
      previouslyFocused.current?.focus?.();
    }
  }, [open]);

  // Derived: Gửi is disabled until required fields are filled (EC-12).
  const isSubmittable =
    form.recipientId.trim() !== "" &&
    form.danhHieu.trim() !== "" &&
    form.content.trim() !== "" &&
    form.hashtagIds.length >= 1 &&
    !isPending;

  const handleSubmit = useCallback(() => {
    const result = validateWriteKudo({
      recipient: form.recipientName,
      danhHieu: form.danhHieu,
      content: form.content,
      hashtags: form.hashtagLabels,
    });
    if (!result.isValid) {
      setErrors(result.errors);
      return;
    }
    setErrors({});
    setSubmitError(null);

    // Extract File objects from previews for upload
    const imageFiles = form.images
      .map((p) => p.file)
      .filter((f): f is File => f instanceof File);

    startTransition(async () => {
      try {
        await submitKudo(
          {
            receiverId: form.recipientId,
            message: form.content,
            hashtagIds: form.hashtagIds,
            isAnonymous: form.anonymous,
            anonymousName: form.anonymous ? form.anonymousName : undefined,
            danhHieu: form.danhHieu,
          },
          imageFiles,
        );
        // Success: show toast, reset form, close
        setToastVisible(true);
        if (toastTimer.current) clearTimeout(toastTimer.current);
        toastTimer.current = setTimeout(() => setToastVisible(false), 2500);
        setForm(EMPTY_FORM);
        onSubmitted?.();
        onClose();
      } catch (err) {
        setSubmitError(
          err instanceof Error ? err.message : "Đã có lỗi xảy ra. Vui lòng thử lại.",
        );
      }
    });
  }, [form, onClose, onSubmitted]);

  return (
    <>
      {open && (
        <WriteKudoDialogShell onOverlayClick={handleClose}>
          {/* B — Người nhận */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <FieldLabel text="Người nhận" required />
            <WriteKudoRecipient
              value={form.recipientName}
              onSelect={(id, name) =>
                setForm((f) => ({ ...f, recipientId: id, recipientName: name }))
              }
              recipients={recipients}
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
              selected={form.hashtagLabels}
              onChange={(labels, ids) =>
                setForm((f) => ({ ...f, hashtagLabels: labels, hashtagIds: ids }))
              }
              options={hashtags}
              error={errors.hashtags}
            />
          </div>

          {/* F — Image */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <FieldLabel text="Image" />
            <WriteKudoImages
              images={form.images}
              onAdd={(previews) =>
                setForm((f) => ({ ...f, images: [...f.images, ...previews] }))
              }
              onRemove={(id) =>
                setForm((f) => ({
                  ...f,
                  images: f.images.filter((img) => img.id !== id),
                  imageFormatError: undefined,
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

          {/* Submit error */}
          {submitError && (
            <p
              role="alert"
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "13px",
                fontWeight: 700,
                color: "#D4271D",
                margin: 0,
              }}
            >
              {submitError}
            </p>
          )}

          {/* H — Footer buttons */}
          <WriteKudoFooter
            submittable={isSubmittable}
            onCancel={handleClose}
            onSubmit={handleSubmit}
          />
        </WriteKudoDialogShell>
      )}

      {/* Success toast (EC-12) — rendered regardless of `open` so it survives modal close */}
      {toastVisible && <WriteKudoToast message="Đã gửi Kudos!" />}
    </>
  );
}
