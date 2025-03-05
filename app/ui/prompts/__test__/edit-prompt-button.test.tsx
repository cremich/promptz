import EditPromptButton from "@/app/ui/prompts/edit-prompt-button";
import { describe, expect, test } from "@jest/globals";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

describe("EditPromptButton", () => {
  const testId = "test-123";

  test("renders a link with correct href", () => {
    render(<EditPromptButton id={testId} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", `/prompt/${testId}/edit`);
  });

  test("renders with edit icon", () => {
    render(<EditPromptButton id={testId} />);
    // Since the Edit icon is decorative, we can check for its presence
    // by looking for an element with the expected dimensions
    const icon = screen.getByRole("link").querySelector("svg");
    expect(icon).toHaveClass("h-4 w-4");
  });

  test("does not show button text by default", () => {
    render(<EditPromptButton id={testId} />);
    expect(screen.queryByText("Edit prompt")).not.toBeInTheDocument();
  });

  test("shows button text when showButtonText is true", () => {
    render(<EditPromptButton id={testId} showButtonText={true} />);
    expect(screen.getByText("Edit prompt")).toBeInTheDocument();
  });
});
