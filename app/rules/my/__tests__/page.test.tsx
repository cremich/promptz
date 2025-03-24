import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import MyRules from "../page";
import { searchProjectRules } from "@/app/lib/actions/project-rules";

// Mock the project rules action
jest.mock("@/app/lib/actions/project-rules", () => ({
  searchProjectRules: jest.fn(),
}));

// Mock the Suspense component
jest.mock("react", () => {
  const originalReact = jest.requireActual("react");
  return {
    ...originalReact,
    Suspense: ({ children }: { children: React.ReactNode }) => children,
  };
});

describe("MyRules Page", () => {
  test("renders the page with correct title and description", async () => {
    // Mock the searchProjectRules function to return empty array
    (searchProjectRules as jest.Mock).mockResolvedValue({
      projectRules: [],
    });

    // Render the component
    render(await MyRules({ searchParams: Promise.resolve({}) }));

    // Check if the title and description are rendered
    expect(screen.getByText("My Rules")).toBeInTheDocument();
    expect(
      screen.getByText("Manage and refine your project rules."),
    ).toBeInTheDocument();
  });

  test("renders the create button", async () => {
    // Mock the searchProjectRules function to return empty array
    (searchProjectRules as jest.Mock).mockResolvedValue({
      projectRules: [],
    });

    // Render the component
    render(await MyRules({ searchParams: Promise.resolve({}) }));

    // Check if the create button is rendered
    expect(screen.getByText("Create Rule")).toBeInTheDocument();
  });

  test("passes the correct search parameters", async () => {
    // Mock the searchProjectRules function to return empty array
    (searchProjectRules as jest.Mock).mockResolvedValue({
      projectRules: [],
    });

    // Render the component with search query
    render(
      await MyRules({
        searchParams: Promise.resolve({ query: "test" }),
      }),
    );

    // Check if searchProjectRules was called with the correct parameters
    expect(searchProjectRules).toHaveBeenCalledWith({
      query: "test",
      my: "true",
    });
  });
});
