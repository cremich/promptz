import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import PromptHowTo from "@/components/prompt/prompt-howto";
import { Info } from "lucide-react";

describe("PromptHowTo", () => {
  // Test data
  const mockProps = {
    title: "Test Title",
    text: "Test description text",
    icon: Info,
  };

  test("Renders component with provided props", () => {
    // Arrange
    render(<PromptHowTo {...mockProps} />);

    // Assert
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test description text")).toBeInTheDocument();
    // Check if the heading is rendered
    expect(
      screen.getByRole("heading", { name: "Test Title" }),
    ).toBeInTheDocument();
  });

  test("Renders icon correctly", () => {
    // Arrange
    render(<PromptHowTo {...mockProps} />);

    // Assert
    // Check if an SVG element is present (the icon)
    const iconElement = document.querySelector("svg");
    expect(iconElement).toBeInTheDocument();
  });

  test("Renders container with gradient background styling", () => {
    // Arrange
    render(<PromptHowTo {...mockProps} />);

    // Assert
    const container = screen.getByTestId("prompt-howto-container");
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass("bg-gradient-to-r");
    expect(container).toHaveClass("from-slate-900/50");
    expect(container).toHaveClass("to-gray-900/50");
    expect(container).toHaveClass("rounded-xl");
    expect(container).toHaveClass("border");
    expect(container).toHaveClass("border-slate-700/50");
  });

  test("Renders text with proper styling", () => {
    // Arrange
    render(<PromptHowTo {...mockProps} />);

    // Assert
    const textElement = screen.getByText("Test description text");
    expect(textElement).toHaveClass("text-gray-300");
    expect(textElement).toHaveClass("whitespace-pre-wrap");
    expect(textElement).toHaveClass("text-sm");
    expect(textElement).toHaveClass("leading-relaxed");
  });
});
