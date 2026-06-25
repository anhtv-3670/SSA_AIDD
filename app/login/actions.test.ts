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
import { signInWithOAuth, signOut, signInAsTestUser } from "./actions";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

const mockRedirect = vi.mocked(redirect);
const mockHeaders = vi.mocked(headers);
const mockCreateClient = vi.mocked(createClient);

type SupabaseClientMock = Awaited<ReturnType<typeof createClient>>;
type HeadersReturn = ReturnType<typeof headers>;

let mockSignInWithOAuth: Mock;
let mockSignOut: Mock;

describe("signInWithOAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSignInWithOAuth = vi.fn();
    mockSignOut = vi.fn();
    mockCreateClient.mockResolvedValue({
      auth: {
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
        options: { redirectTo: "https://example.com/auth/callback?next=%2Fhome" },
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
        options: { redirectTo: "http://localhost:3000/auth/callback?next=%2Fhome" },
      });
    });

    it("infers https for a non-localhost host header (no origin/x-forwarded)", async () => {
      // M-2: the Host-branch must not hardcode http:// for production domains.
      mockHeaders.mockReturnValue({
        get: (key: string) => (key === "host" ? "prod.example.com" : null),
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
        options: { redirectTo: "https://prod.example.com/auth/callback?next=%2Fhome" },
      });
    });

    it("honors x-forwarded-proto over host inference", async () => {
      mockHeaders.mockReturnValue({
        get: (key: string) =>
          key === "host" ? "prod.example.com" : key === "x-forwarded-proto" ? "https" : null,
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
        options: { redirectTo: "https://prod.example.com/auth/callback?next=%2Fhome" },
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
    mockSignInWithOAuth = vi.fn();
    mockSignOut = vi.fn();
    mockCreateClient.mockResolvedValue({
      auth: {
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

describe("signInAsTestUser", () => {
  let mockSignInWithPwd: Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    mockSignInWithPwd = vi.fn();
    mockCreateClient.mockResolvedValue({
      auth: { signInWithPassword: mockSignInWithPwd },
    } as unknown as SupabaseClientMock);
    mockRedirect.mockImplementation(() => {
      throw new Error("REDIRECT_SENTINEL");
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
  });

  it("is blocked (no sign-in) when test login is disabled", async () => {
    vi.stubEnv("ENABLE_TEST_LOGIN", "");
    try {
      await signInAsTestUser();
    } catch (err) {
      if ((err as Error).message !== "REDIRECT_SENTINEL") throw err;
    }
    expect(mockSignInWithPwd).not.toHaveBeenCalled();
    expect(mockRedirect).toHaveBeenCalledWith("/login");
  });

  it("is blocked in production even when the flag is set", async () => {
    vi.stubEnv("ENABLE_TEST_LOGIN", "true");
    vi.stubEnv("NODE_ENV", "production");
    try {
      await signInAsTestUser();
    } catch (err) {
      if ((err as Error).message !== "REDIRECT_SENTINEL") throw err;
    }
    expect(mockSignInWithPwd).not.toHaveBeenCalled();
    expect(mockRedirect).toHaveBeenCalledWith("/login");
  });

  it("signs in the seeded user and redirects /home when enabled", async () => {
    vi.stubEnv("ENABLE_TEST_LOGIN", "true");
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("TEST_USER_EMAIL", undefined);
    vi.stubEnv("TEST_USER_PASSWORD", undefined);
    mockSignInWithPwd.mockResolvedValue({ error: null });
    try {
      await signInAsTestUser();
    } catch (err) {
      if ((err as Error).message !== "REDIRECT_SENTINEL") throw err;
    }
    expect(mockSignInWithPwd).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
    expect(mockRedirect).toHaveBeenCalledWith("/home");
  });

  it("redirects to ?error=testlogin when Supabase rejects", async () => {
    vi.stubEnv("ENABLE_TEST_LOGIN", "true");
    vi.stubEnv("NODE_ENV", "development");
    mockSignInWithPwd.mockResolvedValue({ error: new Error("invalid credentials") });
    try {
      await signInAsTestUser();
    } catch (err) {
      if ((err as Error).message !== "REDIRECT_SENTINEL") throw err;
    }
    expect(mockRedirect).toHaveBeenCalledWith("/login?error=testlogin");
  });
});
