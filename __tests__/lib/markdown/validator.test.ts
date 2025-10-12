import {
  PromptFrontmatterSchema,
  validateSecurity,
  validateFileName,
  validateContent,
  extractContentSections,
  validateFrontmatter,
  validateMarkdownContent,
  hasBase64Content,
  hasImageDataUrls,
  hasScriptTags,
  hasSuspiciousUnicode,
} from "../../../lib/markdown/validator";

describe("Markdown Validator", () => {
  describe("PromptFrontmatterSchema", () => {
    test("should validate valid frontmatter", () => {
      const validFrontmatter = {
        title: "Test Prompt",
        description: "This is a test prompt description",
        author: "test-author",
        tags: ["test", "validation"],
        sourceURL: "https://example.com",
      };

      const result = PromptFrontmatterSchema.safeParse(validFrontmatter);
      expect(result.success).toBe(true);
    });

    test("should reject missing required fields", () => {
      const invalidFrontmatter = {
        title: "Test Prompt",
        // missing description and author
      };

      const result = PromptFrontmatterSchema.safeParse(invalidFrontmatter);
      expect(result.success).toBe(false);
      expect(result.error!.issues).toHaveLength(2);
      expect(result.error!.issues[0].path).toEqual(["description"]);
      expect(result.error!.issues[1].path).toEqual(["author"]);
    });

    test("should reject title that is too long", () => {
      const invalidFrontmatter = {
        title: "A".repeat(101), // 101 characters
        description: "Valid description",
        author: "test-author",
      };

      const result = PromptFrontmatterSchema.safeParse(invalidFrontmatter);
      expect(result.success).toBe(false);
      expect(result.error!.issues[0].message).toContain(
        "100 characters or less",
      );
    });

    test("should reject description that is too short", () => {
      const invalidFrontmatter = {
        title: "Valid Title",
        description: "Short", // Less than 10 characters
        author: "test-author",
      };

      const result = PromptFrontmatterSchema.safeParse(invalidFrontmatter);
      expect(result.success).toBe(false);
      expect(result.error!.issues[0].message).toContain(
        "at least 10 characters",
      );
    });

    test("should reject too many tags", () => {
      const invalidFrontmatter = {
        title: "Valid Title",
        description: "Valid description",
        author: "test-author",
        tags: Array(11).fill("tag"), // 11 tags
      };

      const result = PromptFrontmatterSchema.safeParse(invalidFrontmatter);
      expect(result.success).toBe(false);
      expect(result.error!.issues[0].message).toContain(
        "Maximum 10 tags allowed",
      );
    });

    test("should reject invalid URL", () => {
      const invalidFrontmatter = {
        title: "Valid Title",
        description: "Valid description",
        author: "test-author",
        sourceURL: "not-a-url",
      };

      const result = PromptFrontmatterSchema.safeParse(invalidFrontmatter);
      expect(result.success).toBe(false);
      expect(result.error!.issues[0].message).toContain("Invalid URL format");
    });
  });

  describe("Security validation functions", () => {
    describe("hasBase64Content", () => {
      test("should detect base64 data URLs", () => {
        const content =
          "Here is an image: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==";
        expect(hasBase64Content(content)).toBe(true);
      });

      test("should detect long base64 strings", () => {
        const content = "Here is some base64: " + "A".repeat(50) + "==";
        expect(hasBase64Content(content)).toBe(true);
      });

      test("should not detect short base64-like strings", () => {
        const content = "Some text with ABC123 and other normal content";
        expect(hasBase64Content(content)).toBe(false);
      });
    });

    describe("hasImageDataUrls", () => {
      test("should detect image data URLs", () => {
        const content = "data:image/png;base64,iVBORw0KGgo=";
        expect(hasImageDataUrls(content)).toBe(true);
      });

      test("should not detect non-image data URLs", () => {
        const content = "data:text/plain;base64,SGVsbG8=";
        expect(hasImageDataUrls(content)).toBe(false);
      });
    });

    describe("hasScriptTags", () => {
      test("should detect script tags", () => {
        const content =
          'Some content <script>alert("xss")</script> more content';
        expect(hasScriptTags(content)).toBe(true);
      });

      test("should detect script tags with attributes", () => {
        const content =
          '<script type="text/javascript">console.log("test")</script>';
        expect(hasScriptTags(content)).toBe(true);
      });

      test("should not detect normal HTML tags", () => {
        const content = "<div>Normal content</div>";
        expect(hasScriptTags(content)).toBe(false);
      });
    });

    describe("hasSuspiciousUnicode", () => {
      test("should detect zero-width characters", () => {
        const content = "Normal text\u200B hidden text"; // Zero-width space
        expect(hasSuspiciousUnicode(content)).toBe(true);
      });

      test("should allow normal whitespace characters", () => {
        const content = "Normal text\nwith newlines\tand tabs\r";
        expect(hasSuspiciousUnicode(content)).toBe(false);
      });

      test("should allow normal Unicode characters", () => {
        const content = "Text with émojis 🚀 and accénts";
        expect(hasSuspiciousUnicode(content)).toBe(false);
      });
    });

    describe("validateSecurity", () => {
      test("should return multiple issues for malicious content", () => {
        const content =
          '<script>alert("xss")</script>data:image/png;base64,iVBORw0KGgo=';
        const issues = validateSecurity(content);
        expect(issues).toContain("Contains script tags which are not allowed");
        expect(issues).toContain(
          "Contains image data URLs which are not allowed",
        );
      });

      test("should return empty array for safe content", () => {
        const content =
          "This is normal markdown content with @mentions and #hashtags";
        const issues = validateSecurity(content);
        expect(issues).toHaveLength(0);
      });
    });
  });

  describe("validateFileName", () => {
    test("should accept valid filenames", () => {
      expect(validateFileName("valid-filename.md")).toBe(true);
      expect(validateFileName("test123.md")).toBe(true);
      expect(validateFileName("a-b-c-123.md")).toBe(true);
    });

    test("should reject invalid filenames", () => {
      expect(validateFileName("Invalid_Filename.md")).toBe(false);
      expect(validateFileName("Invalid Filename.md")).toBe(false);
      expect(validateFileName("UPPERCASE.md")).toBe(false);
      expect(validateFileName("file.txt")).toBe(false);
      expect(validateFileName("file")).toBe(false);
    });
  });

  describe("validateContent", () => {
    test("should accept valid content", () => {
      const content = "This is a valid prompt content that is long enough";
      const howto = "This is how to use this prompt";
      const issues = validateContent(content, howto);
      expect(issues).toHaveLength(0);
    });

    test("should reject content that is too short", () => {
      const content = "Short";
      const howto = "Valid howto";
      const issues = validateContent(content, howto);
      expect(issues).toContain(
        "Main prompt content must be at least 10 characters",
      );
    });

    test("should reject content that is too long", () => {
      const content = "A".repeat(4001);
      const howto = "Valid howto";
      const issues = validateContent(content, howto);
      expect(issues).toContain(
        "Main prompt content must be 4000 characters or less",
      );
    });

    test("should reject missing howto section", () => {
      const content = "Valid content";
      const howto = "";
      const issues = validateContent(content, howto);
      expect(issues).toContain(
        "'How to Use' section is required and cannot be empty",
      );
    });
  });

  describe("extractContentSections", () => {
    test("should extract content and howto sections", () => {
      const markdown = `# Main Content
This is the main prompt content.

## How to Use
This is how to use the prompt.`;

      const { content, howto } = extractContentSections(markdown);
      expect(content).toBe("# Main Content\nThis is the main prompt content.");
      expect(howto).toBe("This is how to use the prompt.");
    });

    test("should handle missing howto section", () => {
      const markdown = `# Main Content
This is the main prompt content.`;

      const { content, howto } = extractContentSections(markdown);
      expect(content).toBe("# Main Content\nThis is the main prompt content.");
      expect(howto).toBe("");
    });

    test("should handle case-insensitive howto header", () => {
      const markdown = `# Main Content
This is the main prompt content.

## HOW TO USE
This is how to use the prompt.`;

      const { content, howto } = extractContentSections(markdown);
      expect(content).toBe("# Main Content\nThis is the main prompt content.");
      expect(howto).toBe("This is how to use the prompt.");
    });
  });

  describe("validateFrontmatter", () => {
    test("should return empty array for valid frontmatter", () => {
      const frontmatter = {
        title: "Test Prompt",
        description: "This is a test prompt description",
        author: "test-author",
      };

      const errors = validateFrontmatter(frontmatter);
      expect(errors).toHaveLength(0);
    });

    test("should return formatted error messages", () => {
      const frontmatter = {
        title: "",
        description: "Short",
      };

      const errors = validateFrontmatter(frontmatter);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]).toContain("Frontmatter title:");
      expect(errors.some((e) => e.includes("Frontmatter description:"))).toBe(
        true,
      );
      expect(errors.some((e) => e.includes("Frontmatter author:"))).toBe(true);
    });
  });

  describe("validateMarkdownContent", () => {
    test("should validate a complete valid markdown file", () => {
      const validMarkdown = `---
title: "Test Prompt"
description: "This is a test prompt for validation"
author: "test-author"
tags: ["test", "validation"]
---

# Test Prompt

This is a valid prompt content that meets all requirements.

## How to Use

1. Copy the prompt
2. Use it in your application
3. Enjoy the results`;

      const result = validateMarkdownContent(validMarkdown, "valid-prompt.md");
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test("should detect multiple validation errors", () => {
      const invalidMarkdown = `---
title: ""
description: "Short"
author: ""
sourceURL: "not-a-url"
---

# Test

Short content.`;

      const result = validateMarkdownContent(
        invalidMarkdown,
        "Invalid_File_Name.md",
      );
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);

      // Check for specific error types
      const errorMessages = result.errors.join(" ");
      expect(errorMessages).toContain("File name must follow pattern");
      expect(errorMessages).toContain("Title is required");
      expect(errorMessages).toContain("at least 10 characters");
      expect(errorMessages).toContain("How to Use");
    });

    test("should handle malformed frontmatter", () => {
      const invalidMarkdown = `---
title: "Test
description: "Missing quote
---

# Content`;

      const result = validateMarkdownContent(invalidMarkdown, "malformed.md");
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    test("should detect security issues", () => {
      const maliciousMarkdown = `---
title: "Malicious Prompt"
description: "This prompt contains malicious content"
author: "attacker"
---

# Malicious Content

<script>alert('xss')</script>

## How to Use

Use with caution.`;

      const result = validateMarkdownContent(maliciousMarkdown, "malicious.md");
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(
        "Contains script tags which are not allowed",
      );
    });

    test("should generate warnings for HTTP URLs", () => {
      const httpMarkdown = `---
title: "HTTP URL Prompt"
description: "This prompt has an HTTP source URL"
author: "test-author"
sourceURL: "http://example.com"
---

# HTTP URL Test

This prompt has an HTTP source URL.

## How to Use

Use normally.`;

      const result = validateMarkdownContent(httpMarkdown, "http-url.md");
      expect(result.valid).toBe(true);
      expect(result.warnings).toContain(
        "Source URL should use HTTPS for security",
      );
    });
  });
});
