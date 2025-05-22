import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { SourceURL } from "@/components/common/source-url";

describe("SourceURL", () => {
  test("Renders source URL component with provided URL", () => {
    // Arrange
    const testUrl = "https://example.com";

    // Act
    render(<SourceURL url={testUrl} />);

    // Assert
    expect(screen.getByText("Source:")).toBeInTheDocument();
    expect(screen.getByText(testUrl)).toBeInTheDocument();
  });

  test("Link has correct attributes", () => {
    // Arrange
    const testUrl = "https://example.com";

    // Act
    render(<SourceURL url={testUrl} />);

    // Assert
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", testUrl);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(link).toHaveAttribute("aria-label", "View source");
  });

  test("Renders LinkIcon", () => {
    // Arrange & Act
    render(<SourceURL url="https://example.com" />);

    // Assert
    // Check if the link contains an SVG icon
    const link = screen.getByRole("link");
    expect(link.querySelector("svg")).toBeInTheDocument();
  });
});
