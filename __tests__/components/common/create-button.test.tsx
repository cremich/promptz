import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import CreateButton from "@/components/common/create-button";

describe("Create Button", () => {
  const defaultProps = {
    href: "/test-link",
    name: "Create Test",
  };

  test("Renders button with correct text and icon", () => {
    render(<CreateButton {...defaultProps} />);

    // Check if button text is rendered
    expect(screen.getByText("Create Test")).toBeInTheDocument();

    // Check if Plus icon is rendered
    const icon = document.querySelector("svg");
    expect(icon).toBeInTheDocument();
  });

  test("Button renders as a link with correct href", () => {
    render(<CreateButton {...defaultProps} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/test-link");
  });
});
