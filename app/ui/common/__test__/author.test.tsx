import Author from "@/app/ui/common/author";
import { describe, expect, test } from "@jest/globals";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

describe("Author", () => {
  test("renders the author component with provided name", () => {
    render(<Author name="johndoe" />);

    // Check if the username is rendered with @ symbol
    expect(screen.getByText("@johndoe")).toBeInTheDocument();

    // Check if the "Author" label is present
    expect(screen.getByText("Author")).toBeInTheDocument();
  });

  test("renders the user icon", () => {
    render(<Author name="johndoe" />);

    // Check if the CircleUserRound icon is rendered
    const iconElement = document.querySelector("svg");
    expect(iconElement).toBeInTheDocument();
  });
});
