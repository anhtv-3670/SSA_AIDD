import { describe, it, expect } from "vitest";
import { loginSchema, LoginInput } from "./auth-schema";

describe("loginSchema", () => {
  describe("email validation", () => {
    it("parses valid email", () => {
      const result = loginSchema.safeParse({
        email: "user@example.com",
        password: "password123",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe("user@example.com");
      }
    });

    it("rejects invalid email (missing @)", () => {
      const result = loginSchema.safeParse({
        email: "abc",
        password: "password123",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.email).toContain(
          "Email không hợp lệ."
        );
      }
    });

    it("rejects invalid email (missing domain)", () => {
      const result = loginSchema.safeParse({
        email: "abc@",
        password: "password123",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.email).toContain(
          "Email không hợp lệ."
        );
      }
    });

    it("accepts and normalizes email with surrounding whitespace", () => {
      const result = loginSchema.safeParse({
        email: "  user@example.com  ",
        password: "password123",
      });
      // trim() runs before the email check, so padded emails are normalized.
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe("user@example.com");
      }
    });

    it("rejects email with spaces in middle", () => {
      const result = loginSchema.safeParse({
        email: "user name@example.com",
        password: "password123",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("password validation", () => {
    it("parses non-empty password", () => {
      const result = loginSchema.safeParse({
        email: "user@example.com",
        password: "anypassword",
      });
      expect(result.success).toBe(true);
    });

    it("rejects empty password", () => {
      const result = loginSchema.safeParse({
        email: "user@example.com",
        password: "",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.password).toContain(
          "Vui lòng nhập mật khẩu."
        );
      }
    });

    it("accepts password with special characters", () => {
      const result = loginSchema.safeParse({
        email: "user@example.com",
        password: "P@ssw0rd!#$%",
      });
      expect(result.success).toBe(true);
    });

    it("accepts single character password", () => {
      const result = loginSchema.safeParse({
        email: "user@example.com",
        password: "a",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("both fields", () => {
    it("succeeds with valid email and password", () => {
      const result = loginSchema.safeParse({
        email: "john@example.com",
        password: "securepass123",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({
          email: "john@example.com",
          password: "securepass123",
        });
      }
    });

    it("returns fieldErrors for both invalid email and password", () => {
      const result = loginSchema.safeParse({
        email: "invalid.email",
        password: "",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        expect(errors.email).toBeDefined();
        expect(errors.password).toBeDefined();
      }
    });

    it("handles undefined/missing fields gracefully", () => {
      const result = loginSchema.safeParse({
        email: undefined,
        password: undefined,
      });
      expect(result.success).toBe(false);
    });
  });

  describe("type inference", () => {
    it("LoginInput type matches parsed data shape", () => {
      const result = loginSchema.safeParse({
        email: "test@example.com",
        password: "password",
      });
      if (result.success) {
        const loginInput: LoginInput = result.data;
        expect(loginInput.email).toBe("test@example.com");
        expect(loginInput.password).toBe("password");
      }
    });
  });
});
