import PromptCard from "@/app/ui/prompts/prompt-card";
import { describe, expect, test } from "@jest/globals";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

describe("PromptCard", () => {
  const mockPrompt = {
    id: "1",
    title: "Test Prompt",
    description: "This is a test prompt description",
    author: "John Doe",
    tags: ["tag1", "tag2"],
  };

  test("renders the prompt card with all elements", () => {
    render(<PromptCard prompt={mockPrompt} />);

    // Check if title is rendered
    expect(screen.getByText("Test Prompt")).toBeInTheDocument();

    // Check if description is rendered
    expect(
      screen.getByText("This is a test prompt description"),
    ).toBeInTheDocument();

    // Check if author is rendered
    expect(screen.getByText("@John Doe")).toBeInTheDocument();
    expect(screen.getByText("Author")).toBeInTheDocument();

    // Check if tags are rendered
    expect(screen.getByText("tag1")).toBeInTheDocument();
    expect(screen.getByText("tag2")).toBeInTheDocument();
  });

  test("renders the prompt card without tags when tags are not provided", () => {
    const promptWithoutTags = {
      ...mockPrompt,
      tags: undefined,
    };

    render(<PromptCard prompt={promptWithoutTags} />);

    // Core elements should still be present
    expect(screen.getByText("Test Prompt")).toBeInTheDocument();
    expect(
      screen.getByText("This is a test prompt description"),
    ).toBeInTheDocument();
    expect(screen.getByText("@John Doe")).toBeInTheDocument();
  });
});
