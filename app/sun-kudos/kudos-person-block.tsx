// Shared person display: avatar circle + name + dept + title badge
// Used by KudosCard for sender/receiver blocks.

export function AvatarCircle({ initial, size = 64 }: { initial: string; size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        border: "1.869px solid #FFF",
        background: "linear-gradient(135deg, #334155, #1e293b)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
      aria-hidden="true"
    >
      <span
        style={{
          fontFamily: "Montserrat, sans-serif",
          fontSize: size * 0.375,
          fontWeight: 700,
          color: "#FFEA9E",
        }}
      >
        {initial}
      </span>
    </div>
  );
}

export function PersonBlock({
  name,
  dept,
  title,
  initial,
}: {
  name: string;
  dept: string;
  title: string;
  initial: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "13px",
        width: "235px",
      }}
    >
      <AvatarCircle initial={initial} />
      <div style={{ display: "flex", flexDirection: "column", gap: "2px", width: "235px" }}>
        {/* Name */}
        <p
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: "16px",
            fontWeight: 700,
            lineHeight: "24px",
            letterSpacing: "0.15px",
            color: "#00101A",
            textAlign: "center",
            margin: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {name}
        </p>
        {/* Dept + badge row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <span
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "14px",
              fontWeight: 700,
              lineHeight: "20px",
              letterSpacing: "0.1px",
              color: "#999",
            }}
          >
            {dept}
          </span>
          {/* Dot separator */}
          <div
            style={{
              width: 4,
              height: 4,
              borderRadius: "50%",
              backgroundColor: "rgba(153,153,153,0.4)",
            }}
            aria-hidden="true"
          />
          {/* Danh hiệu badge */}
          <span
            style={{
              border: "0.5px solid #FFEA9E",
              borderRadius: "48px",
              padding: "0 6px",
              fontFamily: "Montserrat, sans-serif",
              fontSize: "11px",
              fontWeight: 700,
              lineHeight: "19px",
              color: "#FFEA9E",
              whiteSpace: "nowrap",
            }}
          >
            {title}
          </span>
        </div>
      </div>
    </div>
  );
}
