import { describe, expect, test } from "@jest/globals";
import Image, {
  alt,
  size,
  contentType,
  runtime,
} from "@/app/agents/agent/[slug]/opengraph-image";
import { fetchAgentBySlug } from "@/lib/actions/fetch-agents-action";
import { ImageResponse } from "next/og";
import { Agent } from "@/lib/models/agent-model";

// Mock dependencies
jest.mock("@/lib/actions/fetch-agents-action", () => ({
  fetchAgentBySlug: jest.fn(),
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

describe("Agent OpenGraph Image", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Exports correct metadata", () => {
    // Test static exports
    expect(runtime).toBe("edge");
    expect(alt).toBe(
      "Image of an agent for Amazon Q Developer from promptz.dev",
    );
    expect(size).toEqual({ width: 1200, height: 630 });
    expect(contentType).toBe("image/png");
  });

  test("Renders image with agent data", async () => {
    // Mock agent data
    const mockAgent: Agent = {
      name: "Test Agent",
      description: "This is a test agent description",
      author: "Test Author",
      tags: ["development", "testing"],
    };

    // Setup mock
    (fetchAgentBySlug as jest.Mock).mockResolvedValue(mockAgent);

    // Call the component
    const result = await Image({ params: { slug: "test-agent" } });

    // Verify ImageResponse was called
    expect(ImageResponse).toHaveBeenCalled();

    // Convert element to string to check content
    const elementString = JSON.stringify(result);

    // Check if agent data is included in the element
    expect(elementString).toContain("TEST AGENT"); // Title should be uppercase
    expect(elementString).toContain("This is a test agent description");
    expect(elementString).toContain("Test Author");
    expect(elementString).toContain("development");
    expect(elementString).toContain("testing");
  });

  test("Handles agent with no tags", async () => {
    // Mock agent data without tags
    const mockAgent: Agent = {
      name: "Agent Without Tags",
      description: "An agent with no tags",
      author: "Test Author",
      tags: undefined,
    };

    // Setup mock
    (fetchAgentBySlug as jest.Mock).mockResolvedValue(mockAgent);

    // Call the component
    const result = await Image({ params: { slug: "agent-without-tags" } });

    // Verify ImageResponse was called
    expect(ImageResponse).toHaveBeenCalled();
    expect(result).toBeDefined();
  });

  test("Handles agent with empty tags array", async () => {
    // Mock agent data with empty tags
    const mockAgent: Agent = {
      name: "Agent With Empty Tags",
      description: "An agent with empty tags array",
      author: "Test Author",
      tags: [],
    };

    // Setup mock
    (fetchAgentBySlug as jest.Mock).mockResolvedValue(mockAgent);

    // Call the component
    const result = await Image({ params: { slug: "agent-with-empty-tags" } });

    // Verify ImageResponse was called
    expect(ImageResponse).toHaveBeenCalled();
    expect(result).toBeDefined();
  });
});
