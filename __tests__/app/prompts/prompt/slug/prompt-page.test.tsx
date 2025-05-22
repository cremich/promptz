import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import PromptDetailPage, {
  generateMetadata,
} from "@/app/prompts/prompt/[slug]/prompt-page";
import { notFound } from "next/navigation";
import { Prompt } from "@/app/lib/prompt-model";

// Mock the notFound function
jest.mock("next/navigation", () => ({
  notFound: jest.fn(),
}));

// Mock the fetch prompt action
jest.mock("@/lib/actions/fetch-prompts-action", () => ({
  fetchPromptBySlug: jest.fn(),
}));

// Mock the PromptDetail component
jest.mock("@/app/ui/prompts/prompt", () => {
  return function PromptDetail({ prompt }: { prompt: Prompt }) {
    return (
      <div data-testid="prompt-detail">
        <h2>{prompt.title}</h2>
        <p>{prompt.description}</p>
      </div>
    );
  };
});

// Sample prompt data for testing
const mockPrompt = {
  id: "123",
  title: "Test Prompt",
  description: "This is a test prompt",
  content: "Test content",
  slug: "test-prompt",
  author: "Test Author",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  tags: ["test"],
  public: true,
};

describe("PromptDetailPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Renders prompt detail when prompt is found", async () => {
    // Setup mock to return a prompt
    const { fetchPromptBySlug } = require("@/lib/actions/fetch-prompts-action");
    fetchPromptBySlug.mockResolvedValue(mockPrompt);

    // Render the component
    render(
      await PromptDetailPage({
        params: Promise.resolve({ slug: "test-prompt" }),
      }),
    );

    // Check if PromptDetail component is rendered with correct data
    expect(screen.getByTestId("prompt-detail")).toBeInTheDocument();
    expect(screen.getByText("Test Prompt")).toBeInTheDocument();
    expect(screen.getByText("This is a test prompt")).toBeInTheDocument();
  });

  test("Calls notFound when prompt is not found", async () => {
    // Setup mock to return null (prompt not found)
    const { fetchPromptBySlug } = require("@/lib/actions/fetch-prompts-action");
    fetchPromptBySlug.mockResolvedValue(null);

    // Render the component
    await PromptDetailPage({
      params: Promise.resolve({ slug: "non-existent" }),
    });

    // Check if notFound was called
    expect(notFound).toHaveBeenCalled();
  });
});

describe("generateMetadata", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Returns correct metadata when prompt is found", async () => {
    // Setup mock to return a prompt
    const { fetchPromptBySlug } = require("@/lib/actions/fetch-prompts-action");
    fetchPromptBySlug.mockResolvedValue(mockPrompt);

    // Generate metadata
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: "test-prompt" }),
    });

    // Check metadata values
    expect(metadata.title).toBe("Test Prompt prompt for Amazon Q Developer");
    expect(metadata.description).toBe("This is a test prompt");
    expect(metadata.openGraph?.title).toBe(
      "Test Prompt prompt for Amazon Q Developer",
    );
    expect(metadata.openGraph?.description).toBe("This is a test prompt");
  });

  test("Returns fallback metadata when prompt is not found", async () => {
    // Setup mock to return null (prompt not found)
    const { fetchPromptBySlug } = require("@/lib/actions/fetch-prompts-action");
    fetchPromptBySlug.mockResolvedValue(null);

    // Generate metadata
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: "non-existent" }),
    });

    // Check metadata values
    expect(metadata.title).toBe("Prompt Not Found");
    expect(metadata.description).toBeUndefined();
  });
});
