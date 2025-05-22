import { describe, expect, test } from "@jest/globals";
import { ImageResponse } from "next/og";
import { fetchProjectRuleBySlug } from "@/lib/actions/fetch-rules-action";
import Image from "@/app/rules/rule/[slug]/opengraph-image";

// Mock dependencies before importing the component
jest.mock("@/lib/actions/fetch-rules-action", () => ({
  fetchProjectRuleBySlug: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  notFound: jest.fn(),
}));

jest.mock("next/og", () => ({
  ImageResponse: jest.fn().mockImplementation((element) => ({
    element,
    type: "image/png",
    width: 1200,
    height: 630,
  })),
}));

describe("OpenGraph Image", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Renders image with project rule data", async () => {
    // Arrange
    const mockProjectRule = {
      title: "Test Rule",
      description: "This is a test rule description",
      author: "testuser",
      tags: ["test", "rule"],
    };

    (fetchProjectRuleBySlug as jest.Mock).mockResolvedValue(mockProjectRule);

    // Act
    const result = await Image({ params: { slug: "test-rule" } });

    // Assert
    expect(fetchProjectRuleBySlug).toHaveBeenCalledWith("test-rule");
    expect(ImageResponse).toHaveBeenCalled();
    expect(result).toBeDefined();
  });
});
