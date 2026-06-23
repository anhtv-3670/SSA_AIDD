import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { GET } from "./route";

// Mock Supabase client
const mockExchangeCodeForSession = vi.fn();
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    auth: {
      exchangeCodeForSession: mockExchangeCodeForSession,
    },
  })),
}));

describe("GET /auth/callback", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("code parameter handling", () => {
    it("redirects to /login?error=oauth when code is missing", async () => {
      const request = new Request("http://localhost:3000/auth/callback");
      const response = await GET(request);

      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toBe(
        "http://localhost:3000/login?error=oauth"
      );
      expect(mockExchangeCodeForSession).not.toHaveBeenCalled();
    });

    it("redirects to /login?error=oauth when code is empty string", async () => {
      const request = new Request(
        "http://localhost:3000/auth/callback?code="
      );
      const response = await GET(request);

      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toBe(
        "http://localhost:3000/login?error=oauth"
      );
      expect(mockExchangeCodeForSession).not.toHaveBeenCalled();
    });

    it("calls exchangeCodeForSession with valid code", async () => {
      mockExchangeCodeForSession.mockResolvedValue({ error: null });

      const request = new Request(
        "http://localhost:3000/auth/callback?code=abc123xyz"
      );
      await GET(request);

      expect(mockExchangeCodeForSession).toHaveBeenCalledWith("abc123xyz");
    });

    it("passes code with special characters to Supabase", async () => {
      mockExchangeCodeForSession.mockResolvedValue({ error: null });

      const code = "abc-123_xyz.456";
      const request = new Request(
        `http://localhost:3000/auth/callback?code=${encodeURIComponent(code)}`
      );
      await GET(request);

      expect(mockExchangeCodeForSession).toHaveBeenCalledWith(code);
    });
  });

  describe("successful exchange", () => {
    it("redirects to / when code exchange succeeds with no next param", async () => {
      mockExchangeCodeForSession.mockResolvedValue({ error: null });

      const request = new Request(
        "http://localhost:3000/auth/callback?code=abc123"
      );
      const response = await GET(request);

      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toBe("http://localhost:3000/");
    });

    it("redirects to /dashboard when code exchange succeeds with next=/dashboard", async () => {
      mockExchangeCodeForSession.mockResolvedValue({ error: null });

      const request = new Request(
        "http://localhost:3000/auth/callback?code=abc123&next=/dashboard"
      );
      const response = await GET(request);

      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toBe(
        "http://localhost:3000/dashboard"
      );
    });

    it("redirects to nested path when next is a valid relative path", async () => {
      mockExchangeCodeForSession.mockResolvedValue({ error: null });

      const request = new Request(
        "http://localhost:3000/auth/callback?code=abc123&next=/profile/settings"
      );
      const response = await GET(request);

      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toBe(
        "http://localhost:3000/profile/settings"
      );
    });

    it("preserves query parameters in next path", async () => {
      mockExchangeCodeForSession.mockResolvedValue({ error: null });

      const request = new Request(
        "http://localhost:3000/auth/callback?code=abc123&next=/search%3Fq%3Dtest"
      );
      const response = await GET(request);

      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toBe(
        "http://localhost:3000/search?q=test"
      );
    });
  });

  describe("exchange errors", () => {
    it("redirects to /login?error=oauth when exchange fails", async () => {
      mockExchangeCodeForSession.mockResolvedValue({
        error: new Error("Invalid code"),
      });

      const request = new Request(
        "http://localhost:3000/auth/callback?code=invalid"
      );
      const response = await GET(request);

      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toBe(
        "http://localhost:3000/login?error=oauth"
      );
    });

    it("redirects to error page for expired code", async () => {
      mockExchangeCodeForSession.mockResolvedValue({
        error: new Error("Code expired"),
      });

      const request = new Request(
        "http://localhost:3000/auth/callback?code=expired"
      );
      const response = await GET(request);

      expect(response.headers.get("location")).toBe(
        "http://localhost:3000/login?error=oauth"
      );
    });

    it("redirects to error page for already used code", async () => {
      mockExchangeCodeForSession.mockResolvedValue({
        error: new Error("Code already used"),
      });

      const request = new Request(
        "http://localhost:3000/auth/callback?code=used"
      );
      const response = await GET(request);

      expect(response.headers.get("location")).toBe(
        "http://localhost:3000/login?error=oauth"
      );
    });
  });

  describe("open redirect protection", () => {
    it("blocks redirect to // (protocol-relative URL)", async () => {
      mockExchangeCodeForSession.mockResolvedValue({ error: null });

      const request = new Request(
        "http://localhost:3000/auth/callback?code=abc123&next=//evil.com"
      );
      const response = await GET(request);

      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toBe("http://localhost:3000/");
    });

    it("blocks redirect to external https URL", async () => {
      mockExchangeCodeForSession.mockResolvedValue({ error: null });

      const request = new Request(
        "http://localhost:3000/auth/callback?code=abc123&next=https://evil.com"
      );
      const response = await GET(request);

      expect(response.headers.get("location")).toBe("http://localhost:3000/");
    });

    it("blocks redirect to external http URL", async () => {
      mockExchangeCodeForSession.mockResolvedValue({ error: null });

      const request = new Request(
        "http://localhost:3000/auth/callback?code=abc123&next=http://evil.com"
      );
      const response = await GET(request);

      expect(response.headers.get("location")).toBe("http://localhost:3000/");
    });

    it("blocks redirect to ftp URL", async () => {
      mockExchangeCodeForSession.mockResolvedValue({ error: null });

      const request = new Request(
        "http://localhost:3000/auth/callback?code=abc123&next=ftp://evil.com"
      );
      const response = await GET(request);

      expect(response.headers.get("location")).toBe("http://localhost:3000/");
    });

    it("allows redirect to / with trailing slash", async () => {
      mockExchangeCodeForSession.mockResolvedValue({ error: null });

      const request = new Request(
        "http://localhost:3000/auth/callback?code=abc123&next=/"
      );
      const response = await GET(request);

      expect(response.headers.get("location")).toBe("http://localhost:3000/");
    });

    it("allows redirect to /auth/callback (same route)", async () => {
      mockExchangeCodeForSession.mockResolvedValue({ error: null });

      const request = new Request(
        "http://localhost:3000/auth/callback?code=abc123&next=/auth/callback"
      );
      const response = await GET(request);

      expect(response.headers.get("location")).toBe(
        "http://localhost:3000/auth/callback"
      );
    });

    it("blocks empty next parameter", async () => {
      mockExchangeCodeForSession.mockResolvedValue({ error: null });

      const request = new Request(
        "http://localhost:3000/auth/callback?code=abc123&next="
      );
      const response = await GET(request);

      expect(response.headers.get("location")).toBe("http://localhost:3000/");
    });

    it("falls back to / when next contains only whitespace", async () => {
      mockExchangeCodeForSession.mockResolvedValue({ error: null });

      const request = new Request(
        "http://localhost:3000/auth/callback?code=abc123&next=%20%20"
      );
      const response = await GET(request);

      expect(response.headers.get("location")).toBe("http://localhost:3000/");
    });

    it("blocks next with leading // but allows /path", async () => {
      mockExchangeCodeForSession.mockResolvedValue({ error: null });

      const request = new Request(
        "http://localhost:3000/auth/callback?code=abc123&next=//path"
      );
      const response = await GET(request);

      expect(response.headers.get("location")).toBe("http://localhost:3000/");
    });

    it("blocks next with javascript: protocol", async () => {
      mockExchangeCodeForSession.mockResolvedValue({ error: null });

      const request = new Request(
        "http://localhost:3000/auth/callback?code=abc123&next=javascript:alert('xss')"
      );
      const response = await GET(request);

      expect(response.headers.get("location")).toBe("http://localhost:3000/");
    });
  });

  describe("different origins", () => {
    it("constructs correct redirect URL for different origin", async () => {
      mockExchangeCodeForSession.mockResolvedValue({ error: null });

      const request = new Request(
        "https://example.com:8443/auth/callback?code=abc123&next=/settings"
      );
      const response = await GET(request);

      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toBe(
        "https://example.com:8443/settings"
      );
    });

    it("uses custom port in redirect URL", async () => {
      mockExchangeCodeForSession.mockResolvedValue({ error: null });

      const request = new Request(
        "http://localhost:3001/auth/callback?code=abc123"
      );
      const response = await GET(request);

      expect(response.headers.get("location")).toBe("http://localhost:3001/");
    });

    it("preserves protocol (http vs https)", async () => {
      mockExchangeCodeForSession.mockResolvedValue({ error: null });

      const request = new Request(
        "https://localhost:3000/auth/callback?code=abc123"
      );
      const response = await GET(request);

      expect(response.headers.get("location")).toBe("https://localhost:3000/");
    });
  });

  describe("edge cases", () => {
    it("handles multiple query parameters correctly", async () => {
      mockExchangeCodeForSession.mockResolvedValue({ error: null });

      const request = new Request(
        "http://localhost:3000/auth/callback?code=abc123&next=/dashboard&extra=param"
      );
      const response = await GET(request);

      expect(response.headers.get("location")).toBe(
        "http://localhost:3000/dashboard"
      );
    });

    it("uses code from first occurrence if code parameter appears multiple times", async () => {
      mockExchangeCodeForSession.mockResolvedValue({ error: null });

      const request = new Request(
        "http://localhost:3000/auth/callback?code=first&code=second"
      );
      await GET(request);

      expect(mockExchangeCodeForSession).toHaveBeenCalledWith("first");
    });

    it("uses next from first occurrence if next parameter appears multiple times", async () => {
      mockExchangeCodeForSession.mockResolvedValue({ error: null });

      const request = new Request(
        "http://localhost:3000/auth/callback?code=abc123&next=/first&next=/second"
      );
      const response = await GET(request);

      expect(response.headers.get("location")).toBe(
        "http://localhost:3000/first"
      );
    });

    it("returns NextResponse with 307 status code (temporary redirect)", async () => {
      mockExchangeCodeForSession.mockResolvedValue({ error: null });

      const request = new Request(
        "http://localhost:3000/auth/callback?code=abc123"
      );
      const response = await GET(request);

      expect(response.status).toBe(307);
    });
  });
});
