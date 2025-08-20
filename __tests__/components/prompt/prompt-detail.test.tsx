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
    scope,
  }: {
    createdAt?: string;
    updatedAt?: string;
    author?: string;
    scope?: string;
  }) {
    const formattedDate = createdAt
      ? new Date(updatedAt || createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "Unknown date";
    const authorText = author ? `by @${author}` : ``;
    return (
      <div className="flex items-center gap-3">
        <div data-testid="submitted-date">
          Submitted on {formattedDate} {authorText}
        </div>
        {scope !== undefined && (
          <div>{scope === "PUBLIC" ? "Public" : "Private"}</div>
        )}
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

jest.mock("@/components/common/submission", () => {
  return function MockSubmission({
    createdAt,
    updatedAt,
    author,
    scope,
  }: {
    createdAt?: string;
    updatedAt?: string;
    author?: string;
    scope?: string;
  }) {
    const formattedDate = createdAt
      ? new Date(updatedAt || createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "Unknown date";
    const authorText = author ? `by @${author}` : ``;
    return (
      <div className="flex items-center gap-3">
        <div data-testid="submitted-date">
          Submitted on {formattedDate} {authorText}
        </div>
        {scope !== undefined && (
          <div>{scope === "PUBLIC" ? "Public" : "Private"}</div>
        )}
      </div>
    );
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
    scope: "PUBLIC",
    sourceURL: "https://example.com",
    copyCount: 5,
    downloadCount: 10,
  };

  test("Renders prompt details with all information", async () => {
    render(await PromptDetail({ prompt: mockPrompt, isOwner: true }));

    // Check if title and description are rendered
    expect(screen.getByText("Test Prompt")).toBeInTheDocument();
    expect(
      screen.getByText("This is a test prompt description"),
    ).toBeInTheDocument();

    // Check if submission date and tags are rendered
    expect(screen.getByTestId("submitted-date")).toBeInTheDocument();
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
    const privatePrompt = { ...mockPrompt, scope: "PRIVATE" };
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

  test("Shows formatted creation date", async () => {
    const promptWithDate = {
      ...mockPrompt,
      createdAt: "2024-01-01T00:00:00Z",
    };
    render(await PromptDetail({ prompt: promptWithDate, isOwner: false }));

    expect(screen.getByTestId("submitted-date")).toHaveTextContent(
      "Submitted on January 1, 2024",
    );
  });

  test("Shows formatted updated date when available", async () => {
    const promptWithUpdatedDate = {
      ...mockPrompt,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-02-15T00:00:00Z",
    };
    render(
      await PromptDetail({ prompt: promptWithUpdatedDate, isOwner: false }),
    );

    expect(screen.getByTestId("submitted-date")).toHaveTextContent(
      "Submitted on February 15, 2024",
    );
  });

  test("Shows unknown date when no creation date is available", async () => {
    const promptWithoutDate = {
      ...mockPrompt,
      createdAt: undefined,
      updatedAt: undefined,
    };
    render(await PromptDetail({ prompt: promptWithoutDate, isOwner: false }));

    expect(screen.getByTestId("submitted-date")).toHaveTextContent(
      "Submitted on Unknown date",
    );
  });

  test("Renders hero section with gradient background", async () => {
    render(await PromptDetail({ prompt: mockPrompt, isOwner: true }));

    // Check if hero section is rendered with proper styling
    const heroSection = screen.getByTestId("prompt-hero-section");
    expect(heroSection).toBeInTheDocument();
    expect(heroSection).toHaveClass("bg-gradient-to-br");
    expect(heroSection).toHaveClass("from-violet-900/20");
    expect(heroSection).toHaveClass("via-purple-900/10");
    expect(heroSection).toHaveClass("to-indigo-900/20");
  });

  test("Displays copy and download counts in hero section", async () => {
    render(await PromptDetail({ prompt: mockPrompt, isOwner: true }));

    // Check if copy count is displayed
    expect(screen.getByTestId("copy-count")).toHaveTextContent("5");
    expect(screen.getByText("copies")).toBeInTheDocument();

    // Check if download count is displayed
    expect(screen.getByTestId("download-count")).toHaveTextContent("10");
    expect(screen.getByText("downloads")).toBeInTheDocument();
  });

  test("Displays zero counts when copy and download counts are not provided", async () => {
    const promptWithoutCounts = {
      ...mockPrompt,
      copyCount: undefined,
      downloadCount: undefined,
    };
    render(await PromptDetail({ prompt: promptWithoutCounts, isOwner: true }));

    // Check if zero counts are displayed
    expect(screen.getByTestId("copy-count")).toHaveTextContent("0");
    expect(screen.getByTestId("download-count")).toHaveTextContent("0");
  });

  test("Renders title with gradient text styling", async () => {
    render(await PromptDetail({ prompt: mockPrompt, isOwner: true }));

    const title = screen.getByRole("heading", { level: 1 });
    expect(title).toHaveClass("bg-gradient-to-r");
    expect(title).toHaveClass("from-white");
    expect(title).toHaveClass("to-gray-300");
    expect(title).toHaveClass("bg-clip-text");
    expect(title).toHaveClass("text-transparent");
  });
});
