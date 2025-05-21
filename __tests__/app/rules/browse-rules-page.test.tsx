import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import BrowseRulesPage from "@/app/rules/rules-page";

// Mock the server action
jest.mock("@/app/lib/actions/project-rules", () => ({
  searchProjectRules: jest.fn().mockResolvedValue({
    projectRules: [],
  }),
}));

// Mock child components
jest.mock("@/app/ui/rules/browse/filter-sidebar", () => ({
  FilterSidebar: () => <div data-testid="filter-sidebar">Filter Sidebar</div>,
}));

jest.mock("@/app/ui/common/search", () => {
  return function SearchBox() {
    return <div data-testid="search-box">Search Box</div>;
  };
});

jest.mock("@/app/ui/common/sorting", () => ({
  SortSelector: () => <div data-testid="sort-selector">Sort Selector</div>,
}));

jest.mock("@/app/ui/rules/create-project-rule-button", () => {
  return function CreateProjectRuleButton() {
    return <div data-testid="create-button">Create Button</div>;
  };
});

jest.mock("@/app/ui/rules/browse/search-result", () => {
  return function SearchResults() {
    return <div data-testid="search-results">Search Results</div>;
  };
});

describe("BrowseRulesPage", () => {
  test("Renders page title and description", async () => {
    render(await BrowseRulesPage({ searchParams: Promise.resolve({}) }));

    // Check for page title
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Project Rules");

    // Check for page description
    const description = screen.getByText(
      "Discover and explore Amazon Q project rules created by the community to enforce coding standards and best practices",
    );
    expect(description).toBeInTheDocument();
  });

  test("Renders all UI components", async () => {
    render(await BrowseRulesPage({ searchParams: Promise.resolve({}) }));

    // Check for filter sidebar
    expect(screen.getByTestId("filter-sidebar")).toBeInTheDocument();

    // Check for search box
    expect(screen.getByTestId("search-box")).toBeInTheDocument();

    // Check for sort selector
    expect(screen.getByTestId("sort-selector")).toBeInTheDocument();

    // Check for create button
    expect(screen.getByTestId("create-button")).toBeInTheDocument();

    // Check for search results
    expect(screen.getByTestId("search-results")).toBeInTheDocument();
  });
});
