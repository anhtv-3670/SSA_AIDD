import Image from "next/image";

import { LanguageSelector } from "@/components/language-selector";
import type { Locale } from "@/lib/locale";

// mms_A_Header (662:14391) — 80px tall, padding 12px 144px, bg rgba(11,15,18,0.8).
// Minimal login header: brand logo (left) + language selector (right). No nav, no
// user menu (the visitor is signed out).
export function LoginHeader({ locale }: { locale: Locale }) {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between"
      style={{
        height: "80px",
        padding: "12px 144px",
        backgroundColor: "rgba(11, 15, 18, 0.8)",
      }}
      role="banner"
    >
      {/* A.1 Logo — reuse the SAA brand lockup */}
      <Image src="/saa-2025/logo-sun.png" alt="Sun* Annual Awards 2025" width={52} height={48} priority />

      {/* A.2 Language selector (F004) */}
      <LanguageSelector initialLocale={locale} />
    </header>
  );
}
