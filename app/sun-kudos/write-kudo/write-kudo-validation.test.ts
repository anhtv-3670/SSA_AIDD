import { describe, it, expect } from "vitest";

import {
  validateWriteKudo,
  type WriteKudoForm,
  type WriteKudoValidationResult,
} from "./write-kudo-validation";

describe("validateWriteKudo", () => {
  describe("recipient field validation (EC-2)", () => {
    it("returns error when recipient is empty string", () => {
      const form: WriteKudoForm = {
        recipient: "",
        danhHieu: "Senior Developer",
        content: "Great work",
        hashtags: ["#Teamwork"],
      };
      const result = validateWriteKudo(form);
      expect(result.errors.recipient).toBeDefined();
      expect(result.errors.recipient).toBe("Người nhận không được để trống");
    });

    it("returns error when recipient is whitespace only", () => {
      const form: WriteKudoForm = {
        recipient: "   ",
        danhHieu: "Senior Developer",
        content: "Great work",
        hashtags: ["#Teamwork"],
      };
      const result = validateWriteKudo(form);
      expect(result.errors.recipient).toBeDefined();
      expect(result.errors.recipient).toBe("Người nhận không được để trống");
    });

    it("returns error when recipient is tab character only", () => {
      const form: WriteKudoForm = {
        recipient: "\t",
        danhHieu: "Senior Developer",
        content: "Great work",
        hashtags: ["#Teamwork"],
      };
      const result = validateWriteKudo(form);
      expect(result.errors.recipient).toBeDefined();
    });

    it("returns error when recipient is newline only", () => {
      const form: WriteKudoForm = {
        recipient: "\n",
        danhHieu: "Senior Developer",
        content: "Great work",
        hashtags: ["#Teamwork"],
      };
      const result = validateWriteKudo(form);
      expect(result.errors.recipient).toBeDefined();
    });

    it("accepts recipient with non-empty value", () => {
      const form: WriteKudoForm = {
        recipient: "John Doe",
        danhHieu: "Senior Developer",
        content: "Great work",
        hashtags: ["#Teamwork"],
      };
      const result = validateWriteKudo(form);
      expect(result.errors.recipient).toBeUndefined();
    });

    it("accepts recipient with leading/trailing whitespace (trims correctly)", () => {
      const form: WriteKudoForm = {
        recipient: "  John Doe  ",
        danhHieu: "Senior Developer",
        content: "Great work",
        hashtags: ["#Teamwork"],
      };
      const result = validateWriteKudo(form);
      expect(result.errors.recipient).toBeUndefined();
    });

    it("accepts recipient with Vietnamese characters", () => {
      const form: WriteKudoForm = {
        recipient: "Nguyễn Minh Tuấn",
        danhHieu: "Senior Developer",
        content: "Great work",
        hashtags: ["#Teamwork"],
      };
      const result = validateWriteKudo(form);
      expect(result.errors.recipient).toBeUndefined();
    });
  });

  describe("danhHieu field validation (required per clarification)", () => {
    it("returns error when danhHieu is empty string", () => {
      const form: WriteKudoForm = {
        recipient: "John Doe",
        danhHieu: "",
        content: "Great work",
        hashtags: ["#Teamwork"],
      };
      const result = validateWriteKudo(form);
      expect(result.errors.danhHieu).toBeDefined();
      expect(result.errors.danhHieu).toBe("Danh hiệu không được để trống");
    });

    it("returns error when danhHieu is whitespace only", () => {
      const form: WriteKudoForm = {
        recipient: "John Doe",
        danhHieu: "   ",
        content: "Great work",
        hashtags: ["#Teamwork"],
      };
      const result = validateWriteKudo(form);
      expect(result.errors.danhHieu).toBeDefined();
      expect(result.errors.danhHieu).toBe("Danh hiệu không được để trống");
    });

    it("returns error when danhHieu is tab character only", () => {
      const form: WriteKudoForm = {
        recipient: "John Doe",
        danhHieu: "\t",
        content: "Great work",
        hashtags: ["#Teamwork"],
      };
      const result = validateWriteKudo(form);
      expect(result.errors.danhHieu).toBeDefined();
    });

    it("accepts danhHieu with non-empty value", () => {
      const form: WriteKudoForm = {
        recipient: "John Doe",
        danhHieu: "Senior Developer",
        content: "Great work",
        hashtags: ["#Teamwork"],
      };
      const result = validateWriteKudo(form);
      expect(result.errors.danhHieu).toBeUndefined();
    });

    it("accepts danhHieu with leading/trailing whitespace (trims correctly)", () => {
      const form: WriteKudoForm = {
        recipient: "John Doe",
        danhHieu: "  Senior Developer  ",
        content: "Great work",
        hashtags: ["#Teamwork"],
      };
      const result = validateWriteKudo(form);
      expect(result.errors.danhHieu).toBeUndefined();
    });

    it("accepts danhHieu with Vietnamese characters", () => {
      const form: WriteKudoForm = {
        recipient: "John Doe",
        danhHieu: "Nhà Lãnh Đạo Kỹ Thuật",
        content: "Great work",
        hashtags: ["#Teamwork"],
      };
      const result = validateWriteKudo(form);
      expect(result.errors.danhHieu).toBeUndefined();
    });
  });

  describe("content field validation (EC-3)", () => {
    it("returns error when content is empty string", () => {
      const form: WriteKudoForm = {
        recipient: "John Doe",
        danhHieu: "Senior Developer",
        content: "",
        hashtags: ["#Teamwork"],
      };
      const result = validateWriteKudo(form);
      expect(result.errors.content).toBeDefined();
      expect(result.errors.content).toBe("Không được để trống");
    });

    it("returns error when content is whitespace only", () => {
      const form: WriteKudoForm = {
        recipient: "John Doe",
        danhHieu: "Senior Developer",
        content: "   ",
        hashtags: ["#Teamwork"],
      };
      const result = validateWriteKudo(form);
      expect(result.errors.content).toBeDefined();
      expect(result.errors.content).toBe("Không được để trống");
    });

    it("returns error when content is tab/newline only", () => {
      const form: WriteKudoForm = {
        recipient: "John Doe",
        danhHieu: "Senior Developer",
        content: "\t\n ",
        hashtags: ["#Teamwork"],
      };
      const result = validateWriteKudo(form);
      expect(result.errors.content).toBeDefined();
    });

    it("accepts content with non-empty value", () => {
      const form: WriteKudoForm = {
        recipient: "John Doe",
        danhHieu: "Senior Developer",
        content: "Great work on the project",
        hashtags: ["#Teamwork"],
      };
      const result = validateWriteKudo(form);
      expect(result.errors.content).toBeUndefined();
    });

    it("accepts content with leading/trailing whitespace (trims correctly)", () => {
      const form: WriteKudoForm = {
        recipient: "John Doe",
        danhHieu: "Senior Developer",
        content: "  Great work  ",
        hashtags: ["#Teamwork"],
      };
      const result = validateWriteKudo(form);
      expect(result.errors.content).toBeUndefined();
    });

    it("accepts single character content", () => {
      const form: WriteKudoForm = {
        recipient: "John Doe",
        danhHieu: "Senior Developer",
        content: "x",
        hashtags: ["#Teamwork"],
      };
      const result = validateWriteKudo(form);
      expect(result.errors.content).toBeUndefined();
    });

    it("accepts long content with Vietnamese characters", () => {
      const form: WriteKudoForm = {
        recipient: "John Doe",
        danhHieu: "Senior Developer",
        content: "Cảm ơn bạn vì đã làm việc rất tốt trên dự án này. Bạn thật là một thành viên quý giá của đội.",
        hashtags: ["#Teamwork"],
      };
      const result = validateWriteKudo(form);
      expect(result.errors.content).toBeUndefined();
    });

    it("accepts content with internal whitespace/newlines (multiline)", () => {
      const form: WriteKudoForm = {
        recipient: "John Doe",
        danhHieu: "Senior Developer",
        content: "Great work\non the\nproject",
        hashtags: ["#Teamwork"],
      };
      const result = validateWriteKudo(form);
      expect(result.errors.content).toBeUndefined();
    });
  });

  describe("hashtags field validation (EC-4: 1–5 required)", () => {
    it("returns error when hashtags array is empty", () => {
      const form: WriteKudoForm = {
        recipient: "John Doe",
        danhHieu: "Senior Developer",
        content: "Great work",
        hashtags: [],
      };
      const result = validateWriteKudo(form);
      expect(result.errors.hashtags).toBeDefined();
      expect(result.errors.hashtags).toBe("Không được để trống");
    });

    it("accepts hashtags with exactly 1 tag", () => {
      const form: WriteKudoForm = {
        recipient: "John Doe",
        danhHieu: "Senior Developer",
        content: "Great work",
        hashtags: ["#Teamwork"],
      };
      const result = validateWriteKudo(form);
      expect(result.errors.hashtags).toBeUndefined();
    });

    it("accepts hashtags with exactly 2 tags", () => {
      const form: WriteKudoForm = {
        recipient: "John Doe",
        danhHieu: "Senior Developer",
        content: "Great work",
        hashtags: ["#Teamwork", "#Leadership"],
      };
      const result = validateWriteKudo(form);
      expect(result.errors.hashtags).toBeUndefined();
    });

    it("accepts hashtags with exactly 3 tags", () => {
      const form: WriteKudoForm = {
        recipient: "John Doe",
        danhHieu: "Senior Developer",
        content: "Great work",
        hashtags: ["#Teamwork", "#Leadership", "#Communication"],
      };
      const result = validateWriteKudo(form);
      expect(result.errors.hashtags).toBeUndefined();
    });

    it("accepts hashtags with exactly 4 tags", () => {
      const form: WriteKudoForm = {
        recipient: "John Doe",
        danhHieu: "Senior Developer",
        content: "Great work",
        hashtags: ["#Teamwork", "#Leadership", "#Communication", "#Innovation"],
      };
      const result = validateWriteKudo(form);
      expect(result.errors.hashtags).toBeUndefined();
    });

    it("accepts hashtags with exactly 5 tags (maximum)", () => {
      const form: WriteKudoForm = {
        recipient: "John Doe",
        danhHieu: "Senior Developer",
        content: "Great work",
        hashtags: ["#Teamwork", "#Leadership", "#Communication", "#Innovation", "#Mentoring"],
      };
      const result = validateWriteKudo(form);
      expect(result.errors.hashtags).toBeUndefined();
    });

    it("returns error when hashtags has 6 tags (exceeds maximum)", () => {
      const form: WriteKudoForm = {
        recipient: "John Doe",
        danhHieu: "Senior Developer",
        content: "Great work",
        hashtags: ["#Teamwork", "#Leadership", "#Communication", "#Innovation", "#Mentoring", "#Dedicated"],
      };
      const result = validateWriteKudo(form);
      expect(result.errors.hashtags).toBeDefined();
      expect(result.errors.hashtags).toBe("Tối đa 5 hashtag");
    });

    it("returns error when hashtags has 10 tags (well exceeds maximum)", () => {
      const form: WriteKudoForm = {
        recipient: "John Doe",
        danhHieu: "Senior Developer",
        content: "Great work",
        hashtags: [
          "#Teamwork",
          "#Leadership",
          "#Communication",
          "#Innovation",
          "#Mentoring",
          "#Dedicated",
          "#Inspiring",
          "#Technical",
          "#Supportive",
          "#Extra",
        ],
      };
      const result = validateWriteKudo(form);
      expect(result.errors.hashtags).toBeDefined();
      expect(result.errors.hashtags).toBe("Tối đa 5 hashtag");
    });

    it("accepts hashtags with Vietnamese characters", () => {
      const form: WriteKudoForm = {
        recipient: "John Doe",
        danhHieu: "Senior Developer",
        content: "Great work",
        hashtags: ["#Nỗ Lực", "#Sáng Tạo"],
      };
      const result = validateWriteKudo(form);
      expect(result.errors.hashtags).toBeUndefined();
    });

    it("accepts hashtags with special characters (underscores, numbers)", () => {
      const form: WriteKudoForm = {
        recipient: "John Doe",
        danhHieu: "Senior Developer",
        content: "Great work",
        hashtags: ["#Teamwork_2024", "#Leadership_v2"],
      };
      const result = validateWriteKudo(form);
      expect(result.errors.hashtags).toBeUndefined();
    });
  });

  describe("isValid flag", () => {
    it("returns isValid=true when all fields are valid", () => {
      const form: WriteKudoForm = {
        recipient: "John Doe",
        danhHieu: "Senior Developer",
        content: "Great work",
        hashtags: ["#Teamwork"],
      };
      const result = validateWriteKudo(form);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors).length).toBe(0);
    });

    it("returns isValid=false when recipient is missing", () => {
      const form: WriteKudoForm = {
        recipient: "",
        danhHieu: "Senior Developer",
        content: "Great work",
        hashtags: ["#Teamwork"],
      };
      const result = validateWriteKudo(form);
      expect(result.isValid).toBe(false);
    });

    it("returns isValid=false when danhHieu is missing", () => {
      const form: WriteKudoForm = {
        recipient: "John Doe",
        danhHieu: "",
        content: "Great work",
        hashtags: ["#Teamwork"],
      };
      const result = validateWriteKudo(form);
      expect(result.isValid).toBe(false);
    });

    it("returns isValid=false when content is missing", () => {
      const form: WriteKudoForm = {
        recipient: "John Doe",
        danhHieu: "Senior Developer",
        content: "",
        hashtags: ["#Teamwork"],
      };
      const result = validateWriteKudo(form);
      expect(result.isValid).toBe(false);
    });

    it("returns isValid=false when hashtags is empty", () => {
      const form: WriteKudoForm = {
        recipient: "John Doe",
        danhHieu: "Senior Developer",
        content: "Great work",
        hashtags: [],
      };
      const result = validateWriteKudo(form);
      expect(result.isValid).toBe(false);
    });

    it("returns isValid=false when all fields are invalid", () => {
      const form: WriteKudoForm = {
        recipient: "",
        danhHieu: "",
        content: "",
        hashtags: [],
      };
      const result = validateWriteKudo(form);
      expect(result.isValid).toBe(false);
      expect(Object.keys(result.errors).length).toBe(4);
    });

    it("returns isValid=false when recipient and hashtags are invalid", () => {
      const form: WriteKudoForm = {
        recipient: "   ",
        danhHieu: "Senior Developer",
        content: "Great work",
        hashtags: [],
      };
      const result = validateWriteKudo(form);
      expect(result.isValid).toBe(false);
      expect(Object.keys(result.errors).length).toBe(2);
    });
  });

  describe("error object structure", () => {
    it("has no error keys when form is valid", () => {
      const form: WriteKudoForm = {
        recipient: "John Doe",
        danhHieu: "Senior Developer",
        content: "Great work",
        hashtags: ["#Teamwork"],
      };
      const result = validateWriteKudo(form);
      expect(result.errors).toEqual({});
    });

    it("includes only recipient error when recipient is invalid", () => {
      const form: WriteKudoForm = {
        recipient: "",
        danhHieu: "Senior Developer",
        content: "Great work",
        hashtags: ["#Teamwork"],
      };
      const result = validateWriteKudo(form);
      expect(Object.keys(result.errors)).toContain("recipient");
      expect(Object.keys(result.errors)).not.toContain("danhHieu");
      expect(Object.keys(result.errors)).not.toContain("content");
      expect(Object.keys(result.errors)).not.toContain("hashtags");
    });

    it("includes only danhHieu error when danhHieu is invalid", () => {
      const form: WriteKudoForm = {
        recipient: "John Doe",
        danhHieu: "",
        content: "Great work",
        hashtags: ["#Teamwork"],
      };
      const result = validateWriteKudo(form);
      expect(Object.keys(result.errors)).toContain("danhHieu");
      expect(Object.keys(result.errors)).not.toContain("recipient");
      expect(Object.keys(result.errors)).not.toContain("content");
      expect(Object.keys(result.errors)).not.toContain("hashtags");
    });

    it("includes only content error when content is invalid", () => {
      const form: WriteKudoForm = {
        recipient: "John Doe",
        danhHieu: "Senior Developer",
        content: "",
        hashtags: ["#Teamwork"],
      };
      const result = validateWriteKudo(form);
      expect(Object.keys(result.errors)).toContain("content");
      expect(Object.keys(result.errors)).not.toContain("recipient");
      expect(Object.keys(result.errors)).not.toContain("danhHieu");
      expect(Object.keys(result.errors)).not.toContain("hashtags");
    });

    it("includes only hashtags error when hashtags is invalid", () => {
      const form: WriteKudoForm = {
        recipient: "John Doe",
        danhHieu: "Senior Developer",
        content: "Great work",
        hashtags: [],
      };
      const result = validateWriteKudo(form);
      expect(Object.keys(result.errors)).toContain("hashtags");
      expect(Object.keys(result.errors)).not.toContain("recipient");
      expect(Object.keys(result.errors)).not.toContain("danhHieu");
      expect(Object.keys(result.errors)).not.toContain("content");
    });

    it("includes all error keys when all fields are invalid", () => {
      const form: WriteKudoForm = {
        recipient: "",
        danhHieu: "",
        content: "",
        hashtags: [],
      };
      const result = validateWriteKudo(form);
      expect(Object.keys(result.errors).sort()).toEqual(
        ["recipient", "danhHieu", "content", "hashtags"].sort()
      );
    });

    it("includes correct error keys for partial failures", () => {
      const form: WriteKudoForm = {
        recipient: "",
        danhHieu: "Senior Developer",
        content: "",
        hashtags: ["#Teamwork"],
      };
      const result = validateWriteKudo(form);
      expect(Object.keys(result.errors).sort()).toEqual(
        ["recipient", "content"].sort()
      );
    });

    it("error values are non-empty strings", () => {
      const form: WriteKudoForm = {
        recipient: "",
        danhHieu: "",
        content: "",
        hashtags: [],
      };
      const result = validateWriteKudo(form);
      Object.values(result.errors).forEach((error) => {
        expect(typeof error).toBe("string");
        expect(error.length).toBeGreaterThan(0);
      });
    });
  });

  describe("edge cases and boundary conditions", () => {
    it("handles form with single space in each field (all should fail trim check)", () => {
      const form: WriteKudoForm = {
        recipient: " ",
        danhHieu: " ",
        content: " ",
        hashtags: [],
      };
      const result = validateWriteKudo(form);
      expect(result.isValid).toBe(false);
      expect(Object.keys(result.errors).length).toBe(4);
    });

    it("handles extremely long recipient name", () => {
      const form: WriteKudoForm = {
        recipient: "A".repeat(1000),
        danhHieu: "Senior Developer",
        content: "Great work",
        hashtags: ["#Teamwork"],
      };
      const result = validateWriteKudo(form);
      expect(result.errors.recipient).toBeUndefined();
      expect(result.isValid).toBe(true);
    });

    it("handles extremely long content", () => {
      const form: WriteKudoForm = {
        recipient: "John Doe",
        danhHieu: "Senior Developer",
        content: "X".repeat(10000),
        hashtags: ["#Teamwork"],
      };
      const result = validateWriteKudo(form);
      expect(result.errors.content).toBeUndefined();
      expect(result.isValid).toBe(true);
    });

    it("handles hashtags with exactly boundary values (1 and 5)", () => {
      const form1: WriteKudoForm = {
        recipient: "John Doe",
        danhHieu: "Senior Developer",
        content: "Great work",
        hashtags: ["#One"],
      };
      const form5: WriteKudoForm = {
        recipient: "John Doe",
        danhHieu: "Senior Developer",
        content: "Great work",
        hashtags: ["#One", "#Two", "#Three", "#Four", "#Five"],
      };
      expect(validateWriteKudo(form1).isValid).toBe(true);
      expect(validateWriteKudo(form5).isValid).toBe(true);
    });

    it("handles hashtags just beyond maximum (6 tags)", () => {
      const form: WriteKudoForm = {
        recipient: "John Doe",
        danhHieu: "Senior Developer",
        content: "Great work",
        hashtags: ["#One", "#Two", "#Three", "#Four", "#Five", "#Six"],
      };
      const result = validateWriteKudo(form);
      expect(result.isValid).toBe(false);
      expect(result.errors.hashtags).toBe("Tối đa 5 hashtag");
    });

    it("returns WriteKudoValidationResult with correct type signature", () => {
      const form: WriteKudoForm = {
        recipient: "John Doe",
        danhHieu: "Senior Developer",
        content: "Great work",
        hashtags: ["#Teamwork"],
      };
      const result = validateWriteKudo(form);

      // Verify the result structure
      expect(result).toHaveProperty("errors");
      expect(result).toHaveProperty("isValid");
      expect(typeof result.isValid).toBe("boolean");
      expect(typeof result.errors).toBe("object");
    });
  });

  describe("type safety and interface compliance", () => {
    it("accepts properly typed WriteKudoForm", () => {
      const form: WriteKudoForm = {
        recipient: "John Doe",
        danhHieu: "Senior Developer",
        content: "Great work",
        hashtags: ["#Teamwork"],
      };
      expect(() => validateWriteKudo(form)).not.toThrow();
    });

    it("returns WriteKudoValidationResult with correct properties", () => {
      const form: WriteKudoForm = {
        recipient: "John Doe",
        danhHieu: "Senior Developer",
        content: "Great work",
        hashtags: ["#Teamwork"],
      };
      const result: WriteKudoValidationResult = validateWriteKudo(form);

      expect(result).toBeDefined();
      expect("errors" in result).toBe(true);
      expect("isValid" in result).toBe(true);
    });
  });

  describe("consistency and repeatability", () => {
    it("produces consistent results for identical input (5 calls)", () => {
      const form: WriteKudoForm = {
        recipient: "John Doe",
        danhHieu: "Senior Developer",
        content: "Great work",
        hashtags: ["#Teamwork"],
      };
      const results = [
        validateWriteKudo(form),
        validateWriteKudo(form),
        validateWriteKudo(form),
        validateWriteKudo(form),
        validateWriteKudo(form),
      ];

      // All should be valid
      results.forEach((result) => {
        expect(result.isValid).toBe(true);
        expect(Object.keys(result.errors).length).toBe(0);
      });
    });

    it("produces consistent error messages for same invalid input", () => {
      const form: WriteKudoForm = {
        recipient: "",
        danhHieu: "Senior Developer",
        content: "Great work",
        hashtags: ["#Teamwork"],
      };
      const result1 = validateWriteKudo(form);
      const result2 = validateWriteKudo(form);

      expect(result1.errors.recipient).toBe(result2.errors.recipient);
    });
  });
});
