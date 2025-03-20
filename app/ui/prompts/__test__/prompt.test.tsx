import { describe, expect, test, jest, beforeEach } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import PromptDetail from "@/app/ui/prompts/prompt";
import { Prompt } from "@/app/lib/definitions";

const mockPrompt: Prompt = {
  id: "123",
  title: "Test Prompt",
  description: "This is a test prompt",
  howto: "This is how to use the test prompt",
  sourceURL: "https://example.com",
  public: true,
  author: "testuser",
  tags: ["tag1", "tag2"],
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Prompt Component", () => {
  test("renders prompt details correctly", async () => {
    render(await PromptDetail({ prompt: mockPrompt }));

    // Verify basic content rendering
    expect(screen.getByText(mockPrompt.title!)).toBeInTheDocument();
    expect(screen.getByText(mockPrompt.description!)).toBeInTheDocument();
    expect(screen.getByText(mockPrompt.howto!)).toBeInTheDocument();
    expect(screen.getByText(mockPrompt.sourceURL!)).toBeInTheDocument();
    expect(screen.getByText("Public")).toBeInTheDocument();

    // Verify author is rendered
    expect(screen.getByText(`@${mockPrompt.author!}`)).toBeInTheDocument();

    // Verify tags are rendered
    mockPrompt.tags!.forEach((tag) => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });
  });

  test("renders prompt without sourceurl correctly", async () => {
    const mockPromptWithoutSourceUrl = { ...mockPrompt };
    mockPromptWithoutSourceUrl.sourceURL = "";
    render(await PromptDetail({ prompt: mockPromptWithoutSourceUrl }));

    // Verify basic content rendering
    expect(screen.queryByText(mockPrompt.sourceURL!)).not.toBeInTheDocument();
  });

  test("renders private badge", async () => {
    const privateMockPrompt = { ...mockPrompt };
    privateMockPrompt.public = false;

    render(await PromptDetail({ prompt: privateMockPrompt }));

    // Verify basic content rendering
    expect(screen.getByText("Private")).toBeInTheDocument();
  });
});
