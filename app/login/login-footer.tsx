// mms_D_Footer (662:14447) — centered copyright only (no nav/logo, unlike the
// app-wide SiteFooter). Montserrat Alternates 700 16px white on the dark base.
export function LoginFooter() {
  return (
    <footer
      style={{
        width: "100%",
        padding: "24px 0",
        borderTop: "1px solid #2E3940",
        textAlign: "center",
      }}
      role="contentinfo"
    >
      <p
        style={{
          fontFamily: "'Montserrat Alternates', Montserrat, sans-serif",
          fontSize: "16px",
          fontWeight: 700,
          lineHeight: "24px",
          color: "#FFFFFF",
          margin: 0,
        }}
      >
        Bản quyền thuộc về Sun* © 2025
      </p>
    </footer>
  );
}
