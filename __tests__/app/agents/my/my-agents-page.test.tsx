import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import MyAgents from "@/app/agents/my/page";

// Mock the server actions
jest.mock("@/lib/actions/cognito-auth-action", () => ({
  fetchCurrentAuthUser: jest.fn().mockResolvedValue({
    id: "user123",
    displayName: "Test User",
    username: "testuser",
    guest: false,
  }),
}));

// Mock the child components
jest.mock("@/components/search/search-result", () => {
  return function MockSearchResults({
    initialAgents,
  }: {
    initialAgents: any[];
  }) {
    return (
      <div data-testid="search-results-mock">
        {initialAgents.length} agents found
      </div>
    );
  };
});

jest.mock("@/components/common/create-button", () => {
  return function MockCreateButton({
    href,
    name,
  }: {
    href: string;
    name: string;
  }) {
    return (
      <a href={href} data-testid="create-button-mock">
        {name}
      </a>
    );
  };
});

describe("MyAgents", () => {
  test("Renders the My Agents page with correct components", async () => {
    // Render the component
    const { findByRole, findByTestId } = render(await MyAgents());

    // Check if the page title is rendered
    const heading = await findByRole("heading", { name: "My Agents" });
    expect(heading).toBeInTheDocument();

    // Check if the description is rendered
    const description = await screen.findByText(
      "Manage and refine your Amazon Q Developer CLI custom agents.",
    );
    expect(description).toBeInTheDocument();

    // Check if the create button is rendered with correct props
    const createButton = await findByTestId("create-button-mock");
    expect(createButton).toBeInTheDocument();
    expect(createButton).toHaveAttribute("href", "/agents/create");
    expect(createButton).toHaveTextContent("Create Agent");

    // Check if the search results component is rendered with the correct props
    const searchResults = await findByTestId("search-results-mock");
    expect(searchResults).toBeInTheDocument();
    expect(searchResults).toHaveTextContent("0 agents found");
  });

  test("Renders loading suspense boundary", async () => {
    render(await MyAgents());

    // Check if the Suspense wrapper is present (by checking for the search results)
    expect(screen.getByTestId("search-results-mock")).toBeInTheDocument();
  });
});
