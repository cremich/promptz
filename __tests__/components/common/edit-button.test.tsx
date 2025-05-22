import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import EditButton from "@/components/common/edit-button";

describe("EditButton", () => {
  test("renders with icon only by default", () => {
    // Arrange
    render(<EditButton href="/edit/123" name="Edit Item" />);

    // Assert
    const button = screen.getByTestId("edit-button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("href", "/edit/123");

    // Should contain the Edit icon but not the text
    expect(screen.queryByText("Edit Item")).not.toBeInTheDocument();
  });

  test("renders with text when showButtonText is true", () => {
    // Arrange
    render(
      <EditButton href="/edit/123" name="Edit Item" showButtonText={true} />,
    );

    // Assert
    const button = screen.getByTestId("edit-button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("href", "/edit/123");

    // Should contain both the Edit icon and the text
    expect(screen.getByText("Edit Item")).toBeInTheDocument();
  });

  test("has correct styling", () => {
    // Arrange
    render(<EditButton href="/edit/123" name="Edit Item" />);

    // Assert
    const button = screen.getByTestId("edit-button");
    expect(button).toHaveClass(
      "py-2",
      "px-3",
      "rounded",
      "border-gray-800",
      "border",
      "hover:bg-violet-700",
    );
  });
});
