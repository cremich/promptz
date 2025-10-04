import { describe, test, expect } from "@jest/globals";
import type { PromptFrontmatter, ParsedMarkdown } from "@/lib/markdown/types";

describe("PromptFrontmatter type", () => {
  test("should accept valid frontmatter with all fields", () => {
    const frontmatter: PromptFrontmatter = {
      title: "Test Title",
      description: "Test description",
      author: "test-author",
      tags: ["tag1", "tag2"],
      sourceURL: "https://example.com",
    };

    expect(frontmatter.title).toBe("Test Title");
    expect(frontmatter.description).toBe("Test description");
    expect(frontmatter.author).toBe("test-author");
    expect(frontmatter.tags).toEqual(["tag1", "tag2"]);
    expect(frontmatter.sourceURL).toBe("https://example.com");
  });

  test("should accept minimal required frontmatter", () => {
    const frontmatter: PromptFrontmatter = {
      title: "Test Title",
      description: "Test description",
      author: "test-author",
    };

    expect(frontmatter.title).toBe("Test Title");
    expect(frontmatter.description).toBe("Test description");
    expect(frontmatter.author).toBe("test-author");
    expect(frontmatter.tags).toBeUndefined();
    expect(frontmatter.sourceURL).toBeUndefined();
  });
});

describe("ParsedMarkdown type", () => {
  test("should structure parsed markdown correctly", () => {
    const parsed: ParsedMarkdown = {
      frontmatter: {
        title: "Test Title",
        description: "Test description",
        author: "test-author",
      },
      content: "Main content",
      rawContent: "# Test\n\nMain content",
    };

    expect(parsed.frontmatter.title).toBe("Test Title");
    expect(parsed.content).toBe("Main content");
    expect(parsed.rawContent).toBe("# Test\n\nMain content");
  });
});
