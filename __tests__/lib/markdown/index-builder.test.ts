import { describe, test, expect } from "@jest/globals";
import {
  buildPromptIndex,
  scanMarkdownFiles,
  convertMarkdownToPrompt,
} from "@/lib/markdown/index-builder";
import type { PromptFrontmatter } from "@/lib/markdown/types";

describe("scanMarkdownFiles", () => {
  test("should find markdown files in content directory", async () => {
    const files = await scanMarkdownFiles("content/prompts");

    expect(files.length).toBeGreaterThan(0);
    expect(files.every((file) => file.endsWith(".md"))).toBe(true);
    expect(files.every((file) => file.startsWith("content/prompts/"))).toBe(
      true,
    );
  });

  test("should find files in subdirectories", async () => {
    const files = await scanMarkdownFiles("content/prompts");

    const architectureFiles = files.filter((f) => f.includes("/architecture/"));
    const testingFiles = files.filter((f) => f.includes("/testing/"));

    expect(architectureFiles.length).toBeGreaterThan(0);
    expect(testingFiles.length).toBeGreaterThan(0);
  });
});

describe("convertMarkdownToPrompt", () => {
  test("should convert markdown frontmatter to Prompt object", () => {
    const frontmatter: PromptFrontmatter = {
      title: "AWS Lambda Best Practices",
      description: "Essential patterns for serverless development",
      author: "test-author",
      tags: ["Serverless", "Performance"],
      sourceURL: "https://example.com",
    };

    const content = "This is the main prompt content";
    const howto = "Copy and paste this prompt";
    const category = "architecture";
    const filePath =
      "content/prompts/architecture/aws-lambda-best-practices.md";

    const prompt = convertMarkdownToPrompt(
      frontmatter,
      content,
      howto,
      category,
      filePath,
    );

    expect(prompt.name).toBe("AWS Lambda Best Practices");
    expect(prompt.description).toBe(
      "Essential patterns for serverless development",
    );
    expect(prompt.author).toBe("test-author");
    expect(prompt.tags).toEqual(["architecture", "Serverless", "Performance"]);
    expect(prompt.content).toBe("This is the main prompt content");
    expect(prompt.howto).toBe("Copy and paste this prompt");
    expect(prompt.slug).toBe("aws-lambda-best-practices");
    expect(prompt.sourceURL).toBe("https://example.com");
  });

  test("should handle minimal frontmatter", () => {
    const frontmatter: PromptFrontmatter = {
      title: "Simple Prompt",
      description: "A simple test prompt",
      author: "test-author",
    };

    const prompt = convertMarkdownToPrompt(
      frontmatter,
      "content",
      "",
      "general",
      "simple.md",
    );

    expect(prompt.tags).toEqual(["general"]);
    expect(prompt.sourceURL).toBeUndefined();
  });

  test("should generate deterministic ID from file path", () => {
    const frontmatter: PromptFrontmatter = {
      title: "Test",
      description: "Test",
      author: "test",
    };

    const prompt1 = convertMarkdownToPrompt(
      frontmatter,
      "",
      "",
      "general",
      "content/prompts/general/file1.md",
    );
    const prompt2 = convertMarkdownToPrompt(
      frontmatter,
      "",
      "",
      "architecture",
      "content/prompts/architecture/file2.md",
    );

    expect(prompt1.id).toBe("general-file1");
    expect(prompt2.id).toBe("architecture-file2");

    // Same file path should generate same ID
    const prompt1Again = convertMarkdownToPrompt(
      frontmatter,
      "",
      "",
      "general",
      "content/prompts/general/file1.md",
    );
    expect(prompt1Again.id).toBe(prompt1.id);
  });

  test("should assign category from directory structure", () => {
    const frontmatter: PromptFrontmatter = {
      title: "Test",
      description: "Test",
      author: "test",
    };

    const architecturePrompt = convertMarkdownToPrompt(
      frontmatter,
      "",
      "",
      "architecture",
      "arch.md",
    );
    const testingPrompt = convertMarkdownToPrompt(
      frontmatter,
      "",
      "",
      "testing",
      "test.md",
    );

    expect(architecturePrompt.tags![0]).toBe("architecture");
    expect(testingPrompt.tags![0]).toBe("testing");
  });
});

describe("buildPromptIndex", () => {
  test("should build complete prompt index from existing markdown files", async () => {
    const index = await buildPromptIndex("content/prompts");

    expect(index.prompts.length).toBeGreaterThan(0);
    expect(index.metadata.totalCount).toBe(index.prompts.length);
    expect(index.searchIndex.byTitle.size).toBeGreaterThan(0);
    expect(index.tagIndex.size).toBeGreaterThan(0);
    expect(index.categoryIndex.size).toBeGreaterThan(0);
    expect(index.metadata.lastBuildTime).toBeDefined();
  });

  test("should properly categorize prompts by directory", async () => {
    const index = await buildPromptIndex("content/prompts");

    const architecturePrompts = index.categoryIndex.get("architecture") || [];
    const testingPrompts = index.categoryIndex.get("testing") || [];

    expect(architecturePrompts.length).toBeGreaterThan(0);
    expect(testingPrompts.length).toBeGreaterThan(0);

    // Verify all architecture prompts have architecture as first tag
    architecturePrompts.forEach((prompt) => {
      expect(prompt.tags?.[0]).toBe("architecture");
    });
  });

  test("should build search indexes correctly", async () => {
    const index = await buildPromptIndex("content/prompts");

    // Check that search indexes contain prompts
    expect(index.searchIndex.byTitle.size).toBeGreaterThan(0);
    expect(index.searchIndex.byDescription.size).toBeGreaterThan(0);
    expect(index.searchIndex.byAuthor.size).toBeGreaterThan(0);
    expect(index.searchIndex.byTags.size).toBeGreaterThan(0);

    // Verify a specific author exists
    const cremichPrompts = index.searchIndex.byAuthor.get("cremich") || [];
    expect(cremichPrompts.length).toBeGreaterThan(0);
  });

  test("should merge directory and frontmatter tags", async () => {
    const index = await buildPromptIndex("content/prompts");

    // Find a prompt that should have both directory and frontmatter tags
    const promptWithTags = index.prompts.find(
      (p) => p.tags && p.tags.length > 1,
    );

    expect(promptWithTags).toBeDefined();
    if (promptWithTags) {
      // First tag should be the directory category
      const category = promptWithTags.tags![0];
      expect([
        "architecture",
        "testing",
        "analysis",
        "aws",
        "scaffolding",
        "solutions",
        "persona",
        "general",
        "documentation",
        "code-generation",
        "spec-driven-development",
      ]).toContain(category);

      // Should have additional tags from frontmatter
      expect(promptWithTags.tags!.length).toBeGreaterThan(1);
    }
  });
});
