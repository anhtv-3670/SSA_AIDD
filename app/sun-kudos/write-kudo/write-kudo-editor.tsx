"use client";

// Editor: decorative toolbar + textarea + helper text.
// Design (520:9877 + 520:9886):
//   Textarea: border #998C5F, radius 0 0 8px 8px (joins toolbar), bg white, min-h 200px.
//   Helper: Montserrat 700 16px #00101A letterSpacing 0.5px (right-aligned per design).

import { useCallback } from "react";
import { WriteKudoEditorToolbar } from "./write-kudo-editor-toolbar";
import { BASE_FONT, ERROR_TEXT } from "./write-kudo-styles";

interface WriteKudoEditorProps {
  value: string;
  onChange: (val: string) => void;
  error?: string;
}

export function WriteKudoEditor({ value, onChange, error }: WriteKudoEditorProps) {
  const hasError = Boolean(error);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  const borderColor = hasError ? "#D4271D" : "#998C5F";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      <WriteKudoEditorToolbar borderColor={borderColor} />

      {/* Textarea */}
      <textarea
        value={value}
        onChange={handleChange}
        placeholder="Hãy gửi gắm lời cám ơn và ghi nhận đến đồng đội tại đây nhé!"
        aria-label="Nội dung Kudos"
        aria-required="true"
        aria-describedby={hasError ? "content-error" : "content-hint"}
        style={{
          width: "100%",
          minHeight: "200px",
          border: `1px solid ${borderColor}`,
          borderTop: "none",
          borderRadius: "0 0 8px 8px",
          background: "#FFF",
          padding: "16px 24px",
          resize: "vertical",
          outline: "none",
          boxSizing: "border-box",
          ...BASE_FONT,
          fontSize: "16px",
          lineHeight: "24px",
          letterSpacing: "0.15px",
          color: "#00101A",
        }}
      />

      {/* Helper / error row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ flex: 1 }} />
        {hasError ? (
          <p id="content-error" role="alert" style={ERROR_TEXT}>
            {error}
          </p>
        ) : (
          <p
            id="content-hint"
            style={{
              margin: 0,
              ...BASE_FONT,
              fontSize: "16px",
              lineHeight: "24px",
              letterSpacing: "0.5px",
              color: "#00101A",
            }}
          >
            Bạn có thể &quot;@ + tên&quot; để nhắc tới đồng nghiệp khác
          </p>
        )}
      </div>
    </div>
  );
}
