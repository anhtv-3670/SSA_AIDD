// Authoritative node data — mms_3_Keyvisual (313:8437):
// Group containing image 20 (2167:5138) — a full-bleed raster background.
// Cover (313:8439): RECTANGLE behind everything, dark fill #00101A.
// KV section (313:8450): 1152×150px, gap 40px — contains MM_MEDIA_Root Further Logo (2789:12915)
//   338×150px raster logo, positioned left at x=144.
// REAL logo: ROOT FURTHER raster cropped from the frame render → public/saa-2025/hero-root-further.png.
// RECONSTRUCTED: full-bleed keyvisual swirl bg still unavailable (media node null);
//   approximated as a radial gold-tinted glow on the dark base.
//   "Sun* Annual Award 2025" subtitle: from node 313:8454 (Montserrat 700 24px white)

import Image from "next/image";

export function AwardKeyvisual() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ minHeight: "500px", backgroundColor: "#00101A" }}
      aria-label="Keyvisual Sun* Annual Award 2025"
    >
      {/* RECONSTRUCTED: keyvisual background swirl — raster unavailable.
          Approximated as a radial gold-tinted glow on the dark base,
          positioned top-right to match typical Figma cover composition. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 80% at 80% 20%, rgba(250,226,135,0.12) 0%, rgba(0,16,26,0) 70%)",
          zIndex: 0,
        }}
        aria-hidden="true"
      />

      {/* Cover gradient overlay — mirrors home-hero node 2167:9029 */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(12deg,#00101A 23.7%,rgba(0,18,29,.46) 38.34%,rgba(0,19,32,.00) 48.92%)",
          zIndex: 1,
        }}
        aria-hidden="true"
      />

      {/* Content — KV frame: padding 96px 144px, starts at y=88 (header height) */}
      <div
        className="relative"
        style={{
          padding: "184px 144px 64px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          zIndex: 2,
        }}
      >
        {/* MM_MEDIA_Root Further Logo (2789:12915) — 338×150px REAL raster
            cropped from the frame render → public/saa-2025/hero-root-further.png */}
        <Image
          src="/saa-2025/hero-root-further.png"
          alt="ROOT FURTHER"
          width={338}
          height={150}
          priority
          style={{ width: "338px", height: "auto" }}
        />

        {/* "Sun* Annual Awards 2025" — node 313:8454: Montserrat 700 24px white */}
        <p
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: "24px",
            fontWeight: 700,
            lineHeight: "32px",
            color: "#FFFFFF",
            margin: 0,
          }}
        >
          Sun* Annual Awards 2025
        </p>
      </div>
    </section>
  );
}
