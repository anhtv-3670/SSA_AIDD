"use client";

// Image local-preview — design node mms_F_Frame 537 (I520:11647;520:9896).
// Thumbnails: 80x80px, border #998C5F, radius 18px, white bg.
// Delete button: 20x20px red circle (bg #D4271D) top-right corner.
// "+ Image / Tối đa 5" button: same style as hashtag add button (border #998C5F, radius 8px).
// EC-6: hide "+ Image" at 5; restore on remove.
// EC-7: enforced by hiding the button (user can't click what isn't there).
// EC-8: reject non-jpg/png with an error message.
// Object URLs revoked in effect cleanup on remove and on unmount.

import { useRef, useEffect, useCallback } from "react";
import { WriteKudoImageThumb } from "./write-kudo-image-thumb";
import { BASE_FONT, ERROR_TEXT } from "./write-kudo-styles";

export interface ImagePreview {
  id: string;
  url: string;
  name: string;
}

interface WriteKudoImagesProps {
  images: ImagePreview[];
  onAdd: (previews: ImagePreview[]) => void;
  onRemove: (id: string) => void;
  formatError?: string;
  onFormatError: (msg: string | undefined) => void;
}

const MAX_IMAGES = 5;
const ACCEPTED_TYPES = ["image/jpeg", "image/png"];

export function WriteKudoImages({ images, onAdd, onRemove, formatError, onFormatError }: WriteKudoImagesProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Track URLs created here so we can revoke them on unmount
  const ownedUrls = useRef<Set<string>>(new Set());

  // Revoke all owned URLs when the component unmounts
  useEffect(() => {
    const urls = ownedUrls.current;
    return () => {
      urls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    // Reset input so the same file can be re-added after removal
    e.target.value = "";

    const invalid = files.find((f) => !ACCEPTED_TYPES.includes(f.type));
    if (invalid) {
      // EC-8: reject entire selection on any invalid type
      onFormatError("Chỉ hỗ trợ ảnh định dạng JPG hoặc PNG");
      return;
    }
    onFormatError(undefined);

    const remaining = MAX_IMAGES - images.length;
    const toAdd = files.slice(0, remaining);

    const previews: ImagePreview[] = toAdd.map((file) => {
      const url = URL.createObjectURL(file);
      ownedUrls.current.add(url);
      return { id: `img-${Date.now()}-${Math.random().toString(36).slice(2)}`, url, name: file.name };
    });

    if (previews.length > 0) onAdd(previews);
  }, [images.length, onAdd, onFormatError]);

  const handleRemove = useCallback((id: string, url: string) => {
    URL.revokeObjectURL(url);
    ownedUrls.current.delete(url);
    onRemove(id);
  }, [onRemove]);

  const atMax = images.length >= MAX_IMAGES;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center" }}>
        {/* Existing thumbnails */}
        {images.map((img) => (
          <WriteKudoImageThumb key={img.id} image={img} onRemove={handleRemove} />
        ))}

        {/* "+ Image" button — hidden at max (EC-6/EC-7) */}
        {!atMax && (
          <>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Thêm ảnh"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "2px",
                padding: "4px 8px",
                border: "1px solid #998C5F",
                borderRadius: "8px",
                background: "#FFF",
                cursor: "pointer",
                minWidth: "80px",
                height: "48px",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M8 3v10M3 8h10" stroke="#00101A" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span style={{ ...BASE_FONT, fontSize: "11px", lineHeight: "16px", letterSpacing: "0.5px", color: "#00101A" }}>
                  Image
                </span>
              </span>
              <span style={{ ...BASE_FONT, fontSize: "11px", lineHeight: "16px", letterSpacing: "0.5px", color: "#999" }}>
                Tối đa {MAX_IMAGES}
              </span>
            </button>
            {/* Hidden file input — accept jpg/png only, multiple */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg"
              multiple
              onChange={handleFileChange}
              style={{ display: "none" }}
              aria-hidden="true"
              tabIndex={-1}
            />
          </>
        )}
      </div>

      {/* EC-8 format error */}
      {formatError && (
        <p role="alert" style={ERROR_TEXT}>
          {formatError}
        </p>
      )}
    </div>
  );
}
