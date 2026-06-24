import Image from "next/image";
import Link from "next/link";

// Authoritative node data — mms_D1_Sunkudos (3390:10349):
// Container: 1224x500px, col, gap 10px, centered
// SunKudos group (I3390:10349;313:8415): 1120x500px
// MM_MEDIA_Kudos Background (I335:12023;313:8416): REAL asset → public/saa-2025/kudos-bg.png
//   1152x500 dark panel (#0F0F0F) with gold curved streaks, radius 16px
// MM_MEDIA_Logo/Kudos (I335:12023;329:2948): REAL asset → public/saa-2025/kudos-logo.svg (383x74)
// mms_D2_Content (I3390:10349;313:8419): col, gap 32px, 457x408px
//   "Phong trào ghi nhận" — Montserrat 700 24px white
//   "Sun* Kudos" — Montserrat 700 57px #FFEA9E
//   body text — Montserrat 700 16px white justified, letterSpacing 0.5px
//   CTA button: bg #FFEA9E, 126x56px, radius 4px, dark label

const KUDOS_BODY =
  "ĐIỂM MỚI CỦA SAA 2025\nHoạt động ghi nhận và cảm ơn đồng nghiệp - lần đầu tiên được diễn ra dành cho tất cả Sunner. Hoạt động sẽ được triển khai vào tháng 11/2025, khuyến khích người Sun* chia sẻ những lời ghi nhận, cảm ơn đồng nghiệp trên hệ thống do BTC công bố. Đây sẽ là chất liệu để Hội đồng Heads tham khảo trong quá trình lựa chọn người đạt giải.";

export function SunKudosBanner() {
  return (
    <section
      className="w-full flex justify-center"
      aria-labelledby="kudos-heading"
    >
      {/* SunKudos card — 1120x500px, radius 16px. Real dark panel raster (gold streaks). */}
      <div
        style={{
          width: "100%",
          maxWidth: "1120px",
          minHeight: "500px",
          backgroundColor: "#0F0F0F",
          backgroundImage: "url('/saa-2025/kudos-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          borderRadius: "16px",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Left content — mms_D2_Content: 457px wide, gap 32px, padded from left */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "32px",
            width: "457px",
            padding: "46px 0 46px 64px",
            position: "relative",
            zIndex: 1,
            flexShrink: 0,
          }}
        >
          {/* Text block — Frame 494, gap 16px */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* "Phong trào ghi nhận" — Montserrat 700 24px white */}
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
              Phong trào ghi nhận
            </p>

            {/* "Sun* Kudos" — Montserrat 700 57px #FFEA9E, letterSpacing -0.25px */}
            <h2
              id="kudos-heading"
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "57px",
                fontWeight: 700,
                lineHeight: "64px",
                letterSpacing: "-0.25px",
                color: "#FFEA9E",
                margin: 0,
              }}
            >
              Sun* Kudos
            </h2>

            {/* Body — Montserrat 700 16px white, justified, letterSpacing 0.5px */}
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
                whiteSpace: "pre-line",
              }}
            >
              {KUDOS_BODY}
            </p>
          </div>

          {/* CTA — mms_D2.1_Button-IC: 126x56px, gold bg, dark label, radius 4px.
              Navigates to /sun-kudos (FR-12). Link → no JS error if route 404s. */}
          <Link
            href="/sun-kudos"
            className="flex items-center justify-center"
            style={{
              width: "126px",
              height: "56px",
              backgroundColor: "#FFEA9E",
              borderRadius: "4px",
              padding: "16px",
              gap: "8px",
              fontFamily: "Montserrat, sans-serif",
              fontSize: "16px",
              fontWeight: 700,
              lineHeight: "24px",
              color: "#1A0A00",
              textDecoration: "none",
            }}
          >
            Chi tiết
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M7 17L17 7M17 7H7M17 7V17"
                stroke="#1A0A00"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>

        {/* Right side — real KUDOS wordmark (383x74 SVG) */}
        <Image
          src="/saa-2025/kudos-logo.svg"
          alt="Sun* Kudos"
          width={383}
          height={74}
          style={{
            position: "absolute",
            right: "64px",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 1,
            height: "auto",
            maxWidth: "40%",
          }}
        />
      </div>
    </section>
  );
}
