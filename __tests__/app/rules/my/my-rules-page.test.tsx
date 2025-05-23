import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import MyRules from "@/app/rules/my/page";

// Mock the server actions
jest.mock("@/lib/actions/my-rules-action", () => ({
  fetchMyRules: jest.fn().mockResolvedValue([
    { id: "1", name: "Rule 1", description: "Description 1" },
    { id: "2", name: "Rule 2", description: "Description 2" },
  ]),
}));

jest.mock("@/lib/actions/cognito-auth-action", () => ({
  fetchCurrentAuthUser: jest
    .fn()
    .mockResolvedValue({ id: "user123", name: "Test User" }),
}));

// Mock the child components
jest.mock("@/components/search/search-result", () => {
  return function MockSearchResults({
    initialProjectRules,
  }: {
    initialProjectRules: any[];
  }) {
    return (
      <div data-testid="search-results-mock">
        {initialProjectRules.length} rules found
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

describe("MyRules", () => {
  test("Renders the My Rules page with correct components", async () => {
    // Render the component
    const { findByRole, findByTestId } = render(await MyRules());

    // Check if the page title is rendered
    const heading = await findByRole("heading", { name: "My Rules" });
    expect(heading).toBeInTheDocument();

    // Check if the description is rendered
    const description = await screen.findByText(
      "Manage and refine your project rules.",
    );
    expect(description).toBeInTheDocument();

    // Check if the create button is rendered with correct props
    const createButton = await findByTestId("create-button-mock");
    expect(createButton).toBeInTheDocument();
    expect(createButton).toHaveAttribute("href", "/rules/create");
    expect(createButton).toHaveTextContent("Create Rule");

    // Check if the search results component is rendered with the correct props
    const searchResults = await findByTestId("search-results-mock");
    expect(searchResults).toBeInTheDocument();
    expect(searchResults).toHaveTextContent("2 rules found");
  });
});
