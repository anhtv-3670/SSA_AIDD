// Dev-only "test login" CTA — bypasses Google OAuth by signing in the seeded
// test account. Rendered ONLY when isTestLoginEnabled() (see page.tsx). Server
// Component: submit invokes the signInAsTestUser server action (which re-checks
// the gate). Styled as a secondary outline button so it's visually distinct.
import { signInAsTestUser } from "./actions";

export function TestLoginButton() {
  return (
    <form action={signInAsTestUser}>
      <button
        type="submit"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          minWidth: "305px",
          height: "52px",
          padding: "0 24px",
          backgroundColor: "rgba(255,234,158,0.10)",
          border: "1px solid #998C5F",
          borderRadius: "8px",
          cursor: "pointer",
          fontFamily: "Montserrat, sans-serif",
          fontSize: "16px",
          fontWeight: 700,
          lineHeight: "24px",
          color: "#FFFFFF",
        }}
      >
        Đăng nhập test (dev)
      </button>
    </form>
  );
}
