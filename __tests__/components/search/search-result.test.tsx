import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import SearchResults from "@/components/search/search-result";
import { ProjectRule } from "@/lib/models/project-rule-model";

// Mock the ProjectRuleCard component
jest.mock("@/components/rules/project-rule-card", () => {
  return function MockProjectRuleCard({
    projectRule,
  }: {
    projectRule: ProjectRule;
  }) {
    return <div data-testid={`project-rule-card-${projectRule.id}`}></div>;
  };
});

describe("Search Results", () => {
  const mockProjectRules: ProjectRule[] = [
    {
      id: "1",
    },
    {
      id: "2",
    },
  ];

  test("Renders search results", () => {
    render(<SearchResults initialProjectRules={mockProjectRules} />);

    mockProjectRules.forEach((rule) => {
      const card = screen.getByTestId(`project-rule-card-${rule.id}`);
      expect(card).toBeInTheDocument();
    });
  });

  test("Renders empty grid when no project rules are provided", () => {
    render(<SearchResults initialProjectRules={[]} />);

    const gridContainer = screen.getByRole("list");
    expect(gridContainer).toBeInTheDocument();
    expect(gridContainer.children).toHaveLength(0);
  });
});
