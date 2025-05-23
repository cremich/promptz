import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import PromptDetailPage, {
  generateMetadata,
} from "@/app/prompts/prompt/[slug]/page";
import { fetchPromptBySlug } from "@/lib/actions/fetch-prompts-action";
import { fetchCurrentAuthUser } from "@/lib/actions/cognito-auth-action";
import { notFound } from "next/navigation";

// Mock the dependencies
jest.mock("@/lib/actions/fetch-prompts-action", () => ({
  fetchPromptBySlug: jest.fn(),
}));

jest.mock("@/lib/actions/cognito-auth-action", () => ({
  fetchCurrentAuthUser: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  notFound: jest.fn(),
}));

jest.mock("@/components/prompt/prompt-detail", () => {
  return function MockPromptDetail({
    prompt,
    isOwner,
  }: {
    prompt: any;
    isOwner: boolean;
  }) {
    return (
      <div data-testid="prompt-detail-mock">
        <div data-testid="prompt-title">{prompt.title}</div>
        <div data-testid="is-owner">{isOwner.toString()}</div>
      </div>
    );
  };
});

describe("PromptDetailPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Renders prompt detail when prompt exists", async () => {
    // Mock the prompt data
    const mockPrompt = {
      id: "123",
      title: "Test Prompt",
      description: "Test Description",
      authorId: "user123::amplify-user",
    };

    // Mock the current user
    const mockUser = {
      id: "user123",
      username: "testuser",
      displayName: "Test User",
      guest: false,
    };

    // Setup mocks
    (fetchPromptBySlug as jest.Mock).mockResolvedValue(mockPrompt);
    (fetchCurrentAuthUser as jest.Mock).mockResolvedValue(mockUser);

    // Render the component
    const result = await PromptDetailPage({
      params: Promise.resolve({ slug: "test-prompt" }),
    });
    render(result);

    // Check if the component renders with the correct data
    expect(screen.getByTestId("prompt-detail-mock")).toBeInTheDocument();
    expect(screen.getByTestId("prompt-title")).toHaveTextContent("Test Prompt");
    expect(screen.getByTestId("is-owner")).toHaveTextContent("true");

    // Verify that the fetch functions were called with the correct parameters
    expect(fetchPromptBySlug).toHaveBeenCalledWith("test-prompt");
    expect(fetchCurrentAuthUser).toHaveBeenCalled();
  });

  test("Calls notFound when prompt does not exist", async () => {
    // Mock the prompt data to be null (not found)
    (fetchPromptBySlug as jest.Mock).mockResolvedValue(null);

    // Render the component
    await PromptDetailPage({
      params: Promise.resolve({ slug: "non-existent-prompt" }),
    });

    // Check if notFound was called
    expect(notFound).toHaveBeenCalled();
  });

  test("Sets isOwner to false when user is not the prompt owner", async () => {
    // Mock the prompt data
    const mockPrompt = {
      id: "123",
      title: "Test Prompt",
      description: "Test Description",
      authorId: "different-user::amplify-user",
    };

    // Mock the current user
    const mockUser = {
      id: "user123",
      username: "testuser",
      displayName: "Test User",
      guest: false,
    };

    // Setup mocks
    (fetchPromptBySlug as jest.Mock).mockResolvedValue(mockPrompt);
    (fetchCurrentAuthUser as jest.Mock).mockResolvedValue(mockUser);

    // Render the component
    const result = await PromptDetailPage({
      params: Promise.resolve({ slug: "test-prompt" }),
    });
    render(result);

    // Check if isOwner is false
    expect(screen.getByTestId("is-owner")).toHaveTextContent("false");
  });

  test("Sets isOwner to false when user is a guest", async () => {
    // Mock the prompt data
    const mockPrompt = {
      id: "123",
      title: "Test Prompt",
      description: "Test Description",
      authorId: "user123::amplify-user",
    };

    // Mock the current user as a guest
    const mockUser = {
      id: "user123",
      username: "testuser",
      displayName: "Test User",
      guest: true,
    };

    // Setup mocks
    (fetchPromptBySlug as jest.Mock).mockResolvedValue(mockPrompt);
    (fetchCurrentAuthUser as jest.Mock).mockResolvedValue(mockUser);

    // Render the component
    const result = await PromptDetailPage({
      params: Promise.resolve({ slug: "test-prompt" }),
    });
    render(result);

    // Check if isOwner is false
    expect(screen.getByTestId("is-owner")).toHaveTextContent("false");
  });
});

describe("generateMetadata", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Returns correct metadata when prompt exists", async () => {
    // Mock the prompt data
    const mockPrompt = {
      id: "123",
      title: "Test Prompt",
      description: "Test Description",
    };

    // Setup mock
    (fetchPromptBySlug as jest.Mock).mockResolvedValue(mockPrompt);

    // Call the function
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: "test-prompt" }),
    });

    // Check the returned metadata
    expect(metadata).toEqual({
      title: "Test Prompt prompt for Amazon Q Developer",
      description: "Test Description",
      openGraph: {
        title: "Test Prompt prompt for Amazon Q Developer",
        description: "Test Description",
      },
    });

    // Verify that fetchPromptBySlug was called with the correct parameter
    expect(fetchPromptBySlug).toHaveBeenCalledWith("test-prompt");
  });

  test("Returns 'Prompt Not Found' title when prompt does not exist", async () => {
    // Mock the prompt data to be null (not found)
    (fetchPromptBySlug as jest.Mock).mockResolvedValue(null);

    // Call the function
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: "non-existent-prompt" }),
    });

    // Check the returned metadata
    expect(metadata).toEqual({
      title: "Prompt Not Found",
    });
  });
});
