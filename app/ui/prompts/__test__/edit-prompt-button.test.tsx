import EditPromptButton from "@/app/ui/prompts/edit-prompt-button";
import { describe, expect, test } from "@jest/globals";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

describe("EditPromptButton", () => {
  const testSlug = "test-123";

  test("renders a link with correct href", () => {
    render(<EditPromptButton slug={testSlug} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", `/prompts/prompt/${testSlug}/edit`);
  });

  test("renders with edit icon", () => {
    render(<EditPromptButton slug={testSlug} />);
    // Since the Edit icon is decorative, we can check for its presence
    // by looking for an element with the expected dimensions
    const icon = screen.getByRole("link").querySelector("svg");
    expect(icon).toHaveClass("h-4 w-4");
  });

  test("does not show button text by default", () => {
    render(<EditPromptButton slug={testSlug} />);
    expect(screen.queryByText("Edit prompt")).not.toBeInTheDocument();
  });

  test("shows button text when showButtonText is true", () => {
    render(<EditPromptButton slug={testSlug} showButtonText={true} />);
    expect(screen.getByText("Edit prompt")).toBeInTheDocument();
  });
});
