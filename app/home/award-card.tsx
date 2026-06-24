// Authoritative node data — mms_C2.1_Top Talent Award (2167:9075):
// Card: col, gap 24px, width 336px
// Circle badge: 336x336px, box-shadow 0 4px 4px rgba(0,0,0,.25) 0 0 6px #FAE287
//   mix-blend-mode: screen
// Name: Montserrat 400 24px #FFEA9E (I2167:9075;214:1021)
// Description: Montserrat 400 16px white letterSpacing 0.5px (I2167:9075;214:1022)
// "Chi tiết" btn: Montserrat 500 16px white, gap 4px, padding 16px 0 (I2167:9075;214:1023)

export interface AwardCardProps {
  name: string;
  description: string;
  /** Authoritative glow color from box-shadow — always #FAE287 */
  ringColor: string;
}

export function AwardCard({ name, description, ringColor }: AwardCardProps) {
  return (
    <article
      className="flex flex-col"
      style={{ width: "336px", gap: "24px" }}
      aria-label={`${name} award`}
    >
      {/* Award circle — 336x336px
          GOLD-RECONSTRUCTED: MM_MEDIA_Award BG raster unavailable.
          Design shows bright gold medallions — reconstructed as a radial gold gradient
          (highlight #FFEA9E → mid #E6C45C → deep #8A6A22) with outer gold glow ring #FAE287.
          mix-blend-mode removed so the full gold shows on the dark page background. */}
      <div
        className="flex items-center justify-center"
        style={{
          width: "336px",
          height: "336px",
          borderRadius: "50%",
          // Authoritative glow from mms_C2.1.1_Picture-Award box-shadow
          boxShadow: `0 4px 4px 0 rgba(0, 0, 0, 0.25), 0 0 24px 4px ${ringColor}, 0 0 6px 0 ${ringColor}`,
          // Gold medallion: bright highlight center → mid gold → deep gold rim
          background:
            "radial-gradient(circle at 40% 35%, #FFEA9E 0%, #E6C45C 35%, #C9A020 60%, #8A6A22 82%, #4A3610 100%)",
          border: `3px solid #E6C45C`,
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

      {/* Card text — Frame 490, gap 4px */}
      <div className="flex flex-col" style={{ gap: "4px" }}>
        {/* Name — Montserrat 400 24px #FFEA9E */}
        <h3
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: "24px",
            fontWeight: 400,
            lineHeight: "32px",
            color: "#FFEA9E",
            margin: 0,
          }}
        >
          {name}
        </h3>

        {/* Description — Montserrat 400 16px white, letterSpacing 0.5px */}
        <p
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: "16px",
            fontWeight: 400,
            lineHeight: "24px",
            letterSpacing: "0.5px",
            color: "#FFFFFF",
            margin: 0,
          }}
        >
          {description}
        </p>

        {/* "Chi tiết" — Montserrat 500 16px white, padding 16px 0 */}
        <a
          href="#"
          className="flex items-center"
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: "16px",
            fontWeight: 500,
            lineHeight: "24px",
            letterSpacing: "0.15px",
            color: "#FFFFFF",
            textDecoration: "none",
            gap: "4px",
            padding: "16px 0",
          }}
        >
          Chi tiết
          {/* RECONSTRUCTED: arrow-up icon (raster unavailable) */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M7 17L17 7M17 7H7M17 7V17"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>
    </article>
  );
}
