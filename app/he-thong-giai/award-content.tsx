// Authoritative node data — mms_D.1.2_Content (I313:8467;214:2526):
// col, gap 32px, backdrop-filter blur(32px)
// content frame (I313:8467;214:2527): gap 24px
//   Frame 442: icon (MM_MEDIA_Target 24×24) + title Montserrat 700 24px #FFEA9E
//   description: Montserrat 700 16px white letterSpacing 0.5px textAlign justified
// Rectangle 8 divider: 1px rgba(46,57,64,1)
// "Số lượng giải thưởng:" Montserrat 700 24px #FFEA9E + quantity white
// Rectangle divider
// "Giá trị giải thưởng:" Montserrat 700 24px #FFEA9E + prizeValue Montserrat 700 14px white

import type { AwardDetail } from "./award-data";

type AwardContentProps = Pick<
  AwardDetail,
  "name" | "description" | "quantity" | "prizeValue"
> & {
  /** id for the title <h2> — matches the section's aria-labelledby */
  headingId: string;
};

/** Reconstructed target/crosshair icon — MM_MEDIA_Target raster unavailable */
function TargetIcon({ color = "#FFEA9E" }: { color?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" />
      <circle cx="12" cy="12" r="5" stroke={color} strokeWidth="1.5" />
      <circle cx="12" cy="12" r="1.5" fill={color} />
    </svg>
  );
}

/** Reconstructed diamond icon — MM_MEDIA_Diamond raster unavailable */
function DiamondIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <path
        d="M12 3L3 9l9 12 9-12-9-6z"
        stroke="#FFEA9E"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M3 9h18" stroke="#FFEA9E" strokeWidth="1.5" />
    </svg>
  );
}

function Divider() {
  return (
    <hr
      style={{ border: "none", borderTop: "1px solid rgba(46,57,64,1)", margin: 0 }}
    />
  );
}

export function AwardContent({
  name,
  description,
  quantity,
  prizeValue,
  headingId,
}: AwardContentProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "32px",
        flex: 1,
        backdropFilter: "blur(32px)",
      }}
    >
      {/* Title + description block */}
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Frame 442: icon + name */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <TargetIcon />
          <h2
            id={headingId}
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "24px",
              fontWeight: 700,
              lineHeight: "32px",
              color: "#FFEA9E",
              margin: 0,
            }}
          >
            {name}
          </h2>
        </div>

        {/* Description: Montserrat 700 16px white letterSpacing 0.5px justified */}
        <p
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: "16px",
            fontWeight: 700,
            lineHeight: "24px",
            letterSpacing: "0.5px",
            color: "#FFFFFF",
            textAlign: "justify",
            margin: 0,
          }}
        >
          {description}
        </p>
      </div>

      <Divider />

      {/* Quantity row */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <DiamondIcon />
        <p style={{ margin: 0 }}>
          <span
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "24px",
              fontWeight: 700,
              lineHeight: "32px",
              color: "#FFEA9E",
            }}
          >
            {"Số lượng giải thưởng: "}
          </span>
          <span
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "24px",
              fontWeight: 700,
              lineHeight: "32px",
              color: "#FFFFFF",
            }}
          >
            {quantity}
          </span>
        </p>
      </div>

      <Divider />

      {/* Prize value row */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <DiamondIcon />
        <p style={{ margin: 0 }}>
          <span
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "24px",
              fontWeight: 700,
              lineHeight: "32px",
              color: "#FFEA9E",
            }}
          >
            {"Giá trị giải thưởng: "}
          </span>
          <span
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "14px",
              fontWeight: 700,
              lineHeight: "20px",
              letterSpacing: "0.1px",
              color: "#FFFFFF",
            }}
          >
            {prizeValue}
          </span>
        </p>
      </div>
    </div>
  );
}
