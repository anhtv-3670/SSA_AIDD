// Field label with an optional red asterisk for required fields.

import { BASE_FONT } from "./write-kudo-styles";

export function FieldLabel({ text, required }: { text: string; required?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
      <span style={{ ...BASE_FONT, fontSize: "22px", lineHeight: "28px", color: "#00101A" }}>{text}</span>
      {required && (
        <span style={{ fontFamily: "Noto Sans JP, sans-serif", fontWeight: 700, fontSize: "16px", color: "#CF1322", lineHeight: "20px" }}>
          *
        </span>
      )}
    </div>
  );
}
