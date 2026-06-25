import { describe, it, expect, vi, afterEach } from "vitest";

import { isTestLoginEnabled, testCredentials } from "./test-login";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("isTestLoginEnabled", () => {
  it("is true when ENABLE_TEST_LOGIN=true and not production", () => {
    vi.stubEnv("ENABLE_TEST_LOGIN", "true");
    vi.stubEnv("NODE_ENV", "development");
    expect(isTestLoginEnabled()).toBe(true);
  });

  it("is false when the flag is unset/empty", () => {
    vi.stubEnv("ENABLE_TEST_LOGIN", "");
    vi.stubEnv("NODE_ENV", "development");
    expect(isTestLoginEnabled()).toBe(false);
  });

  it("is false when the flag is any value other than 'true'", () => {
    vi.stubEnv("ENABLE_TEST_LOGIN", "1");
    vi.stubEnv("NODE_ENV", "development");
    expect(isTestLoginEnabled()).toBe(false);
  });

  it("is false in production even when the flag is set (hard guard)", () => {
    vi.stubEnv("ENABLE_TEST_LOGIN", "true");
    vi.stubEnv("NODE_ENV", "production");
    expect(isTestLoginEnabled()).toBe(false);
  });
});

describe("testCredentials", () => {
  it("defaults to the seeded account when env is not set", () => {
    vi.stubEnv("TEST_USER_EMAIL", undefined);
    vi.stubEnv("TEST_USER_PASSWORD", undefined);
    expect(testCredentials()).toEqual({ email: "test@example.com", password: "password123" });
  });

  it("honors env overrides", () => {
    vi.stubEnv("TEST_USER_EMAIL", "custom@example.com");
    vi.stubEnv("TEST_USER_PASSWORD", "s3cret");
    expect(testCredentials()).toEqual({ email: "custom@example.com", password: "s3cret" });
  });
});
