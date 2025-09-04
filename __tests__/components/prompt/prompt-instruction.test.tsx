import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import PromptInstruction from "@/components/prompt/prompt-instruction";
import { Terminal } from "lucide-react";

describe("PromptInstruction", () => {
  const defaultProps = {
    title: "Test Prompt Title",
    text: "This is a test prompt instruction text",
    icon: Terminal,
  };

  test("Renders component with all required props", () => {
    // Arrange
    render(<PromptInstruction {...defaultProps} />);

    // Assert
    // Check if title is rendered
    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();

    // Check if text content is rendered in a pre tag
    const preElement = screen.getByText(defaultProps.text);
    expect(preElement).toBeInTheDocument();
  });

  test("Renders with long text content correctly", () => {
    // Arrange
    const longText = "A".repeat(1000); // Create a long string
    render(<PromptInstruction {...defaultProps} text={longText} />);

    // Assert
    const preElement = screen.getByText(longText);
    expect(preElement).toBeInTheDocument();
  });

  test("Renders with different title correctly", () => {
    // Arrange
    const customTitle = "Custom Prompt Title";

    render(<PromptInstruction {...defaultProps} title={customTitle} />);

    // Assert
    expect(screen.getByText(customTitle)).toBeInTheDocument();
  });

  test("Renders with modern gradient styling aligned with agent detail page", () => {
    render(<PromptInstruction {...defaultProps} />);

    const container = screen.getByTestId("prompt-instruction-container");
    expect(container).toHaveClass(
      "bg-gradient-to-r",
      "from-slate-900/50",
      "to-gray-900/50",
      "rounded-xl",
      "border",
      "border-slate-700/50",
    );
  });
});
