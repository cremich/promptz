import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import EditProjectRulePage from "@/app/rules/rule/[slug]/edit/page";
import { fetchCurrentAuthUser } from "@/lib/actions/cognito-auth-action";
import { fetchProjectRuleBySlug } from "@/lib/actions/fetch-rules-action";
import { redirect, notFound } from "next/navigation";

// Mock dependencies
jest.mock("@/lib/actions/cognito-auth-action", () => ({
  fetchCurrentAuthUser: jest.fn(),
}));

jest.mock("@/lib/actions/fetch-rules-action", () => ({
  fetchProjectRuleBySlug: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
  notFound: jest.fn(),
}));

// Mock the ProjectRuleForm component
jest.mock("@/components/rules/project-rule-form", () => {
  return function MockProjectRuleForm({ projectRule }: { projectRule: any }) {
    return (
      <div data-testid="project-rule-form">
        <div data-testid="project-rule-title">{projectRule.title}</div>
      </div>
    );
  };
});

describe("EditProjectRulePage", () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Redirects to rule page when user is not the owner", async () => {
    // Mock authenticated user
    (fetchCurrentAuthUser as jest.Mock).mockResolvedValue({
      id: "user-123",
      guest: false,
    });

    // Mock project rule with different owner
    (fetchProjectRuleBySlug as jest.Mock).mockResolvedValue({
      id: "rule-123",
      title: "Test Rule",
      slug: "test-rule",
      authorId: "different-user-id",
    });

    // Render the component
    await EditProjectRulePage({
      params: Promise.resolve({ slug: "test-rule" }),
    });

    // Verify redirect was called with rule page path
    expect(redirect).toHaveBeenCalledWith("/rules/rule/test-rule");

    // Verify that notFound was not called
    expect(notFound).not.toHaveBeenCalled();
  });

  test("Renders the project rule form when user is the owner", async () => {
    // Mock authenticated user
    const mockUser = {
      id: "user-123",
      guest: false,
    };
    (fetchCurrentAuthUser as jest.Mock).mockResolvedValue(mockUser);

    // Mock project rule with same owner
    const mockProjectRule = {
      id: "rule-123",
      title: "Test Rule",
      slug: "test-rule",
      authorId: "user-123",
    };
    (fetchProjectRuleBySlug as jest.Mock).mockResolvedValue(mockProjectRule);

    // Render the component
    const result = await EditProjectRulePage({
      params: Promise.resolve({ slug: "test-rule" }),
    });
    render(result);

    // Verify the form is rendered with the project rule data
    expect(screen.getByTestId("project-rule-form")).toBeInTheDocument();
    expect(screen.getByTestId("project-rule-title")).toHaveTextContent(
      "Test Rule",
    );

    // Verify page title is rendered
    expect(screen.getByText("Edit Project Rule")).toBeInTheDocument();

    // Verify that redirect was not called
    expect(redirect).not.toHaveBeenCalled();
    expect(notFound).not.toHaveBeenCalled();
  });
});
