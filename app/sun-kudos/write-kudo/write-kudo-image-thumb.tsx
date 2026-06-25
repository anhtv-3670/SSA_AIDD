"use client";

// Single image preview thumbnail (80x80) with a red corner delete button.

import type { ImagePreview } from "./write-kudo-images";

interface WriteKudoImageThumbProps {
  image: ImagePreview;
  onRemove: (id: string, url: string) => void;
}

export function WriteKudoImageThumb({ image, onRemove }: WriteKudoImageThumbProps) {
  return (
    <div
      style={{
        position: "relative",
        width: "80px",
        height: "80px",
        borderRadius: "18px",
        border: "1px solid #998C5F",
        background: "#FFF",
        flexShrink: 0,
        overflow: "visible",
      }}
    >
      {/* Preview image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.url}
        alt={image.name}
        style={{
          width: "80px",
          height: "80px",
          objectFit: "cover",
          borderRadius: "4px",
          border: "1px solid #FFEA9E",
          display: "block",
        }}
      />
      {/* Delete button — 20x20 red circle, top-right */}
      <button
        type="button"
        onClick={() => onRemove(image.id, image.url)}
        aria-label={`Xóa ảnh ${image.name}`}
        style={{
          position: "absolute",
          top: "-8px",
          right: "-8px",
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          background: "#D4271D",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
          zIndex: 1,
        }}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
          <path d="M1.5 1.5l7 7M8.5 1.5l-7 7" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
