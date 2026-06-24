// Authoritative node data — mms_7_Footer (5001:14800):
// width: 1512px, padding: 40px 90px, border-top: 1px solid #2E3940
// display flex, align-items center, justify-content space-between
// Left: Frame 488 — logo (69x64px) + nav links row (gap 80px)
//   Nav items: mms_7.2 plain, mms_7.3 bg rgba(255,234,158,0.10), mms_7.4 plain, mms_7.5 plain
//   All Montserrat 700 16px (inferred from button frames ~24px height)
// Right: "Bản quyền thuộc về Sun* © 2025" — Montserrat Alternates 700 16px white

const FOOTER_LINKS = [
  { label: "Award Information", highlighted: false },
  { label: "About Sun* Kudos", highlighted: true },
  { label: "Sun* Kudos", highlighted: false },
  { label: "Quy chế giải thưởng", highlighted: false },
];

export function SiteFooter() {
  return (
    <footer
      style={{
        width: "100%",
        // Authoritative: border-top 1px solid #2E3940, padding 40px 90px
        borderTop: "1px solid #2E3940",
        padding: "40px 90px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#00101A",
      }}
      role="contentinfo"
    >
      {/* Left: logo + nav links — Frame 488, gap 80px */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "80px",
        }}
      >
        {/* mms_7.1_LOGO — 69x64px
            RECONSTRUCTED: MM_MEDIA_Logo raster unavailable — text fallback */}
        <div
          style={{ width: "69px", height: "64px", display: "flex", alignItems: "center" }}
          aria-label="Sun* logo"
        >
          <span
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "18px",
              fontWeight: 900,
              color: "#FFFFFF",
            }}
          >
            Sun*
          </span>
        </div>

        {/* Nav links — Frame 476, gap 48px */}
        <nav aria-label="Footer navigation">
          <ul
            style={{
              display: "flex",
              alignItems: "center",
              gap: "48px",
              listStyle: "none",
              padding: 0,
              margin: 0,
            }}
          >
            {FOOTER_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href="#"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "16px",
                    // mms_7.3 has bg rgba(255,234,158,0.10) — highlighted variant
                    backgroundColor: link.highlighted
                      ? "rgba(255, 234, 158, 0.10)"
                      : "transparent",
                    borderRadius: link.highlighted ? "4px" : undefined,
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: "16px",
                    fontWeight: 700,
                    lineHeight: "24px",
                    color: "#FFFFFF",
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Right: copyright — Montserrat Alternates 700 16px white */}
      <p
        style={{
          fontFamily: "'Montserrat Alternates', Montserrat, sans-serif",
          fontSize: "16px",
          fontWeight: 700,
          lineHeight: "24px",
          color: "#FFFFFF",
          margin: 0,
          whiteSpace: "nowrap",
        }}
      >
        Bản quyền thuộc về Sun* © 2025
      </p>
    </footer>
  );
}
