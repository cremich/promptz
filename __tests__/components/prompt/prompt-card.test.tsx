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

  test("Shows copy count when copyCount is greater than 0", () => {
    const promptWithCopies = { ...basePrompt, copyCount: 25 };
    render(<PromptCard prompt={promptWithCopies} />);

    expect(screen.getByText("25 times copied")).toBeInTheDocument();
    expect(screen.getByText("25 times copied").closest("div")).toHaveClass(
      "flex",
      "items-center",
    );
  });

  test("Shows copy count even when copyCount is 0", () => {
    const promptWithZeroCopies = { ...basePrompt, copyCount: 0 };
    render(<PromptCard prompt={promptWithZeroCopies} />);

    // Should show copy count even when it's 0
    expect(screen.getByText("0 times copied")).toBeInTheDocument();
    // The copy icon should be present - check by looking for the SVG with the lucide-copy class
    const copyIcon = document.querySelector(".lucide-copy");
    expect(copyIcon).toBeInTheDocument();
  });

  test("Shows 'Trending' badge for prompts with 50-99 copies", () => {
    const trendingPrompt = { ...basePrompt, copyCount: 75 };
    render(<PromptCard prompt={trendingPrompt} />);

    expect(screen.getByText("Trending")).toBeInTheDocument();
    expect(screen.getByText("75 times copied")).toBeInTheDocument();
  });

  test("Shows 'Hot' badge for prompts with 100+ copies", () => {
    const hotPrompt = { ...basePrompt, copyCount: 150 };
    render(<PromptCard prompt={hotPrompt} />);

    expect(screen.getByText("Hot")).toBeInTheDocument();
    expect(screen.getByText("150 times copied")).toBeInTheDocument();
  });

  test("Does not show popularity badge for prompts with less than 50 copies", () => {
    const lowCopyPrompt = { ...basePrompt, copyCount: 25 };
    render(<PromptCard prompt={lowCopyPrompt} />);

    expect(screen.queryByText("Trending")).not.toBeInTheDocument();
    expect(screen.queryByText("Hot")).not.toBeInTheDocument();
    expect(screen.getByText("25 times copied")).toBeInTheDocument();
  });

  test("Formats large copy counts with locale string", () => {
    const popularPrompt = { ...basePrompt, copyCount: 1234 };
    render(<PromptCard prompt={popularPrompt} />);

    // Check that the number is formatted (could be "1,234" or "1.234" depending on locale)
    const formattedNumber = (1234).toLocaleString();
    expect(
      screen.getByText(`${formattedNumber} times copied`),
    ).toBeInTheDocument();
  });

  test("Has correct link href with prompt slug", () => {
    render(<PromptCard prompt={basePrompt} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/prompts/prompt/test-prompt");
    expect(link).toHaveAttribute("aria-label", "Show Test Prompt");
  });

  test("Applies correct CSS classes for styling", () => {
    render(<PromptCard prompt={basePrompt} />);

    const card = screen.getByTestId("prompt-card");
    expect(card).toHaveClass(
      "h-full",
      "bg-gradient-to-br",
      "from-neutral-800",
      "to-neutral-900",
      "border-neutral-700",
    );
  });

  test("Shows both badge and copy count for highly popular prompts", () => {
    const veryPopularPrompt = { ...basePrompt, copyCount: 200 };
    render(<PromptCard prompt={veryPopularPrompt} />);

    expect(screen.getByText("Hot")).toBeInTheDocument();
    expect(screen.getByText("200 times copied")).toBeInTheDocument();
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

  test("Does not show copy count when copyCount is undefined", () => {
    const promptWithoutCopyCount = { ...basePrompt, copyCount: undefined };
    render(<PromptCard prompt={promptWithoutCopyCount} />);

    expect(screen.queryByText(/times copied/)).not.toBeInTheDocument();
    const copyIcon = document.querySelector(".lucide-copy");
    expect(copyIcon).not.toBeInTheDocument();
  });
});
