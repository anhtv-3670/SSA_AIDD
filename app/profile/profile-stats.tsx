// Profile stats box — Section B (node 362:5073).
// Reuses F005 sidebar D.1 markup/tokens: border #998C5F, bg #00070C, radius 17px, padding 40px.
// Stats rows: label white 16px + value #FFEA9E 32px, divider rgba(46,57,64,1).
// "Mở Secret Box" button — disabled placeholder (EC-6).
// Server component — no interactivity.

// Aliased to avoid clashing with the exported ProfileStats component name below (M-1).
import type { ProfileStats as ProfileStatsData } from "./profile-data";

const FONT_BASE = {
  fontFamily: "Montserrat, sans-serif",
  fontWeight: 700,
} as const;

function StatRow({ label, value }: { label: string; value: number }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "8px",
        width: "100%",
        height: "40px",
      }}
    >
      <span style={{ ...FONT_BASE, fontSize: "16px", lineHeight: "24px", color: "#FFFFFF" }}>
        {label}
      </span>
      <span
        style={{
          ...FONT_BASE,
          fontSize: "32px",
          lineHeight: "40px",
          color: "#FFEA9E",
          flexShrink: 0,
        }}
      >
        {value}
      </span>
    </div>
  );
}

interface ProfileStatsProps {
  stats: ProfileStatsData;
}

export function ProfileStats({ stats }: ProfileStatsProps) {
  return (
    <section
      aria-label="Thống kê Kudos"
      style={{
        // Node 362:5073: 680px wide, centered
        width: "680px",
        margin: "0 auto",
        // Node 362:5074: border, bg, radius, padding 40px
        border: "1px solid #998C5F",
        borderRadius: "17px",
        background: "#00070C",
        padding: "40px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {/* Stats rows — node 362:5075: col gap 16px (node 362:5076–5081) */}
      <StatRow label="Số Kudos bạn nhận được:" value={stats.kudosReceived} />
      <StatRow label="Số Kudos bạn đã gửi:" value={stats.kudosSent} />
      <StatRow label="Số tim bạn nhận được:" value={stats.hearts} />

      {/* Divider — node 362:5079: rgba(46,57,64,1) */}
      <div
        style={{ width: "100%", height: "1px", backgroundColor: "rgba(46,57,64,1)" }}
        aria-hidden="true"
      />

      <StatRow label="Số Secret Box đã mở:" value={stats.boxOpened} />
      <StatRow label="Số Secret Box chưa mở:" value={stats.boxUnopened} />

      {/* "Mở Secret Box" — node 362:5082: disabled placeholder, bg #FFEA9E, radius 8px (EC-6) */}
      <button
        type="button"
        disabled
        aria-disabled="true"
        aria-label="Mở Secret Box (chưa khả dụng)"
        style={{
          width: "100%",
          height: "60px",
          backgroundColor: "#FFEA9E",
          borderRadius: "8px",
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          padding: "16px",
          cursor: "not-allowed",
          opacity: 0.6,
          ...FONT_BASE,
          fontSize: "22px",
          lineHeight: "28px",
          color: "#00101A",
        }}
      >
        Mở Secret Box
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="3" y="10" width="18" height="11" rx="2" stroke="#00101A" strokeWidth="2" />
          <path d="M21 10H3V7a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v3z" stroke="#00101A" strokeWidth="2" />
          <path d="M12 6v15" stroke="#00101A" strokeWidth="2" />
          <path d="M12 6C12 6 9 3 7 4s-1 4 5 2z" stroke="#00101A" strokeWidth="1.5" />
          <path d="M12 6C12 6 15 3 17 4s1 4-5 2z" stroke="#00101A" strokeWidth="1.5" />
        </svg>
      </button>
    </section>
  );
}
