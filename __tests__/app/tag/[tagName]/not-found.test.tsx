import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import TagNotFound from "@/app/tag/[tagName]/not-found";

// Mock the create button component
jest.mock("@/components/common/create-button", () => {
  return function MockCreateButton({
    href,
    name,
  }: {
    href: string;
    name: string;
  }) {
    return (
      <a href={href} data-testid="create-button">
        {name}
      </a>
    );
  };
});

// Mock Next.js Link component
jest.mock("next/link", () => {
  return function MockLink({
    href,
    children,
    className,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  };
});

describe("TagNotFound", () => {
  test("Renders not found page with correct content", () => {
    render(<TagNotFound />);

    // Check if main heading is rendered
    expect(screen.getByText("Tag Not Found")).toBeInTheDocument();

    // Check if description is rendered
    expect(
      screen.getByText(/The tag you're looking for doesn't exist/),
    ).toBeInTheDocument();

    // Check if action buttons are rendered
    expect(screen.getByText("Browse All Prompts")).toBeInTheDocument();
    expect(screen.getByTestId("create-button")).toBeInTheDocument();
  });

  test("Renders popular tags section", () => {
    render(<TagNotFound />);

    // Check if popular tags section is rendered
    expect(screen.getByText("Popular Tags")).toBeInTheDocument();
    expect(
      screen.getByText("Explore these popular tags to find relevant prompts"),
    ).toBeInTheDocument();

    // Check if popular tag buttons are rendered
    const popularTags = [
      "IDE",
      "CLI",
      "Design",
      "Implement",
      "Test",
      "CDK",
      "TypeScript",
    ];
    popularTags.forEach((tag) => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });
  });

  test("Has correct links for popular tags", () => {
    render(<TagNotFound />);

    // Check if tag links have correct href attributes
    const ideLink = screen.getByText("IDE").closest("a");
    expect(ideLink).toHaveAttribute("href", "/tag/IDE");

    const typescriptLink = screen.getByText("TypeScript").closest("a");
    expect(typescriptLink).toHaveAttribute("href", "/tag/TypeScript");
  });

  test("Has correct navigation links", () => {
    render(<TagNotFound />);

    // Check if browse all prompts link is correct
    const browseLink = screen.getByText("Browse All Prompts").closest("a");
    expect(browseLink).toHaveAttribute("href", "/prompts");

    // Check if create button has correct href
    const createButton = screen.getByTestId("create-button");
    expect(createButton).toHaveAttribute("href", "/prompts/create");
    expect(createButton).toHaveTextContent("Create Prompt");
  });
});
