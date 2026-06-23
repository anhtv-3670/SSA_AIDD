import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  type Mock,
} from "vitest";

// Mock next/navigation first
vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

// Mock next/headers
vi.mock("next/headers", () => ({
  headers: vi.fn(),
}));

// Mock Supabase client
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

// Now import after mocks are set up
import { signInWithPassword, signInWithOAuth, signOut } from "./actions";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

const mockRedirect = vi.mocked(redirect);
const mockHeaders = vi.mocked(headers);
const mockCreateClient = vi.mocked(createClient);

type SupabaseClientMock = Awaited<ReturnType<typeof createClient>>;
type HeadersReturn = ReturnType<typeof headers>;

let mockSignInWithPassword: Mock;
let mockSignInWithOAuth: Mock;
let mockSignOut: Mock;

describe("signInWithPassword", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSignInWithPassword = vi.fn();
    mockSignInWithOAuth = vi.fn();
    mockSignOut = vi.fn();
    mockCreateClient.mockResolvedValue({
      auth: {
        signInWithPassword: mockSignInWithPassword,
        signInWithOAuth: mockSignInWithOAuth,
        signOut: mockSignOut,
      },
    } as unknown as SupabaseClientMock);
    mockRedirect.mockImplementation(() => {
      throw new Error("REDIRECT_SENTINEL");
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("validation", () => {
    it("rejects invalid email and returns fieldErrors", async () => {
      const formData = new FormData();
      formData.append("email", "not-an-email");
      formData.append("password", "password123");

      const result = await signInWithPassword(undefined, formData);

      expect(result).toBeDefined();
      expect(result?.fieldErrors).toBeDefined();
      expect(result?.fieldErrors?.email).toContain("Email không hợp lệ.");
      expect(result?.email).toBe("not-an-email");
      expect(mockSignInWithPassword).not.toHaveBeenCalled();
    });

    it("rejects empty password and returns fieldErrors", async () => {
      const formData = new FormData();
      formData.append("email", "user@example.com");
      formData.append("password", "");

      const result = await signInWithPassword(undefined, formData);

      expect(result).toBeDefined();
      expect(result?.fieldErrors).toBeDefined();
      expect(result?.fieldErrors?.password).toContain("Vui lòng nhập mật khẩu.");
      expect(result?.email).toBe("user@example.com");
      expect(mockSignInWithPassword).not.toHaveBeenCalled();
    });

    it("rejects both invalid email and empty password", async () => {
      const formData = new FormData();
      formData.append("email", "invalid");
      formData.append("password", "");

      const result = await signInWithPassword(undefined, formData);

      expect(result?.fieldErrors?.email).toBeDefined();
      expect(result?.fieldErrors?.password).toBeDefined();
      expect(mockSignInWithPassword).not.toHaveBeenCalled();
    });

    it("preserves original email in response even if invalid", async () => {
      const formData = new FormData();
      formData.append("email", "  invalid.email  ");
      formData.append("password", "password");

      const result = await signInWithPassword(undefined, formData);

      expect(result?.email).toBe("  invalid.email  ");
    });
  });

  describe("Supabase authentication", () => {
    it("calls Supabase signInWithPassword with valid input", async () => {
      mockSignInWithPassword.mockResolvedValue({ error: null });

      const formData = new FormData();
      formData.append("email", "user@example.com");
      formData.append("password", "correctpassword");

      try {
        await signInWithPassword(undefined, formData);
      } catch (err) {
        if ((err as Error).message !== "REDIRECT_SENTINEL") throw err;
      }

      expect(mockSignInWithPassword).toHaveBeenCalledWith({
        email: "user@example.com",
        password: "correctpassword",
      });
    });

    it("redirects to / on successful authentication", async () => {
      mockSignInWithPassword.mockResolvedValue({ error: null });

      const formData = new FormData();
      formData.append("email", "user@example.com");
      formData.append("password", "correctpassword");

      try {
        await signInWithPassword(undefined, formData);
      } catch (err) {
        if ((err as Error).message !== "REDIRECT_SENTINEL") throw err;
      }

      expect(mockRedirect).toHaveBeenCalledWith("/");
    });

    it("returns error message on authentication failure", async () => {
      mockSignInWithPassword.mockResolvedValue({
        error: new Error("Invalid credentials"),
      });

      const formData = new FormData();
      formData.append("email", "user@example.com");
      formData.append("password", "wrongpassword");

      const result = await signInWithPassword(undefined, formData);

      expect(result?.error).toBe("Email hoặc mật khẩu không đúng.");
      expect(result?.email).toBe("user@example.com");
      expect(mockRedirect).not.toHaveBeenCalled();
    });

    it("returns friendly error message even for different error types", async () => {
      mockSignInWithPassword.mockResolvedValue({
        error: new Error("User not found"),
      });

      const formData = new FormData();
      formData.append("email", "nonexistent@example.com");
      formData.append("password", "anypassword");

      const result = await signInWithPassword(undefined, formData);

      expect(result?.error).toBe("Email hoặc mật khẩu không đúng.");
      expect(mockRedirect).not.toHaveBeenCalled();
    });
  });

  describe("missing/undefined FormData values", () => {
    it("handles missing email field", async () => {
      const formData = new FormData();
      formData.append("password", "password123");

      const result = await signInWithPassword(undefined, formData);

      expect(result?.fieldErrors?.email).toBeDefined();
      expect(mockSignInWithPassword).not.toHaveBeenCalled();
    });

    it("handles missing password field", async () => {
      const formData = new FormData();
      formData.append("email", "user@example.com");

      const result = await signInWithPassword(undefined, formData);

      expect(result?.fieldErrors?.password).toBeDefined();
      expect(mockSignInWithPassword).not.toHaveBeenCalled();
    });

    it("handles both fields missing", async () => {
      const formData = new FormData();

      const result = await signInWithPassword(undefined, formData);

      expect(result?.fieldErrors?.email).toBeDefined();
      expect(result?.fieldErrors?.password).toBeDefined();
      expect(mockSignInWithPassword).not.toHaveBeenCalled();
    });
  });
});

describe("signInWithOAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSignInWithPassword = vi.fn();
    mockSignInWithOAuth = vi.fn();
    mockSignOut = vi.fn();
    mockCreateClient.mockResolvedValue({
      auth: {
        signInWithPassword: mockSignInWithPassword,
        signInWithOAuth: mockSignInWithOAuth,
        signOut: mockSignOut,
      },
    } as unknown as SupabaseClientMock);
    mockRedirect.mockImplementation(() => {
      throw new Error("REDIRECT_SENTINEL");
    });
    mockHeaders.mockReturnValue({
      get: () => "http://localhost:3000",
    } as unknown as HeadersReturn);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("provider validation", () => {
    it("rejects unsupported provider", async () => {
      const formData = new FormData();
      formData.append("provider", "facebook");

      try {
        await signInWithOAuth(formData);
      } catch (err) {
        if ((err as Error).message !== "REDIRECT_SENTINEL") throw err;
      }

      expect(mockRedirect).toHaveBeenCalledWith("/login?error=oauth");
      expect(mockSignInWithOAuth).not.toHaveBeenCalled();
    });

    it("rejects unsupported provider with redirect to oauth error", async () => {
      const formData = new FormData();
      formData.append("provider", "twitter");

      try {
        await signInWithOAuth(formData);
      } catch (err) {
        if ((err as Error).message !== "REDIRECT_SENTINEL") throw err;
      }

      expect(mockRedirect).toHaveBeenCalledWith("/login?error=oauth");
    });

    it("accepts google provider", async () => {
      mockSignInWithOAuth.mockResolvedValue({
        data: { url: "https://oauth.provider.com/authorize?code=abc123" },
        error: null,
      });

      const formData = new FormData();
      formData.append("provider", "google");

      try {
        await signInWithOAuth(formData);
      } catch (err) {
        if ((err as Error).message !== "REDIRECT_SENTINEL") throw err;
      }

      expect(mockSignInWithOAuth).toHaveBeenCalled();
    });

    it("accepts github provider", async () => {
      mockSignInWithOAuth.mockResolvedValue({
        data: { url: "https://github.com/login/oauth/authorize?code=xyz" },
        error: null,
      });

      const formData = new FormData();
      formData.append("provider", "github");

      try {
        await signInWithOAuth(formData);
      } catch (err) {
        if ((err as Error).message !== "REDIRECT_SENTINEL") throw err;
      }

      expect(mockSignInWithOAuth).toHaveBeenCalled();
    });

    it("rejects empty provider", async () => {
      const formData = new FormData();
      formData.append("provider", "");

      try {
        await signInWithOAuth(formData);
      } catch (err) {
        if ((err as Error).message !== "REDIRECT_SENTINEL") throw err;
      }

      expect(mockRedirect).toHaveBeenCalledWith("/login?error=oauth");
      expect(mockSignInWithOAuth).not.toHaveBeenCalled();
    });

    it("rejects missing provider", async () => {
      const formData = new FormData();

      try {
        await signInWithOAuth(formData);
      } catch (err) {
        if ((err as Error).message !== "REDIRECT_SENTINEL") throw err;
      }

      expect(mockRedirect).toHaveBeenCalledWith("/login?error=oauth");
      expect(mockSignInWithOAuth).not.toHaveBeenCalled();
    });
  });

  describe("OAuth flow", () => {
    it("reads origin from headers", async () => {
      mockHeaders.mockReturnValue({
        get: () => "https://example.com",
      } as unknown as HeadersReturn);
      mockSignInWithOAuth.mockResolvedValue({
        data: { url: "https://oauth.provider.com/authorize" },
        error: null,
      });

      const formData = new FormData();
      formData.append("provider", "google");

      try {
        await signInWithOAuth(formData);
      } catch (err) {
        if ((err as Error).message !== "REDIRECT_SENTINEL") throw err;
      }

      expect(mockSignInWithOAuth).toHaveBeenCalledWith({
        provider: "google",
        options: { redirectTo: "https://example.com/auth/callback" },
      });
    });

    it("uses localhost fallback when origin header missing", async () => {
      mockHeaders.mockReturnValue({
        get: () => null,
      } as unknown as HeadersReturn);
      mockSignInWithOAuth.mockResolvedValue({
        data: { url: "https://oauth.provider.com/authorize" },
        error: null,
      });

      const formData = new FormData();
      formData.append("provider", "github");

      try {
        await signInWithOAuth(formData);
      } catch (err) {
        if ((err as Error).message !== "REDIRECT_SENTINEL") throw err;
      }

      expect(mockSignInWithOAuth).toHaveBeenCalledWith({
        provider: "github",
        options: { redirectTo: "http://localhost:3000/auth/callback" },
      });
    });

    it("redirects to provider URL on success", async () => {
      const providerUrl = "https://oauth.provider.com/authorize?code=abc123";
      mockSignInWithOAuth.mockResolvedValue({
        data: { url: providerUrl },
        error: null,
      });

      const formData = new FormData();
      formData.append("provider", "google");

      try {
        await signInWithOAuth(formData);
      } catch (err) {
        if ((err as Error).message !== "REDIRECT_SENTINEL") throw err;
      }

      expect(mockRedirect).toHaveBeenCalledWith(providerUrl);
    });

    it("redirects to error on Supabase error", async () => {
      mockSignInWithOAuth.mockResolvedValue({
        data: null,
        error: new Error("OAuth provider unreachable"),
      });

      const formData = new FormData();
      formData.append("provider", "google");

      try {
        await signInWithOAuth(formData);
      } catch (err) {
        if ((err as Error).message !== "REDIRECT_SENTINEL") throw err;
      }

      expect(mockRedirect).toHaveBeenCalledWith("/login?error=oauth");
    });

    it("redirects to error when data is null", async () => {
      mockSignInWithOAuth.mockResolvedValue({
        data: null,
        error: null,
      });

      const formData = new FormData();
      formData.append("provider", "github");

      try {
        await signInWithOAuth(formData);
      } catch (err) {
        if ((err as Error).message !== "REDIRECT_SENTINEL") throw err;
      }

      expect(mockRedirect).toHaveBeenCalledWith("/login?error=oauth");
    });

    it("redirects to error when url is missing from data", async () => {
      mockSignInWithOAuth.mockResolvedValue({
        data: { url: null },
        error: null,
      });

      const formData = new FormData();
      formData.append("provider", "google");

      try {
        await signInWithOAuth(formData);
      } catch (err) {
        if ((err as Error).message !== "REDIRECT_SENTINEL") throw err;
      }

      expect(mockRedirect).toHaveBeenCalledWith("/login?error=oauth");
    });

    it("redirects to error when data is undefined", async () => {
      mockSignInWithOAuth.mockResolvedValue({
        data: undefined,
        error: null,
      });

      const formData = new FormData();
      formData.append("provider", "google");

      try {
        await signInWithOAuth(formData);
      } catch (err) {
        if ((err as Error).message !== "REDIRECT_SENTINEL") throw err;
      }

      expect(mockRedirect).toHaveBeenCalledWith("/login?error=oauth");
    });
  });
});

describe("signOut", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSignInWithPassword = vi.fn();
    mockSignInWithOAuth = vi.fn();
    mockSignOut = vi.fn();
    mockCreateClient.mockResolvedValue({
      auth: {
        signInWithPassword: mockSignInWithPassword,
        signInWithOAuth: mockSignInWithOAuth,
        signOut: mockSignOut,
      },
    } as unknown as SupabaseClientMock);
    mockRedirect.mockImplementation(() => {
      throw new Error("REDIRECT_SENTINEL");
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("calls Supabase signOut", async () => {
    mockSignOut.mockResolvedValue({ error: null });

    try {
      await signOut();
    } catch (err) {
      if ((err as Error).message !== "REDIRECT_SENTINEL") throw err;
    }

    expect(mockSignOut).toHaveBeenCalled();
  });

  it("redirects to /login after successful signOut", async () => {
    mockSignOut.mockResolvedValue({ error: null });

    try {
      await signOut();
    } catch (err) {
      if ((err as Error).message !== "REDIRECT_SENTINEL") throw err;
    }

    expect(mockRedirect).toHaveBeenCalledWith("/login");
  });

  it("still redirects even if signOut returns error", async () => {
    mockSignOut.mockResolvedValue({ error: new Error("Sign out failed") });

    try {
      await signOut();
    } catch (err) {
      if ((err as Error).message !== "REDIRECT_SENTINEL") throw err;
    }

    expect(mockRedirect).toHaveBeenCalledWith("/login");
  });
});
