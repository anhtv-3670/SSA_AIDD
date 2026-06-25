/**
 * Presentational countdown unit — two LED digit boxes + label.
 * Styled from MoMorph node 2268:35139 (1_Days, pattern repeated for Hours/Minutes).
 *
 * Digit box (Rectangle 1 / node I2268:35141;186:2616):
 *   76.8×122.88px · border 0.75px solid #FFEA9E · opacity 0.5
 *   background linear-gradient(180deg, #FFF 0%, rgba(255,255,255,.10) 100%)
 *   border-radius 12px · backdrop-filter blur(24.96px)
 *
 * Digit text (node I2268:35141;186:2617):
 *   font-family "Digital Numbers" · 73.728px · white
 *
 * Label (node 2268:35143):
 *   Montserrat 700 · 36px · lineHeight 48px · white
 *
 * Unit frame (node 2268:35139):
 *   175×192px · flex col · gap 21px
 * Digit row frame (node 2268:35140):
 *   175×123px · flex row · gap 21px
 */

interface CountdownUnitProps {
  /** Two-digit padded string, e.g. "07", "42" */
  value: string;
  /** Uppercase label, e.g. "DAYS" */
  label: string;
}

function DigitBox({ digit }: { digit: string }) {
  return (
    <div
      style={{
        width: "76.8px",
        height: "122.88px",
        borderRadius: "12px",
        // M-2: the 0.5 opacity is baked into the bg/border alpha (not a container
        // `opacity`, which would also dim the digit glyph). Glass box stays translucent;
        // the digit renders at full brightness.
        border: "0.75px solid rgba(255,234,158,0.5)",
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.05) 100%)",
        backdropFilter: "blur(24.96px)",
        WebkitBackdropFilter: "blur(24.96px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontFamily: '"Digital Numbers", monospace',
          fontSize: "73.728px",
          fontWeight: 400,
          lineHeight: 1,
          color: "#FFFFFF",
        }}
      >
        {digit}
      </span>
    </div>
  );
}

export function CountdownUnit({ value, label }: CountdownUnitProps) {
  const [d0, d1] = value.length >= 2 ? [value[0], value[1]] : ["0", value[0] ?? "0"];

  return (
    <div
      style={{
        width: "175px",
        height: "192px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        gap: "21px",
        flexShrink: 0,
      }}
    >
      {/* Two digit boxes in a row */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "21px",
          width: "175px",
          height: "123px",
        }}
      >
        <DigitBox digit={d0} />
        <DigitBox digit={d1} />
      </div>

      {/* Label */}
      <span
        style={{
          fontFamily: "Montserrat, sans-serif",
          fontSize: "36px",
          fontWeight: 700,
          lineHeight: "48px",
          color: "#FFFFFF",
          letterSpacing: "0px",
        }}
      >
        {label}
      </span>
    </div>
  );
}
