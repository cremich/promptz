import { describe, expect, test } from "@jest/globals";
import Image, {
  alt,
  size,
  contentType,
  runtime,
} from "@/app/prompts/prompt/[slug]/opengraph-image";
import { fetchPromptBySlug } from "@/lib/actions/fetch-prompts-action";
import { ImageResponse } from "next/og";

// Mock dependencies
jest.mock("@/lib/actions/fetch-prompts-action", () => ({
  fetchPromptBySlug: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  notFound: jest.fn(),
}));

// Mock ImageResponse
jest.mock("next/og", () => ({
  ImageResponse: jest.fn().mockImplementation((element, options) => {
    return { element, options };
  }),
}));

describe("OpenGraph Image", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Exports correct metadata", () => {
    // Test static exports
    expect(runtime).toBe("edge");
    expect(alt).toBe(
      "Image of a community prompt for Amazon Q Developer from promptz.dev",
    );
    expect(size).toEqual({ width: 1200, height: 630 });
    expect(contentType).toBe("image/png");
  });

  test("Renders image with prompt data", async () => {
    // Mock prompt data
    const mockPrompt = {
      title: "Test Prompt",
      description: "This is a test description",
      author: "Test Author",
      tags: ["tag1", "tag2"],
    };

    // Setup mock
    (fetchPromptBySlug as jest.Mock).mockResolvedValue(mockPrompt);

    // Call the component
    const result = await Image({ params: { slug: "test-prompt" } });

    // Verify ImageResponse was called
    expect(ImageResponse).toHaveBeenCalled();

    // Convert element to string to check content
    const elementString = JSON.stringify(result);

    // Check if prompt data is included in the element
    expect(elementString).toContain("TEST PROMPT"); // Title should be uppercase
    expect(elementString).toContain("This is a test description");
    expect(elementString).toContain("Test Author");
    expect(elementString).toContain("tag1");
    expect(elementString).toContain("tag2");
  });
});
