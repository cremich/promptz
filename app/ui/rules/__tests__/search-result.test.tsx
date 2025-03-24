import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import SearchResults from "../browse/search-result";

describe("SearchResults", () => {
  test("renders empty state when no project rules are provided", () => {
    render(<SearchResults initialProjectRules={[]} />);

    // Check if the grid container is rendered
    const gridContainer = screen.getByRole("list");
    expect(gridContainer).toBeInTheDocument();
    expect(gridContainer.children.length).toBe(0);
  });

  test("renders multiple project rule cards", () => {
    const mockProjectRules = [
      {
        id: "1",
        title: "Test Rule 1",
        description: "Description 1",
        tags: ["NextJS"],
        slug: "test-rule-1",
      },
      {
        id: "2",
        title: "Test Rule 2",
        description: "Description 2",
        tags: ["React"],
        slug: "test-rule-2",
      },
      {
        id: "3",
        title: "Test Rule 3",
        description: "Description 3",
        tags: ["TypeScript"],
        slug: "test-rule-3",
      },
    ];

    render(<SearchResults initialProjectRules={mockProjectRules} />);

    // Check if titles are rendered
    expect(screen.getByText("Test Rule 1")).toBeInTheDocument();
    expect(screen.getByText("Test Rule 2")).toBeInTheDocument();
    expect(screen.getByText("Test Rule 3")).toBeInTheDocument();

    // Check if descriptions are rendered
    expect(screen.getByText("Description 1")).toBeInTheDocument();
    expect(screen.getByText("Description 2")).toBeInTheDocument();
    expect(screen.getByText("Description 3")).toBeInTheDocument();

    // Check if tags are rendered
    expect(screen.getByText("NextJS")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });
});
