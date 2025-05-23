import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import EditPromptPage from "@/app/prompts/prompt/[slug]/edit/page";
import { fetchCurrentAuthUser } from "@/lib/actions/cognito-auth-action";
import { fetchPromptBySlug } from "@/lib/actions/fetch-prompts-action";
import { redirect, notFound } from "next/navigation";

// Mock dependencies
jest.mock("@/lib/actions/cognito-auth-action", () => ({
  fetchCurrentAuthUser: jest.fn(),
}));

jest.mock("@/lib/actions/fetch-prompts-action", () => ({
  fetchPromptBySlug: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
  notFound: jest.fn(),
}));

// Mock the PromptForm component
jest.mock("@/components/prompt/prompt-form", () => {
  return function MockPromptForm({ prompt }: { prompt: any }) {
    return (
      <div data-testid="prompt-form">
        <div data-testid="prompt-title">{prompt.title}</div>
      </div>
    );
  };
});

describe("EditPromptPage", () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Redirects to prompt page when user is not the author", async () => {
    // Mock authenticated user
    (fetchCurrentAuthUser as jest.Mock).mockResolvedValue({
      id: "user-123",
      guest: false,
    });

    // Mock prompt with different author
    (fetchPromptBySlug as jest.Mock).mockResolvedValue({
      id: "prompt-123",
      title: "Test Prompt",
      slug: "test-prompt",
      authorId: "different-user-id",
    });

    // Render the component
    await EditPromptPage({
      params: Promise.resolve({ slug: "test-prompt" }),
    });

    // Verify redirect was called with prompt page path
    expect(redirect).toHaveBeenCalledWith("/prompts/prompt/test-prompt");

    // Verify that notFound was not called
    expect(notFound).not.toHaveBeenCalled();
  });

  test("Renders the prompt form when user is the author", async () => {
    // Mock authenticated user
    const mockUser = {
      id: "user-123",
      guest: false,
    };
    (fetchCurrentAuthUser as jest.Mock).mockResolvedValue(mockUser);

    // Mock prompt with same author
    const mockPrompt = {
      id: "prompt-123",
      title: "Test Prompt",
      slug: "test-prompt",
      authorId: "user-123",
    };
    (fetchPromptBySlug as jest.Mock).mockResolvedValue(mockPrompt);

    // Render the component
    const result = await EditPromptPage({
      params: Promise.resolve({ slug: "test-prompt" }),
    });
    render(result);

    // Verify the form is rendered with the prompt data
    expect(screen.getByTestId("prompt-form")).toBeInTheDocument();
    expect(screen.getByTestId("prompt-title")).toHaveTextContent("Test Prompt");

    // Verify page title is rendered
    expect(screen.getByText(/Edit Prompt/)).toBeInTheDocument();
    expect(screen.getByText(/'Test Prompt'/)).toBeInTheDocument();

    // Verify that redirect was not called
    expect(redirect).not.toHaveBeenCalled();
    expect(notFound).not.toHaveBeenCalled();
  });
});
