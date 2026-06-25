// Profile hero — Section A (node 362:5052).
// Full-bleed feather bg + centered avatar + name + dept + badge + icon collection.
// Server component — no interactivity.

import Image from "next/image";
import type { ProfileData } from "./profile-data";

const ICON_SLOTS = [0, 1, 2, 3, 4, 5] as const;

const FONT_BASE = { fontFamily: "Montserrat, sans-serif", fontWeight: 700 } as const;

function AvatarHero({ initial }: { initial: string }) {
  return (
    <div
      style={{
        width: "200px", height: "200px", borderRadius: "50%",
        border: "4px solid #FFF",
        background: "linear-gradient(135deg, #334155, #1e293b)",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}
      aria-hidden="true"
    >
      <span style={{ ...FONT_BASE, fontSize: "80px", color: "#FFEA9E" }}>{initial}</span>
    </div>
  );
}

export function ProfileHero({ profile }: { profile: ProfileData }) {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ minHeight: "652px", backgroundColor: "#00101A" }}
      aria-label="Profile hero"
    >
      {/* Feather bg — reuse /home-saa/hero-swirl.png */}
      <div className="absolute inset-0" style={{ zIndex: 0 }} aria-hidden="true">
        <Image src="/home-saa/hero-swirl.png" alt="" fill className="object-cover object-right-top" priority />
      </div>

      {/* Dark gradient overlay — node 2167:9029 */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(12deg,#00101A 23.7%,rgba(0,18,29,.46) 38.34%,rgba(0,19,32,.00) 48.92%)", zIndex: 1 }}
        aria-hidden="true"
      />

      {/* Content — centered col, gap 32px (node 362:5052) */}
      <div
        className="relative"
        style={{ zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "32px", paddingTop: "184px", paddingBottom: "48px" }}
      >
        {/* A.1 Avatar — 200px circle, white border (node 362:5053) */}
        <AvatarHero initial={profile.avatarInitial} />

        {/* A.2 Name + dept + badge (node 362:5054) */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
          {/* Name — 36px gold (node 362:5055). h1: the profile owner is the page's main heading (M-2). */}
          <h1 style={{ ...FONT_BASE, fontSize: "36px", lineHeight: "44px", color: "#FFEA9E", margin: 0, textAlign: "center" }}>
            {profile.name}
          </h1>

          {/* Dept + badge row (node 362:5056) */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
            <span style={{ ...FONT_BASE, fontSize: "22px", lineHeight: "28px", color: "#FFFFFF" }}>
              {profile.dept}
            </span>
            <div style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: "rgba(153,153,153,0.4)" }} aria-hidden="true" />
            {/* Legend Hero badge pill (node 3053:6061) */}
            <span style={{ border: "0.5px solid #FFEA9E", borderRadius: "48px", padding: "2px 8px", ...FONT_BASE, fontSize: "13px", lineHeight: "17px", color: "#FFF", whiteSpace: "nowrap", letterSpacing: "0.1px" }}>
              {profile.title}
            </span>
          </div>
        </div>

        {/* A.3 Icon collection (node 362:5064) — 6 gray placeholder slots */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
          {/* Label — 22px white (node 3053:10052) */}
          <p style={{ ...FONT_BASE, fontSize: "22px", lineHeight: "28px", color: "#FFFFFF", margin: 0, textAlign: "center" }}>
            Bộ sưu tập icon của tôi
          </p>
          {/* 6 slots B2–B7 — 64px circle, bg #323231 */}
          <div style={{ display: "flex", gap: "16px" }}>
            {ICON_SLOTS.map((i) => (
              <div
                key={i}
                style={{ width: "64px", height: "64px", borderRadius: "50%", border: "2px solid #FFF", backgroundColor: "#323231", flexShrink: 0 }}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
