import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import PromptDetail from "@/components/prompt/prompt-detail";
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

jest.mock("@/components/common/copy-clipboard", () => {
  return function CopyClipBoardButton() {
    return <div data-testid="copy-button">Copy Button</div>;
  };
});

jest.mock("@/components/common/edit-button", () => {
  return function EditButton() {
    return <div data-testid="edit-button">Edit Button</div>;
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
    title: "Test Prompt",
    description: "This is a test prompt description",
    instruction: "This is the prompt instruction",
    howto: "This is how to use the prompt",
    tags: ["test", "example"],
    slug: "test-prompt",
    author: "Test Author",
    public: true,
    sourceURL: "https://example.com",
  };

  test("Renders prompt details with all information", async () => {
    render(await PromptDetail({ prompt: mockPrompt, isOwner: true }));

    // Check if title and description are rendered
    expect(screen.getByText("Test Prompt")).toBeInTheDocument();
    expect(
      screen.getByText("This is a test prompt description"),
    ).toBeInTheDocument();

    // Check if author and tags are rendered
    expect(screen.getByTestId("author")).toBeInTheDocument();
    expect(screen.getByTestId("tags")).toBeInTheDocument();

    // Check if instruction and howto are rendered
    expect(screen.getByTestId("prompt-instruction")).toBeInTheDocument();
    expect(screen.getByTestId("prompt-howto")).toBeInTheDocument();

    // Check if edit and copy buttons are rendered
    expect(screen.getByTestId("edit-button")).toBeInTheDocument();
    expect(screen.getByTestId("copy-button")).toBeInTheDocument();

    // Check if source URL is rendered
    expect(screen.getByTestId("source-url")).toBeInTheDocument();

    // Check if visibility badge is rendered
    expect(screen.getByText("Public")).toBeInTheDocument();
  });

  test("Does not render edit button when user is not owner", async () => {
    render(await PromptDetail({ prompt: mockPrompt, isOwner: false }));

    // Edit button should not be rendered
    expect(screen.queryByTestId("edit-button")).not.toBeInTheDocument();

    // Other elements should still be rendered
    expect(screen.getByText("Test Prompt")).toBeInTheDocument();
    expect(screen.getByTestId("copy-button")).toBeInTheDocument();
  });

  test("Renders private badge when prompt is not public", async () => {
    const privatePrompt = { ...mockPrompt, public: false };
    render(await PromptDetail({ prompt: privatePrompt, isOwner: true }));

    // Check for Private badge
    expect(screen.getByText("Private")).toBeInTheDocument();
  });

  test("Does not render howto section when not provided", async () => {
    const promptWithoutHowto = { ...mockPrompt, howto: undefined };
    render(await PromptDetail({ prompt: promptWithoutHowto, isOwner: true }));

    // Howto section should not be rendered
    expect(screen.queryByTestId("prompt-howto")).not.toBeInTheDocument();

    // Other elements should still be rendered
    expect(screen.getByText("Test Prompt")).toBeInTheDocument();
    expect(screen.getByTestId("prompt-instruction")).toBeInTheDocument();
  });

  test("Does not render source URL when not provided", async () => {
    const promptWithoutSourceURL = { ...mockPrompt, sourceURL: undefined };
    render(
      await PromptDetail({ prompt: promptWithoutSourceURL, isOwner: true }),
    );

    // Source URL should not be rendered
    expect(screen.queryByTestId("source-url")).not.toBeInTheDocument();
  });
});
