import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import PromptsPage from "@/app/prompts/page";

// Mock the server action
jest.mock("@/lib/actions/search-prompts-action", () => ({
  searchPrompts: jest.fn().mockResolvedValue({
    prompts: [],
  }),
}));

// Mock child components
jest.mock("@/components/search/filter-sidebar", () => {
  return function FilterSidebar() {
    return <div data-testid="filter-sidebar">Filter Sidebar</div>;
  };
});

jest.mock("@/components/search/search-box", () => {
  return function SearchBox() {
    return <div data-testid="search-box">Search Box</div>;
  };
});

jest.mock("@/components/search/sort-selector", () => {
  return function SortSelector() {
    return <div data-testid="sort-selector">Sort Selector</div>;
  };
});

jest.mock("@/components/common/create-button", () => {
  return function CreateButton() {
    return <div data-testid="create-button">Create Button</div>;
  };
});

jest.mock("@/components/search/search-result", () => {
  return function SearchResults() {
    return <div data-testid="search-results">Search Results</div>;
  };
});

describe("PromptsPage", () => {
  test("Renders page title and description", async () => {
    render(await PromptsPage({ searchParams: Promise.resolve({}) }));

    // Check for page title
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Browse Prompts");

    // Check for page description
    const description = screen.getByText(
      "Discover and explore prompts created by the community to enhance your Amazon Q Developer workflow",
    );
    expect(description).toBeInTheDocument();
  });

  test("Renders all UI components", async () => {
    render(await PromptsPage({ searchParams: Promise.resolve({}) }));

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
