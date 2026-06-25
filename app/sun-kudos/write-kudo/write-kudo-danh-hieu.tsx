"use client";

// "Danh hiệu" (title/award) text field with helper text and inline error.

import { FieldLabel } from "./write-kudo-field-label";
import { BASE_FONT, ERROR_TEXT } from "./write-kudo-styles";

interface WriteKudoDanhHieuProps {
  value: string;
  onChange: (val: string) => void;
  error?: string;
}

export function WriteKudoDanhHieu({ value, onChange, error }: WriteKudoDanhHieuProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <FieldLabel text="Danh hiệu" required />
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 24px",
            border: `1px solid ${error ? "#D4271D" : "#998C5F"}`,
            borderRadius: "8px",
            background: "#FFF",
          }}
        >
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Dành tặng một danh hiệu cho đồng đội"
            aria-label="Danh hiệu"
            aria-required="true"
            aria-describedby={error ? "danh-hieu-error" : undefined}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              background: "transparent",
              ...BASE_FONT,
              fontSize: "16px",
              lineHeight: "24px",
              letterSpacing: "0.15px",
              color: "#00101A",
            }}
          />
        </div>
        {error && (
          <p id="danh-hieu-error" role="alert" style={ERROR_TEXT}>
            {error}
          </p>
        )}
        <p style={{ margin: 0, ...BASE_FONT, fontSize: "16px", lineHeight: "24px", letterSpacing: "0.15px", color: "#999" }}>
          Ví dụ: Người truyền động lực cho tôi.<br />
          Danh hiệu sẽ hiển thị làm tiêu đề Kudos của bạn.
        </p>
      </div>
    </div>
  );
}
