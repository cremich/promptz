import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import CreatePrompt from "@/app/prompts/create/page";

// Mock the fetchTagsByCategory function
jest.mock("@/lib/actions/fetch-tags-action", () => ({
  fetchTagsByCategory: jest.fn().mockResolvedValue([
    {
      name: "Test Tag",
      description: "Test Description",
      category: "Interface",
    },
  ]),
}));

// Mock the PromptForm component
jest.mock("@/components/prompt/prompt-form", () => {
  return function PromptForm({ tags }: { tags: any[] }) {
    return (
      <div data-testid="prompt-form">
        <div data-testid="tags-count">{tags.length}</div>
        Prompt Form
      </div>
    );
  };
});

describe("CreatePrompt", () => {
  test("Renders page title", async () => {
    const result = await CreatePrompt();
    render(result);

    // Check for page title
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Create Prompt");
  });

  test("Renders PromptForm component with tags", async () => {
    const result = await CreatePrompt();
    render(result);

    // Check if PromptForm is rendered
    expect(screen.getByTestId("prompt-form")).toBeInTheDocument();
  });
});
