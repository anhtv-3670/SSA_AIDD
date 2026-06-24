import Image from "next/image";

// Gold medallion — 336×336px
// Authoritative: mms_D.1.1_Picture-Award (I313:8467;214:2525), thumb-bg border-radius 24px,
//   border 0.955px solid #FFEA9E, outer glow 0 0 6px #FAE287.
// REAL asset: mm_media_Award-Thumb-Background rasters cropped from the frame render →
//   public/saa-2025/medallion-*.png. Gold-gradient reconstruction kept as fallback when no image.

interface AwardMedallionProps {
  name: string;
  /** Authoritative glow colour — always #FAE287 */
  ringColor: string;
  /** Real medallion raster (public path). When set, renders the art instead of the gradient. */
  image?: string;
}

export function AwardMedallion({ name, ringColor, image }: AwardMedallionProps) {
  if (image) {
    return (
      <Image
        src={image}
        alt={`Huy hiệu giải thưởng ${name}`}
        width={336}
        height={336}
        style={{
          flexShrink: 0,
          borderRadius: "24px",
          boxShadow: `0 4px 4px 0 rgba(0,0,0,0.25), 0 0 6px 0 ${ringColor}`,
        }}
      />
    );
  }

  return (
    <div
      className="flex items-center justify-center"
      style={{
        width: "336px",
        height: "336px",
        flexShrink: 0,
        borderRadius: "50%",
        boxShadow: `0 4px 4px 0 rgba(0,0,0,0.25), 0 0 24px 4px ${ringColor}, 0 0 6px 0 ${ringColor}`,
        background:
          "radial-gradient(circle at 40% 35%, #FFEA9E 0%, #E6C45C 35%, #C9A020 60%, #8A6A22 82%, #4A3610 100%)",
        border: "3px solid #E6C45C",
      }}
      aria-hidden="true"
    >
      <span
        style={{
          fontFamily: "Montserrat, sans-serif",
          fontSize: "64px",
          fontWeight: 900,
          color: "#2A1A00",
          opacity: 0.45,
          userSelect: "none",
        }}
      >
        {name.charAt(0)}
      </span>
    </div>
  );
}
