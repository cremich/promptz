import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import CreatePrompt from "@/app/prompts/create/page";

// Mock the PromptForm component
jest.mock("@/components/prompt/prompt-form", () => {
  return function PromptForm() {
    return <div data-testid="prompt-form">Prompt Form</div>;
  };
});

describe("CreatePrompt", () => {
  test("Renders page title", () => {
    render(<CreatePrompt />);

    // Check for page title
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Create Prompt");
  });

  test("Renders PromptForm component", () => {
    render(<CreatePrompt />);

    // Check if PromptForm is rendered
    expect(screen.getByTestId("prompt-form")).toBeInTheDocument();
  });
});
