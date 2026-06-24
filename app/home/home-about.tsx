// Authoritative node data — Frame 486 (3204:10152):
// 1152x1219px, padding 120px 104px, gap 32px, border-radius 8px, col centered
// Group 434 (3204:10153): ROOT/FURTHER title — MM_MEDIA_Root Text + MM_MEDIA_Further Text
//   RECONSTRUCTED: both rasters unavailable; styled text in Montserrat
// mms_B4_content (5001:14827):
//   3204:10156 — para 1: Montserrat 700 24px white justified
//   3204:10161 — quote:  Montserrat 700 20px white center, color #FFF
//   3204:10162 — para 2: Montserrat 700 24px white justified

const BODY_P1 = `Đứng trước bối cảnh thay đổi như vũ bão của thời đại AI và yêu cầu ngày càng cao từ khách hàng, Sun* lựa chọn chiến lược đa dạng hóa năng lực để không chỉ nỗ lực trở thành tinh anh trong lĩnh vực của mình, mà còn hướng đến một cái đích cao hơn, nơi mọi Sunner đều là "problem-solver" - chuyên gia trong việc giải quyết mọi vấn đề, tìm lời giải cho mọi bài toán của dự án, khách hàng và xã hội.`;

const BODY_P2 = `Lấy cảm hứng từ sự đa dạng năng lực, khả năng phát triển linh hoạt cùng tinh thần đào sâu để bứt phá trong kỷ nguyên AI, "Root Further" đã được chọn để trở thành chủ đề chính thức của Lễ trao giải Sun* Annual Awards 2025.`;

const BODY_QUOTE = `"A tree with deep roots fears no storm"\n(Cây sâu bén rễ, bão giông chẳng nề - Ngạn ngữ Anh)`;

const BODY_P3 = `Trước giông bão, chỉ những tán cây có bộ rễ đủ mạnh mới có thể trụ vững. Một tổ chức với những cá nhân tự tin vào năng lực đa dạng, sẵn sàng kiến tạo và đón nhận thử thách, làm chủ sự thay đổi là tổ chức không chỉ vững vàng trước biến động, mà còn khai thác được mọi lợi thế, chinh phục các thách thức của thời cuộc.`;

export function HomeAbout() {
  return (
    <section
      className="mx-auto w-full"
      style={{
        maxWidth: "1152px",
        borderRadius: "8px",
        padding: "120px 104px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "32px",
        // RECONSTRUCTED: dark panel from page base colour — no fill node found
        background: "rgba(255,255,255,0.03)",
      }}
      aria-label="ROOT FURTHER — about"
    >
      {/* Group 434 — ROOT / FURTHER stacked title (290x134px)
          RECONSTRUCTED: MM_MEDIA_Root Text + MM_MEDIA_Further Text rasters unavailable */}
      <div style={{ width: "290px", height: "134px" }} aria-label="ROOT FURTHER">
        <div style={{ fontFamily: "Montserrat, sans-serif", lineHeight: 0.9 }}>
          <span
            style={{
              display: "block",
              fontSize: "80px",
              fontWeight: 900,
              color: "#FFFFFF",
              letterSpacing: "-2px",
            }}
          >
            ROOT
          </span>
          <span
            style={{
              display: "block",
              fontSize: "80px",
              fontWeight: 900,
              color: "#FFEA9E",
              letterSpacing: "-2px",
            }}
          >
            FURTHER
          </span>
        </div>
      </div>

      {/* mms_B4_content — three text blocks, gap 32px */}
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "32px" }}>
        {/* Paragraphs 1 + 2 — Montserrat 700 24px white justified */}
        <p
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: "24px",
            fontWeight: 700,
            lineHeight: "32px",
            color: "#FFFFFF",
            textAlign: "justify",
            margin: 0,
          }}
        >
          {BODY_P1}
          <br />
          <br />
          {BODY_P2}
        </p>

        {/* Quote — Montserrat 700 20px #FFF center */}
        <blockquote
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: "20px",
            fontWeight: 700,
            lineHeight: "32px",
            color: "#FFFFFF",
            textAlign: "center",
            margin: 0,
            padding: 0,
            border: "none",
            whiteSpace: "pre-line",
          }}
        >
          {BODY_QUOTE}
        </blockquote>

        {/* Paragraph 3 — Montserrat 700 24px white justified */}
        <p
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: "24px",
            fontWeight: 700,
            lineHeight: "32px",
            color: "#FFFFFF",
            textAlign: "justify",
            margin: 0,
          }}
        >
          {BODY_P3}
        </p>
      </div>
    </section>
  );
}
