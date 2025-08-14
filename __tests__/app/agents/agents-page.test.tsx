import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import AgentsPage from "@/app/agents/page";

// Mock child components
jest.mock("@/components/search/filter-sidebar", () => {
  return function FilterSidebar({ type }: { type: string }) {
    return <div data-testid="filter-sidebar">Filter Sidebar - {type}</div>;
  };
});

jest.mock("@/components/search/search-box", () => {
  return function SearchBox({ placeholder }: { placeholder: string }) {
    return <div data-testid="search-box">{placeholder}</div>;
  };
});

jest.mock("@/components/search/sort-selector", () => {
  return function SortSelector() {
    return <div data-testid="sort-selector">Sort Selector</div>;
  };
});

jest.mock("@/components/common/create-button", () => {
  return function CreateButton({ href, name }: { href: string; name: string }) {
    return (
      <a href={href} data-testid="create-button">
        {name}
      </a>
    );
  };
});

jest.mock("@/components/search/search-result", () => {
  return function SearchResults({ initialAgents }: { initialAgents: any[] }) {
    return (
      <div data-testid="search-results">
        Search Results - {initialAgents.length} agents
      </div>
    );
  };
});

describe("AgentsPage", () => {
  test("Renders page title and description", async () => {
    render(await AgentsPage({ searchParams: Promise.resolve({}) }));

    // Check for page title
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Browse Agents");

    // Check for page description
    const description = screen.getByText(
      "Discover and explore Amazon Q Developer CLI custom agents created by the community to enhance your development workflow",
    );
    expect(description).toBeInTheDocument();
  });

  test("Renders all UI components", async () => {
    render(await AgentsPage({ searchParams: Promise.resolve({}) }));

    // Check for filter sidebar with correct type
    const filterSidebar = screen.getByTestId("filter-sidebar");
    expect(filterSidebar).toBeInTheDocument();
    expect(filterSidebar).toHaveTextContent("Filter Sidebar - agents");

    // Check for search box with correct placeholder
    const searchBox = screen.getByTestId("search-box");
    expect(searchBox).toBeInTheDocument();
    expect(searchBox).toHaveTextContent("Search agents...");

    // Check for sort selector
    expect(screen.getByTestId("sort-selector")).toBeInTheDocument();

    // Check for create button with correct props
    const createButton = screen.getByTestId("create-button");
    expect(createButton).toBeInTheDocument();
    expect(createButton).toHaveAttribute("href", "/agents/create");
    expect(createButton).toHaveTextContent("Create Agent");

    // Check for search results
    const searchResults = screen.getByTestId("search-results");
    expect(searchResults).toBeInTheDocument();
    expect(searchResults).toHaveTextContent("Search Results - 0 agents");
  });

  test("Handles search parameters correctly", async () => {
    const searchParams = {
      query: "test query",
      sort: "newest",
      "tags[]": ["tag1", "tag2"],
    };

    render(await AgentsPage({ searchParams: Promise.resolve(searchParams) }));

    // Verify the page still renders correctly with search parameters
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Browse Agents",
    );
    expect(screen.getByTestId("search-results")).toBeInTheDocument();
  });
});
