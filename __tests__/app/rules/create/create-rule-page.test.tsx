import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import CreateProjectRulePage from "@/app/rules/create/page";

// Mock the fetchTagsByCategory function
jest.mock("@/lib/actions/fetch-tags-action", () => ({
  fetchTagsByCategory: jest.fn().mockResolvedValue([
    { name: "IDE", category: "Interface" },
    { name: "TypeScript", category: "Language" },
  ]),
}));

// Mock the ProjectRuleForm component
jest.mock("@/components/rules/project-rule-form", () => {
  return function ProjectRuleForm({ tags }: { tags: any[] }) {
    return (
      <div data-testid="project-rule-form">
        Project Rule Form - Tags: {tags.length}
      </div>
    );
  };
});

describe("CreateProjectRulePage", () => {
  test("Renders page title and description", async () => {
    const page = await CreateProjectRulePage();
    render(page);

    // Check for page title
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Create Project Rule");

    // Check for page description
    const description = screen.getByText(
      "Create a new project rule to enforce coding standards and best practices",
    );
    expect(description).toBeInTheDocument();
  });

  test("Renders ProjectRuleForm component with tags", async () => {
    const page = await CreateProjectRulePage();
    render(page);

    // Check if ProjectRuleForm is rendered
    expect(screen.getByTestId("project-rule-form")).toBeInTheDocument();
    expect(screen.getByText(/Project Rule Form - Tags:/)).toBeInTheDocument();
  });
});
