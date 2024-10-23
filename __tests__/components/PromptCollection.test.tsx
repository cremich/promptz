import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import PromptCollection from "@/components/PromptCollection";
import { usePromptCollection } from "@/hooks/usePromptCollection";
import { useAuth } from "@/contexts/AuthContext";
import "@testing-library/jest-dom/vitest";
import { PromptViewModel } from "@/models/PromptViewModel";

// Mock the hooks
vi.mock("@/hooks/usePromptCollection");
vi.mock("@/contexts/AuthContext");

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

const schemaPrompt = {
  id: "1",
  name: "Test Prompt",
  description: "A test prompt",
  sdlc_phase: "DESIGN",
  category: "CHAT",
  instruction: "Test instruction",
  owner_username: "testuser",
  owner: "user123",
  createdAt: "",
  updatedAt: "",
};

describe("PromptCollection component", () => {
  it("renders loading state", () => {
    vi.mocked(usePromptCollection).mockReturnValue({
      prompts: [],
      error: null,
      loading: true,
      hasMore: false,
      handleLoadMore: vi.fn(),
    });
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      logout: vi.fn(),
      fetchUser: vi.fn(),
    });

    render(<PromptCollection />);
    expect(screen.getByText("Loading a world of prompts")).toBeInTheDocument();
  });

  it("renders error state", () => {
    const testError = new Error("Test error");
    vi.mocked(usePromptCollection).mockReturnValue({
      prompts: [],
      error: testError,
      loading: false,
      hasMore: false,
      handleLoadMore: vi.fn(),
    });
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      logout: vi.fn(),
      fetchUser: vi.fn(),
    });

    render(<PromptCollection />);
    expect(screen.getByText("Test error")).toBeInTheDocument();
  });

  it("renders empty state for non-guest user", () => {
    vi.mocked(usePromptCollection).mockReturnValue({
      prompts: [],
      error: null,
      loading: false,
      hasMore: false,
      handleLoadMore: vi.fn(),
    });

    render(<PromptCollection />);
    expect(screen.getByText("No prompts created yet")).toBeInTheDocument();
    expect(screen.getByText("Be the first. Create a prompt.")).toBeInTheDocument();
  });

  it("renders empty state for guest user", () => {
    vi.mocked(usePromptCollection).mockReturnValue({
      prompts: [],
      error: null,
      loading: false,
      hasMore: false,
      handleLoadMore: vi.fn(),
    });

    render(<PromptCollection />);
    expect(screen.getByText("No prompts created yet")).toBeInTheDocument();
    expect(screen.getByText("Be the first. Create a prompt.")).toBeInTheDocument();
  });

  it("renders load more button when hasMore is true", () => {
    vi.mocked(usePromptCollection).mockReturnValue({
      prompts: [new PromptViewModel()],
      error: null,
      loading: false,
      hasMore: true,
      handleLoadMore: vi.fn(),
    });

    render(<PromptCollection />);
    expect(screen.getByText("Load more")).toBeInTheDocument();
    expect(screen.getByText("Load more")).not.toBeDisabled();
  });

  it("disables load more button when hasMore is false", () => {
    vi.mocked(usePromptCollection).mockReturnValue({
      prompts: [new PromptViewModel()],
      error: null,
      loading: false,
      hasMore: false,
      handleLoadMore: vi.fn(),
    });

    render(<PromptCollection />);
    expect(screen.getByText("Load more")).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveAttribute("aria-disabled", "true");
  });
});
