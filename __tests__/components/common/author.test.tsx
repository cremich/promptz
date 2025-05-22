import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Author from "@/components/common/author";

describe("Author", () => {
  test("Renders author component with provided name", () => {
    // Arrange
    const authorName = "johndoe";

    // Act
    render(<Author name={authorName} />);

    // Assert
    expect(screen.getByText(`@${authorName}`)).toBeInTheDocument();
    expect(screen.getByText("Author")).toBeInTheDocument();
  });
});
