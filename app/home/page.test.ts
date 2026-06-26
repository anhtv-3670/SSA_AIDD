import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
} from "vitest";

// Mock next/navigation first
vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

// Mock Supabase client
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

// Mock locale resolver — getLocale() reads next/headers cookies(), which is
// request-scoped and unavailable in the node test environment.
vi.mock("@/lib/get-locale", () => ({
  getLocale: vi.fn().mockResolvedValue("vi"),
}));

// Now import after mocks are set up
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import HomePage from "./page";

const mockRedirect = vi.mocked(redirect);
const mockCreateClient = vi.mocked(createClient);

type SupabaseClientMock = Awaited<ReturnType<typeof createClient>>;

/**
 * Builds a stub Supabase client with the given authed user.
 * Stubs both `auth.getUser` and the `from(...).select(...).order(...)` chain
 * used by the awards query the home page now performs (getAwards).
 */
function makeClient(user: { id: string; email: string } | null): SupabaseClientMock {
  return {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user } }),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
      })),
    })),
  } as unknown as SupabaseClientMock;
}

describe("HomePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("auth guard", () => {
    it("redirects to /login when user is null", async () => {
      mockCreateClient.mockResolvedValue(makeClient(null));

      mockRedirect.mockImplementation(() => {
        throw new Error("REDIRECT_SENTINEL");
      });

      try {
        await HomePage();
        // Should not reach here
        expect.fail("Expected redirect to be called");
      } catch (err) {
        expect((err as Error).message).toBe("REDIRECT_SENTINEL");
      }

      expect(mockRedirect).toHaveBeenCalledWith("/login");
    });

    it("renders greeting with user email when authenticated", async () => {
      mockCreateClient.mockResolvedValue(
        makeClient({ id: "u1", email: "alice@example.com" }),
      );

      const result = await HomePage();

      expect(mockRedirect).not.toHaveBeenCalled();
      expect(result).toBeDefined();
      // Verify it's a React element
      expect(result).toHaveProperty("type");
      expect(result).toHaveProperty("props");
    });

    it("calls getUser on the Supabase client", async () => {
      const client = makeClient({ id: "u2", email: "bob@example.com" });
      mockCreateClient.mockResolvedValue(client);

      await HomePage();

      expect(client.auth.getUser).toHaveBeenCalled();
    });

    it("calls createClient to initialize Supabase", async () => {
      mockCreateClient.mockResolvedValue(
        makeClient({ id: "u3", email: "charlie@example.com" }),
      );

      await HomePage();

      expect(mockCreateClient).toHaveBeenCalled();
    });

    it("does not redirect when user exists with email", async () => {
      mockCreateClient.mockResolvedValue(
        makeClient({ id: "u4", email: "dave@example.com" }),
      );

      const result = await HomePage();

      expect(mockRedirect).not.toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });
});
