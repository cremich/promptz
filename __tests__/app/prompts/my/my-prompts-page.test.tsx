import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import MyPrompts from "@/app/prompts/my/page";

// Mock the server actions
jest.mock("@/lib/actions/cognito-auth-action", () => ({
  fetchCurrentAuthUser: jest.fn().mockResolvedValue({
    id: "user123",
    displayName: "Test User",
    username: "testuser",
    guest: false,
  }),
}));

jest.mock("@/lib/actions/my-prompts-action", () => ({
  fetchMyPrompts: jest.fn().mockResolvedValue([
    {
      id: "1",
      title: "Prompt 1",
      description: "Description 1",
      author: "Test User",
      tags: ["tag1", "tag2"],
      slug: "prompt-1",
    },
    {
      id: "2",
      title: "Prompt 2",
      description: "Description 2",
      author: "Test User",
      tags: ["tag3"],
      slug: "prompt-2",
    },
  ]),
}));

// Mock the child components
jest.mock("@/components/search/search-result", () => {
  return function MockSearchResults({
    initialPrompts,
  }: {
    initialPrompts: any[];
  }) {
    return (
      <div data-testid="search-results-mock">
        {initialPrompts.length} prompts found
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

describe("MyPrompts", () => {
  test("Renders the My Prompts page with correct components", async () => {
    // Render the component
    const { findByRole, findByTestId } = render(await MyPrompts());

    // Check if the page title is rendered
    const heading = await findByRole("heading", { name: "My Prompts" });
    expect(heading).toBeInTheDocument();

    // Check if the description is rendered
    const description = await screen.findByText(
      "Manage and refine your prompts.",
    );
    expect(description).toBeInTheDocument();

    // Check if the create button is rendered with correct props
    const createButton = await findByTestId("create-button-mock");
    expect(createButton).toBeInTheDocument();
    expect(createButton).toHaveAttribute("href", "/prompts/create");
    expect(createButton).toHaveTextContent("Create Prompt");

    // Check if the search results component is rendered with the correct props
    const searchResults = await findByTestId("search-results-mock");
    expect(searchResults).toBeInTheDocument();
    expect(searchResults).toHaveTextContent("2 prompts found");
  });
});
