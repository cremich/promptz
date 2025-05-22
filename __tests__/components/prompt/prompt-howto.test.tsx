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
    // Check if the card component is rendered
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
});
