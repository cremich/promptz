import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import CreateProjectRulePage from "../page";
import { redirect } from "next/navigation";
import { fetchCurrentAuthUser } from "@/app/lib/actions/cognito-server";

// Mock the dependencies
jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

jest.mock("@/app/lib/actions/cognito-server", () => ({
  fetchCurrentAuthUser: jest.fn(),
}));

jest.mock("@/app/ui/rules/project-rule-form", () => ({
  __esModule: true,
  default: () => <div data-testid="project-rule-form">Project Rule Form</div>,
}));

describe("CreateProjectRulePage", () => {
  test("redirects to login page when user is not authenticated", async () => {
    // Mock user as guest
    (fetchCurrentAuthUser as jest.Mock).mockResolvedValue({
      guest: true,
    });

    // Render the component
    await CreateProjectRulePage();

    // Check if redirect was called with the correct path
    expect(redirect).toHaveBeenCalledWith("/login");
  });

  test("renders the project rule form when user is authenticated", async () => {
    // Mock authenticated user
    (fetchCurrentAuthUser as jest.Mock).mockResolvedValue({
      id: "user-id",
      username: "username",
      displayName: "User Name",
      guest: false,
    });

    // Render the component
    const { container } = render(await CreateProjectRulePage());

    // Check if the page title is rendered
    expect(screen.getByText("Create Project Rule")).toBeInTheDocument();

    // Check if the project rule form is rendered
    expect(screen.getByTestId("project-rule-form")).toBeInTheDocument();
  });
});
