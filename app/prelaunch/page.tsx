/**
 * /prelaunch — PUBLIC standalone full-screen countdown page.
 * NO auth guard. NO SiteHeader/SiteFooter.
 *
 * Background:
 *   Frame node 2268:35127: backgroundColor #00101A (1512×1077px design)
 *   MM_MEDIA_BG Image node 2268:35129: hero-swirl.png, fill cover
 *   Cover node 2268:35130: linear-gradient(18deg, #00101A 15.48%,
 *     rgba(0,18,29,.46) 52.13%, rgba(0,19,32,0) 63.41%)
 *
 * Content container ("Bìa" node 2268:35131):
 *   position absolute, padding 96px 144px, centered flex col, gap 120px
 *   Inside: Frame 487 → Frame 523 → Countdown time (title + time row)
 */

import type { Metadata } from "next";
import Image from "next/image";
import { eventStartMs } from "@/lib/event-config";
import { CountdownDisplay } from "./countdown-display";

export const metadata: Metadata = {
  title: "Sự kiện sẽ bắt đầu sau",
};

export default function PrelaunchPage() {
  const targetMs = eventStartMs();

  return (
    <main
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        overflow: "hidden",
        backgroundColor: "#00101A",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Background — hero-swirl.png, full cover */}
      <div
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, zIndex: 0 }}
      >
        <Image
          src="/home-saa/hero-swirl.png"
          alt=""
          fill
          className="object-cover object-right-top"
          priority
        />
      </div>

      {/* Cover overlay — node 2268:35130 */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background:
            "linear-gradient(18deg, #00101A 15.48%, rgba(0,18,29,0.46) 52.13%, rgba(0,19,32,0) 63.41%)",
        }}
      />

      {/* Content — centered, z above overlay */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          padding: "96px 144px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CountdownDisplay targetMs={targetMs} />
      </div>
    </main>
  );
}
