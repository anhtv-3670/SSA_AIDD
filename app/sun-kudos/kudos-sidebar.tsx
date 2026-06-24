// Authoritative: D_Thống menu phải (2940:13488) — 422px wide col gap 24px
// D.1: border 1px #998C5F, bg #00070C, radius 17px, padding 24px
// Stats rows: label white 16px + value #FFEA9E 32px, divider rgba(46,57,64,1)
// Button D.1.8 "Mở Secret Box" — disabled, bg #FFEA9E, radius 8px, 22px #00101A
// D.3: border 1px #998C5F, bg #00070C, radius 17px, padding 24px
// Title: 22px #FFEA9E center; rows: 64px avatar + name 22px #FFEA9E + gift 16px white

import type { KudosStats, GiftRecipient } from "./kudos-data";
import { AvatarCircle } from "./kudos-person-block";

function StatRow({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", width: "100%", height: "40px" }}>
      <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "16px", fontWeight: 700, lineHeight: "24px", color: "#FFFFFF" }}>
        {label}
      </span>
      <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "32px", fontWeight: 700, lineHeight: "40px", color: "#FFEA9E", flexShrink: 0 }}>
        {value}
      </span>
    </div>
  );
}

function GiftRow({ recipient }: { recipient: GiftRecipient }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%", height: "64px" }}>
      <AvatarCircle initial={recipient.initial} size={64} />
      <div style={{ display: "flex", flexDirection: "column", gap: "2px", minWidth: 0 }}>
        <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "22px", fontWeight: 700, lineHeight: "28px", color: "#FFEA9E", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {recipient.name}
        </span>
        <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "16px", fontWeight: 700, lineHeight: "24px", letterSpacing: "0.15px", color: "#FFFFFF", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {recipient.gift}
        </span>
      </div>
    </div>
  );
}

const BOX_STYLE = {
  border: "1px solid #998C5F",
  borderRadius: "17px",
  background: "#00070C",
  padding: "24px",
  display: "flex",
  flexDirection: "column" as const,
  gap: "10px",
} as const;

interface KudosSidebarProps {
  stats: KudosStats;
  giftRecipients: GiftRecipient[];
}

export function KudosSidebar({ stats, giftRecipients }: KudosSidebarProps) {
  return (
    <aside aria-label="Kudos statistics and gift recipients" style={{ width: "422px", flexShrink: 0, display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* D.1 Stats */}
      <div style={BOX_STYLE}>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%", alignItems: "center" }}>
          <StatRow label="Số Kudos bạn nhận được:" value={stats.received} />
          <StatRow label="Số Kudos bạn đã gửi:" value={stats.sent} />
          <StatRow label="Số tim bạn nhận được:" value={stats.hearts} />
          <div style={{ width: "100%", height: "1px", backgroundColor: "rgba(46,57,64,1)" }} aria-hidden="true" />
          <StatRow label="Số Secret Box đã mở:" value={stats.boxOpened} />
          <StatRow label="Số Secret Box chưa mở:" value={stats.boxUnopened} />

          {/* D.1.8 — disabled placeholder (EC-9) */}
          <button type="button" disabled aria-disabled="true"
            style={{ width: "100%", height: "60px", backgroundColor: "#FFEA9E", borderRadius: "8px", border: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "16px", cursor: "not-allowed", opacity: 0.6, fontFamily: "Montserrat, sans-serif", fontSize: "22px", fontWeight: 700, lineHeight: "28px", color: "#00101A" }}>
            Mở Secret Box
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="3" y="10" width="18" height="11" rx="2" stroke="#00101A" strokeWidth="2" />
              <path d="M21 10H3V7a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v3z" stroke="#00101A" strokeWidth="2" />
              <path d="M12 6v15" stroke="#00101A" strokeWidth="2" />
              <path d="M12 6C12 6 9 3 7 4s-1 4 5 2z" stroke="#00101A" strokeWidth="1.5" />
              <path d="M12 6C12 6 15 3 17 4s1 4-5 2z" stroke="#00101A" strokeWidth="1.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* D.3 Gift recipients */}
      <div style={{ ...BOX_STYLE, padding: "24px 16px 24px 24px" }}>
        <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "22px", fontWeight: 700, lineHeight: "28px", color: "#FFEA9E", textAlign: "center", margin: 0 }}>
          10 SUNNER NHẬN QUÀ<br />MỚI NHẤT
        </h3>
        {giftRecipients.length === 0 ? (
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "16px", fontWeight: 700, color: "#999", textAlign: "center", margin: 0 }}>
            Chưa có dữ liệu
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", overflowY: "auto", maxHeight: "384px" }}>
            {giftRecipients.map((r) => <GiftRow key={r.id} recipient={r} />)}
          </div>
        )}
      </div>
    </aside>
  );
}
