// Authoritative: B.1_header / B.6 / C.1 — padding 0 144px, col gap 16px
// Subtitle: Montserrat 700 24px white
// Divider: 1px rgba(46,57,64,1)
// Title row: title (57px #FFEA9E) + optional right slot (filters)

interface KudosSectionHeaderProps {
  subtitle: string;
  title: string;
  rightSlot?: React.ReactNode;
}

export function KudosSectionHeader({ subtitle, title, rightSlot }: KudosSectionHeaderProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        width: "100%",
        padding: "0 144px",
      }}
    >
      {/* Subtitle — Montserrat 700 24px white */}
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
        {subtitle}
      </p>

      {/* Divider — 1px rgba(46,57,64,1) */}
      <div
        style={{
          width: "100%",
          height: "1px",
          backgroundColor: "rgba(46,57,64,1)",
        }}
        aria-hidden="true"
      />

      {/* Title row — title left, optional right slot */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "32px",
        }}
      >
        <h2
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
          {title}
        </h2>
        {rightSlot && <div>{rightSlot}</div>}
      </div>
    </div>
  );
}
