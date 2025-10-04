import { describe, test, expect } from "@jest/globals";
import { parseMarkdownFile, validateFrontmatter } from "@/lib/markdown/parser";
import type { PromptFrontmatter } from "@/lib/markdown/types";

describe("parseMarkdownFile", () => {
  test("should parse valid markdown with frontmatter", () => {
    const markdownContent = `---
title: "Test Prompt"
description: "A test prompt for validation"
author: "test-author"
tags: ["testing", "validation"]
sourceURL: "https://example.com"
---

# Test Prompt Content

This is the main prompt content.

## How to Use

This is how to use the prompt.`;

    const result = parseMarkdownFile(markdownContent);

    expect(result.frontmatter.title).toBe("Test Prompt");
    expect(result.frontmatter.description).toBe("A test prompt for validation");
    expect(result.frontmatter.author).toBe("test-author");
    expect(result.frontmatter.tags).toEqual(["testing", "validation"]);
    expect(result.frontmatter.sourceURL).toBe("https://example.com");
    expect(result.content).toContain("This is the main prompt content.");
  });

  test("should parse markdown with minimal required frontmatter", () => {
    const markdownContent = `---
title: "Minimal Prompt"
description: "A minimal test prompt"
author: "test-author"
---

# Minimal Content

Just the basics.`;

    const result = parseMarkdownFile(markdownContent);

    expect(result.frontmatter.title).toBe("Minimal Prompt");
    expect(result.frontmatter.description).toBe("A minimal test prompt");
    expect(result.frontmatter.author).toBe("test-author");
    expect(result.frontmatter.tags).toBeUndefined();
    expect(result.frontmatter.sourceURL).toBeUndefined();
  });

  test("should throw error for missing required fields", () => {
    const markdownContent = `---
title: "Incomplete Prompt"
---

# Content without required fields`;

    expect(() => parseMarkdownFile(markdownContent)).toThrow();
  });
});

describe("validateFrontmatter", () => {
  test("should validate complete frontmatter", () => {
    const frontmatter: PromptFrontmatter = {
      title: "Valid Title",
      description: "Valid description",
      author: "valid-author",
      tags: ["tag1", "tag2"],
      sourceURL: "https://example.com",
    };

    expect(() => validateFrontmatter(frontmatter)).not.toThrow();
  });

  test("should validate minimal required frontmatter", () => {
    const frontmatter: PromptFrontmatter = {
      title: "Valid Title",
      description: "Valid description",
      author: "valid-author",
    };

    expect(() => validateFrontmatter(frontmatter)).not.toThrow();
  });

  test("should throw error for missing title", () => {
    const frontmatter = {
      description: "Valid description",
      author: "valid-author",
    } as PromptFrontmatter;

    expect(() => validateFrontmatter(frontmatter)).toThrow("title is required");
  });

  test("should throw error for missing description", () => {
    const frontmatter = {
      title: "Valid Title",
      author: "valid-author",
    } as PromptFrontmatter;

    expect(() => validateFrontmatter(frontmatter)).toThrow(
      "description is required",
    );
  });

  test("should throw error for missing author", () => {
    const frontmatter = {
      title: "Valid Title",
      description: "Valid description",
    } as PromptFrontmatter;

    expect(() => validateFrontmatter(frontmatter)).toThrow(
      "author is required",
    );
  });
});
