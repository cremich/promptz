import AttributeCard from "@/app/ui/prompts/attribute-card";
import { describe, expect, test } from "@jest/globals";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Mail } from "lucide-react";

describe("AttributeCard", () => {
  const defaultProps = {
    title: "Test Title",
    text: "Test description text",
    icon: Mail,
  };

  test("renders the card with all provided props", () => {
    render(<AttributeCard {...defaultProps} />);

    // Check if title is rendered
    expect(screen.getByText("Test Title")).toBeInTheDocument();

    // Check if description text is rendered
    expect(screen.getByText("Test description text")).toBeInTheDocument();

    // Check if icon is rendered
    expect(document.querySelector("svg")).toBeInTheDocument();
  });
});
