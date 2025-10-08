import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import PromptCard from "@/components/prompt/prompt-card";
import { Prompt } from "@/lib/models/prompt-model";

// Mock the Author component
jest.mock("@/components/common/author", () => {
  return function MockAuthor({ name }: { name: string }) {
    return <div data-testid="author-mock">{name}</div>;
  };
});

// Mock the Tags component
jest.mock("@/components/common/tags", () => {
  return function MockTags({ tags }: { tags: string[] }) {
    return <div data-testid="tags-mock">{tags.join(", ")}</div>;
  };
});

describe("PromptCard", () => {
  const basePrompt: Prompt = {
    id: "test-id",
    name: "Test Prompt",
    description: "Test description",
    slug: "test-prompt",
    author: "Test Author",
    tags: ["test", "example"],
  };

  test("Renders basic prompt card without copy count", () => {
    render(<PromptCard prompt={basePrompt} />);

    expect(screen.getByText("Test Prompt")).toBeInTheDocument();
    expect(screen.getByText("Test description")).toBeInTheDocument();
    expect(screen.getByTestId("author-mock")).toBeInTheDocument();
    expect(screen.getByTestId("tags-mock")).toBeInTheDocument();
  });

  test("Has correct link href with prompt slug", () => {
    render(<PromptCard prompt={basePrompt} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/prompts/prompt/test-prompt");
    expect(link).toHaveAttribute("aria-label", "Show Test Prompt");
  });

  test("Handles prompts without tags gracefully", () => {
    const promptWithoutTags = { ...basePrompt, tags: undefined };
    render(<PromptCard prompt={promptWithoutTags} />);

    expect(screen.getByText("Test Prompt")).toBeInTheDocument();
    expect(screen.queryByTestId("tags-mock")).not.toBeInTheDocument();
  });

  test("Handles prompts without author gracefully", () => {
    const promptWithoutAuthor = { ...basePrompt, author: undefined };
    render(<PromptCard prompt={promptWithoutAuthor} />);

    expect(screen.getByText("Test Prompt")).toBeInTheDocument();
    expect(screen.queryByTestId("author-mock")).not.toBeInTheDocument();
  });
});
