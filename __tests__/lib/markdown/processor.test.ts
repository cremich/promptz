import { describe, test, expect } from "@jest/globals";
import {
  extractContentSections,
  generateSlugFromFilename,
} from "@/lib/markdown/processor";

describe("extractContentSections", () => {
  test("should extract main content and how-to section", () => {
    const markdownContent = `# Main Prompt

This is the main prompt content with instructions.

## How to Use

1. Copy the prompt above
2. Customize parameters
3. Use in Amazon Q Developer`;

    const result = extractContentSections(markdownContent);

    expect(result.content).toBe(
      "This is the main prompt content with instructions.",
    );
    expect(result.howto).toContain("1. Copy the prompt above");
    expect(result.howto).toContain("2. Customize parameters");
    expect(result.howto).toContain("3. Use in Amazon Q Developer");
  });

  test("should handle content without how-to section", () => {
    const markdownContent = `# Main Prompt

This is just the main content without how-to instructions.`;

    const result = extractContentSections(markdownContent);

    expect(result.content).toBe(
      "This is just the main content without how-to instructions.",
    );
    expect(result.howto).toBe("");
  });

  test("should handle multiple sections and extract only relevant ones", () => {
    const markdownContent = `# Main Title

This is the main prompt content.

## Some Other Section

This should not be included in howto.

## How to Use

This is the how-to section.

## Another Section

This should also not be included.`;

    const result = extractContentSections(markdownContent);

    expect(result.content).toBe("This is the main prompt content.");
    expect(result.howto).toBe("This is the how-to section.");
  });
});

describe("generateSlugFromFilename", () => {
  test("should generate slug from filename", () => {
    const filename = "aws-lambda-best-practices.md";
    const slug = generateSlugFromFilename(filename);
    expect(slug).toBe("aws-lambda-best-practices");
  });

  test("should handle filename without extension", () => {
    const filename = "test-prompt";
    const slug = generateSlugFromFilename(filename);
    expect(slug).toBe("test-prompt");
  });

  test("should handle complex filenames", () => {
    const filename = "create-mermaid-diagrams-from-code.md";
    const slug = generateSlugFromFilename(filename);
    expect(slug).toBe("create-mermaid-diagrams-from-code");
  });
});
