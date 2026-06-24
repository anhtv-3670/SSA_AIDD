import Image from "next/image";

// Authoritative: Keyvisual (2940:13432) — 1440x512px
// BG: MM_MEDIA_KV Background → reuse /home-saa/hero-swirl.png
// Cover: linear-gradient(25deg, #00101A 14.74%, rgba(0,19,32,0) 47.8%)
// A_KV Kudos (2940:13437): col gap 10px, 1152px wide at 144px padding
// "Hệ thống ghi nhận và cảm ơn": Montserrat 700 36px #FFEA9E
// KUDOS logo: reuse /saa-2025/kudos-logo.svg (scaled large, ~593x104px)

export function KudosHero() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: "512px", backgroundColor: "#00101A" }}
      aria-label="Sun* Kudos Live Board hero"
    >
      {/* BG: reuse home swirl — positioned full cover */}
      <div className="absolute inset-0" style={{ zIndex: 0 }} aria-hidden="true">
        <Image
          src="/home-saa/hero-swirl.png"
          alt=""
          fill
          className="object-cover object-center"
          priority
        />
      </div>

      {/* Cover overlay — authoritative gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(25deg, #00101A 14.74%, rgba(0,19,32,0.00) 47.8%)",
          zIndex: 1,
        }}
        aria-hidden="true"
      />

      {/* Content — padded 144px sides, col gap 10px, positioned bottom */}
      <div
        className="relative"
        style={{
          padding: "0 144px",
          paddingTop: "184px",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {/* "Hệ thống ghi nhận và cảm ơn" — Montserrat 700 36px #FFEA9E */}
        <p
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: "36px",
            fontWeight: 700,
            lineHeight: "44px",
            color: "#FFEA9E",
            margin: 0,
          }}
        >
          Hệ thống ghi nhận và cảm ơn
        </p>

        {/* KUDOS wordmark — reuse SVG at ~593x104px scale */}
        <div style={{ width: "593px", height: "104px", position: "relative" }}>
          <Image
            src="/saa-2025/kudos-logo.svg"
            alt="KUDOS"
            fill
            style={{ objectFit: "contain", objectPosition: "left center" }}
          />
        </div>
      </div>
    </section>
  );
}
