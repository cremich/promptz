import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import PromptCard from "@/components/prompt/prompt-card";
import { Prompt } from "@/lib/models/prompt-model";

// Mock child components
jest.mock("@/components/common/author", () => {
  return function Author({ name }: { name: string }) {
    return <div data-testid="author">Author: {name}</div>;
  };
});

jest.mock("@/components/common/tags", () => {
  return function Tags({ tags }: { tags: string[] }) {
    return <div data-testid="tags">{tags.join(", ")}</div>;
  };
});

describe("PromptCard", () => {
  const mockPrompt: Prompt = {
    id: "123",
    title: "Test Prompt",
    description: "This is a test prompt description",
    tags: ["test", "example"],
    slug: "test-prompt",
    author: "Test Author",
  };

  test("Renders prompt card with all information", () => {
    render(<PromptCard prompt={mockPrompt} />);

    // Check if the card is rendered
    const card = screen.getByTestId("prompt-card");
    expect(card).toBeInTheDocument();

    // Check if title is rendered and linked correctly
    const titleLink = screen.getByRole("link", { name: "Test Prompt" });
    expect(titleLink).toBeInTheDocument();
    expect(titleLink).toHaveAttribute("href", "/prompts/prompt/test-prompt");

    // Check if description is rendered
    expect(
      screen.getByText("This is a test prompt description"),
    ).toBeInTheDocument();

    // Check if tags are rendered
    const tags = screen.getByTestId("tags");
    expect(tags).toBeInTheDocument();

    // Check if author is rendered
    const author = screen.getByTestId("author");
    expect(author).toBeInTheDocument();
    expect(author).toHaveTextContent("Author: Test Author");
  });

  test("Renders prompt card without tags", () => {
    const promptWithoutTags = { ...mockPrompt, tags: undefined };
    render(<PromptCard prompt={promptWithoutTags} />);

    // Check if the card is rendered
    expect(screen.getByTestId("prompt-card")).toBeInTheDocument();

    // Check if title and description are still rendered
    expect(screen.getByText("Test Prompt")).toBeInTheDocument();
    expect(
      screen.getByText("This is a test prompt description"),
    ).toBeInTheDocument();

    // Tags should not be rendered
    expect(screen.queryByTestId("tags")).not.toBeInTheDocument();
  });

  test("Renders prompt card without author", () => {
    const promptWithoutAuthor = { ...mockPrompt, author: undefined };
    render(<PromptCard prompt={promptWithoutAuthor} />);

    // Check if the card is rendered
    expect(screen.getByTestId("prompt-card")).toBeInTheDocument();

    // Check if title and description are still rendered
    expect(screen.getByText("Test Prompt")).toBeInTheDocument();
    expect(
      screen.getByText("This is a test prompt description"),
    ).toBeInTheDocument();

    // Author should not be rendered
    expect(screen.queryByTestId("author")).not.toBeInTheDocument();
  });
});
