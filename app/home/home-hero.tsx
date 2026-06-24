import Image from "next/image";

// Authoritative node data:
// Cover overlay (2167:9029): linear-gradient(12deg,#00101A 23.7%,rgba(0,18,29,.46) 38.34%,rgba(0,19,32,0) 48.92%)
// Frame 487 (2167:9031): col gap 40px, starts y=184 inside Bìa
// "Comming soon" (2167:9036): Montserrat 700 24px white (typo preserved from design data)
// Countdown (2167:9037): row gap 40px; labels DAYS/HOURS/MINUTES Montserrat 700 24px white
// Thời gian label: white 16px; value #FFEA9E 24px — Địa điểm same pattern
// Livestream note: Montserrat 700 16px white letterSpacing 0.5px
// CTA primary (2167:9063): 276x60px bg #FFEA9E radius 8px text #00101A Montserrat 700 22px
// CTA secondary (2167:9064): bg rgba(255,234,158,.10) border #998C5F text white 22px radius 8px

const COUNTDOWN_UNITS = [
  { value: "00", label: "DAYS" },
  { value: "00", label: "HOURS" },
  { value: "00", label: "MINUTES" },
] as const;

/** Single digit block used inside countdown display. */
function DigitBox({ digit }: { digit: string }) {
  return (
    <div
      className="flex items-center justify-center"
      style={{
        // RECONSTRUCTED: digit cell background approximated from dark base
        background: "linear-gradient(180deg,rgba(255,255,255,.12) 0%,rgba(255,255,255,.06) 100%)",
        border: "1px solid rgba(255,255,255,.15)",
        borderRadius: "8px",
        width: "48px",
        height: "64px",
        fontFamily: "Montserrat, sans-serif",
        fontSize: "48px",
        fontWeight: 700,
        lineHeight: 1,
        color: "#FFFFFF",
      }}
    >
      {digit}
    </div>
  );
}

export function HomeHero() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ minHeight: "100vh", backgroundColor: "#00101A" }}
      aria-label="Sun* Summit Awards 2026 – Root Further hero"
    >
      {/* RECONSTRUCTED: MM_MEDIA_Keyvisual BG (2167:9028) is a 1512x1392 raster swirl.
          Cropped from .momorph-tmp/home-design.png into public/home-saa/hero-swirl.png.
          Positioned right-top to match design composition. */}
      <div className="absolute inset-0" style={{ zIndex: 0 }} aria-hidden="true">
        <Image
          src="/home-saa/hero-swirl.png"
          alt=""
          fill
          className="object-cover object-right-top"
          priority
        />
      </div>

      {/* Cover gradient overlay — authoritative from node 2167:9029 */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(12deg,#00101A 23.7%,rgba(0,18,29,.46) 38.34%,rgba(0,19,32,.00) 48.92%)",
          zIndex: 1,
        }}
        aria-hidden="true"
      />

      {/* Content column — Frame 487: gap 40px, starts 184px below header (header=80px → pt=264px) */}
      <div
        className="relative mx-auto flex flex-col"
        style={{ maxWidth: "1224px", padding: "264px 0 96px", gap: "40px", zIndex: 2 }}
      >
        {/* ROOT FURTHER hero title (Frame 482 / MM_MEDIA_Root Further Logo 2788:12911, 451x200px)
            RECONSTRUCTED: raster logo unavailable — Montserrat styled text */}
        <div style={{ width: "451px" }} aria-label="ROOT FURTHER">
          <div style={{ fontFamily: "Montserrat, sans-serif", lineHeight: 0.9 }}>
            <span style={{ display: "block", fontSize: "clamp(72px,10vw,120px)", fontWeight: 900, color: "#FFFFFF", letterSpacing: "-2px" }}>
              ROOT
            </span>
            <span style={{ display: "block", fontSize: "clamp(72px,10vw,120px)", fontWeight: 900, color: "#FFEA9E", letterSpacing: "-2px" }}>
              FURTHER
            </span>
          </div>
        </div>

        {/* Frame 523 — countdown + event info, col gap 16px */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* mms_B1_Countdown */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "24px", fontWeight: 700, lineHeight: "32px", color: "#FFFFFF", margin: 0 }}>
              Comming soon
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
              {COUNTDOWN_UNITS.map(({ value, label }) => (
                <div key={label} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div style={{ display: "flex", gap: "14px" }}>
                    {value.split("").map((d, i) => <DigitBox key={i} digit={d} />)}
                  </div>
                  <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "24px", fontWeight: 700, lineHeight: "32px", color: "#FFFFFF" }}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* mms_B2_Thông tin sự kiện */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "60px" }}>
              <span>
                <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "16px", fontWeight: 700, letterSpacing: ".15px", color: "#FFFFFF" }}>Thời gian: </span>
                <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "24px", fontWeight: 700, color: "#FFEA9E" }}>26/12/2025</span>
              </span>
              <span>
                <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "16px", fontWeight: 700, letterSpacing: ".15px", color: "#FFFFFF" }}>Địa điểm: </span>
                <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "24px", fontWeight: 700, color: "#FFEA9E" }}>Âu Cơ Art Center</span>
              </span>
            </div>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "16px", fontWeight: 700, lineHeight: "24px", letterSpacing: ".5px", color: "#FFFFFF", margin: 0 }}>
              Tường thuật trực tiếp qua sóng Livestream
            </p>
          </div>
        </div>

        {/* mms_B3_Call-To-Action — row gap 40px */}
        <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
          {/* Primary — bg #FFEA9E, text #00101A, 276x60px, radius 8px, Montserrat 700 22px */}
          <button
            type="button"
            style={{ width: "276px", height: "60px", backgroundColor: "#FFEA9E", borderRadius: "8px", border: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "16px 24px", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontSize: "22px", fontWeight: 700, lineHeight: "28px", color: "#00101A" }}
          >
            ABOUT AWARDS
            {/* RECONSTRUCTED: arrow-up icon (raster unavailable) */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M7 17L17 7M17 7H7M17 7V17" stroke="#00101A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Secondary — bg rgba(255,234,158,.10) border #998C5F text white radius 8px */}
          <button
            type="button"
            style={{ height: "60px", backgroundColor: "rgba(255,234,158,.10)", borderRadius: "8px", border: "1px solid #998C5F", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "16px 24px", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontSize: "22px", fontWeight: 700, lineHeight: "28px", color: "#FFFFFF" }}
          >
            ABOUT KUDOS
            {/* RECONSTRUCTED: arrow-up icon (raster unavailable) */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M7 17L17 7M17 7H7M17 7V17" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
