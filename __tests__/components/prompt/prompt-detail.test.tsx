import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import PromptDetail from "@/components/prompt/prompt-detail";
import { Prompt } from "@/lib/models/prompt-model";

jest.mock("@/components/common/submission", () => {
  return function MockSubmission({
    createdAt,
    updatedAt,
    author,
  }: {
    createdAt?: string;
    updatedAt?: string;
    author?: string;
  }) {
    return (
      <div data-testid="mock-submission">
        {createdAt} {updatedAt} {author}
      </div>
    );
  };
});

jest.mock("@/components/common/tags", () => {
  return function Tags({ tags }: { tags: string[] }) {
    return <div data-testid="tags">{tags.join(", ")}</div>;
  };
});

jest.mock("@/components/prompt/prompt-instruction", () => {
  return function PromptInstruction({ text }: { text: string }) {
    return <div data-testid="prompt-instruction">{text}</div>;
  };
});

jest.mock("@/components/prompt/prompt-howto", () => {
  return function PromptHowTo({ text }: { text: string }) {
    return <div data-testid="prompt-howto">{text}</div>;
  };
});

jest.mock("@/components/common/source-url", () => {
  return {
    SourceURL: function SourceURL() {
      return <div data-testid="source-url">Source URL</div>;
    },
  };
});

describe("PromptDetail", () => {
  const mockPrompt: Prompt = {
    id: "123",
    name: "Test Prompt",
    description: "This is a test prompt description",
    content: "This is the prompt instruction",
    howto: "This is how to use the prompt",
    tags: ["test", "example"],
    slug: "test-prompt",
    author: "Test Author",
    sourceURL: "https://example.com",
  };

  test("Renders prompt details with all information", async () => {
    render(await PromptDetail({ prompt: mockPrompt }));

    // Check if title and description are rendered
    expect(screen.getByText("Test Prompt")).toBeInTheDocument();
    expect(
      screen.getByText("This is a test prompt description"),
    ).toBeInTheDocument();

    // Check if submission date and tags are rendered
    expect(screen.getByTestId("mock-submission")).toBeInTheDocument();
    expect(screen.getByTestId("tags")).toBeInTheDocument();

    // Check if instruction and howto are rendered
    expect(screen.getByTestId("prompt-instruction")).toBeInTheDocument();
    expect(screen.getByTestId("prompt-howto")).toBeInTheDocument();

    // Check if source URL is rendered
    expect(screen.getByTestId("source-url")).toBeInTheDocument();
  });

  test("Does not render howto section when not provided", async () => {
    const promptWithoutHowto = { ...mockPrompt, howto: undefined };
    render(await PromptDetail({ prompt: promptWithoutHowto }));

    // Howto section should not be rendered
    expect(screen.queryByTestId("prompt-howto")).not.toBeInTheDocument();

    // Other elements should still be rendered
    expect(screen.getByText("Test Prompt")).toBeInTheDocument();
    expect(screen.getByTestId("prompt-instruction")).toBeInTheDocument();
  });

  test("Does not render source URL when not provided", async () => {
    const promptWithoutSourceURL = { ...mockPrompt, sourceURL: undefined };
    render(await PromptDetail({ prompt: promptWithoutSourceURL }));

    // Source URL should not be rendered
    expect(screen.queryByTestId("source-url")).not.toBeInTheDocument();
  });
});
