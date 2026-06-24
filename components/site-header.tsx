import Image from "next/image";
import { SignOutButton } from "@/components/sign-out-button";
import { LanguageSelector } from "@/components/language-selector";
import { DEFAULT_LOCALE, type Locale } from "@/lib/locale";

// Authoritative styles from MoMorph node 2167:9091:
// height: 80px, padding: 12px 144px, bg: rgba(16,20,23,0.8), gap: 238px
// Nav links from I2167:9091;178:653: gap 24px, font Montserrat 14px 700
// Header is sticky over the hero — position: fixed, z-50

interface SiteHeaderProps {
  userEmail?: string;
  /** Nav item id that should appear active. Matches against NAV_LINKS[].id. */
  active: string;
  /** Request locale (from cookie) for the language selector's initial display. */
  locale?: Locale;
}

const NAV_LINKS = [
  { id: "about", label: "About SAA 2025", href: "/home" },
  { id: "award", label: "Award Information", href: "/he-thong-giai" },
  { id: "kudos", label: "Sun* Kudos", href: "/sun-kudos" },
];

export function SiteHeader({ userEmail, active, locale = DEFAULT_LOCALE }: SiteHeaderProps) {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between"
      style={{
        // Authoritative: rgba(16,20,23,0.8), height 80px, padding 12px 144px
        backgroundColor: "rgba(16, 20, 23, 0.8)",
        height: "80px",
        padding: "12px 144px",
      }}
      role="banner"
    >
      {/* Left: Logo + Nav */}
      <div className="flex items-center" style={{ gap: "64px" }}>
        {/* Logo: mms_A1.1_LOGO — 52x48px REAL raster cropped from the frame render
            → public/saa-2025/logo-sun.png */}
        <Image
          src="/saa-2025/logo-sun.png"
          alt="Sun* logo"
          width={52}
          height={48}
          priority
        />

        {/* Nav links — Montserrat 700 14px, gap 24px */}
        <nav aria-label="Primary navigation">
          <ul className="flex items-center" style={{ gap: "24px", listStyle: "none", padding: 0, margin: 0 }}>
            {NAV_LINKS.map((link) => {
              const isActive = link.id === active;
              return (
                <li key={link.id}>
                  <a
                    href={link.href}
                    className="block"
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      fontSize: "14px",
                      fontWeight: 700,
                      lineHeight: "20px",
                      letterSpacing: "0.1px",
                      padding: "16px",
                      // Active: color #FFEA9E, border-bottom gold; inactive: white
                      color: isActive ? "#FFEA9E" : "rgba(255,255,255,1)",
                      borderBottom: isActive ? "1px solid #FFEA9E" : "none",
                      textDecoration: "none",
                      textShadow: isActive
                        ? "0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287"
                        : "none",
                    }}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Right: Language + Notification + User */}
      <div className="flex items-center" style={{ gap: "8px" }}>
        {/* Language selector — mms_A1.7_Language → F004 interactive VN/EN dropdown */}
        <LanguageSelector initialLocale={locale} />

        {/* Notification bell — mms_A1.6_Notification, 40x40 */}
        <button
          type="button"
          className="flex items-center justify-center"
          style={{
            width: "40px",
            height: "40px",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            borderRadius: "4px",
          }}
          aria-label="Notifications"
        >
          {/* RECONSTRUCTED: notification bell icon (raster unavailable) */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 2C10.3431 2 9 3.34315 9 5V5.58579C6.71776 6.32028 5 8.46243 5 11V17L3 19V20H21V19L19 17V11C19 8.46243 17.2822 6.32028 15 5.58579V5C15 3.34315 13.6569 2 12 2Z"
              fill="rgba(255,255,255,0.9)"
            />
            <circle cx="17" cy="6" r="3" fill="#FF4444" />
            <path d="M10 20C10 21.1046 10.8954 22 12 22C13.1046 22 14 21.1046 14 20H10Z" fill="rgba(255,255,255,0.9)" />
          </svg>
        </button>

        {/* User profile button — mms_A1.8_Button-IC, 40x40; wraps SignOutButton concept */}
        {/* RECONSTRUCTED: user profile icon (raster unavailable) */}
        <div className="relative flex items-center" style={{ gap: "8px" }}>
          <button
            type="button"
            className="flex items-center justify-center"
            style={{
              width: "40px",
              height: "40px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              borderRadius: "4px",
            }}
            aria-label={userEmail ? `User menu for ${userEmail}` : "User menu"}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="8" r="4" fill="rgba(255,255,255,0.9)" />
              <path d="M4 20C4 16.6863 7.58172 14 12 14C16.4183 14 20 16.6863 20 20" stroke="rgba(255,255,255,0.9)" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}
