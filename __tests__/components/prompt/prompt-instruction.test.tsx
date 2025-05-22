import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import PromptInstruction from "@/components/prompt/prompt-instruction";
import { Terminal } from "lucide-react";

// Mock the CopyClipBoardButton component
jest.mock("@/components/common/copy-clipboard", () => {
  return function MockCopyClipBoardButton({
    id,
    type,
    text,
    showButtonText,
  }: {
    id: string;
    type: string;
    text: string;
    showButtonText?: boolean;
  }) {
    return (
      <button data-testid="mock-copy-button">
        {showButtonText ? "Copy Prompt" : ""}
      </button>
    );
  };
});

describe("PromptInstruction", () => {
  const defaultProps = {
    promptId: "test-prompt-id",
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

    // Check if the CopyClipBoardButton is rendered with correct props
    const copyButton = screen.getByTestId("mock-copy-button");
    expect(copyButton).toBeInTheDocument();
    expect(copyButton).toHaveTextContent("Copy Prompt"); // showButtonText is true
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
});
