import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import { ProjectRule } from "@/app/lib/definitions";
import ProjectRuleCard from "@/app/ui/rules/project-rule-card";

describe("ProjectRuleCard", () => {
  const mockProjectRule: ProjectRule = {
    id: "123e4567-e89b-12d3-a456-426614174000",
    title: "Test Project Rule",
    description: "This is a test project rule description",
    tags: ["typescript", "react", "nextjs"],
    author: "testuser",
    slug: "test-project-rule",
  };

  test("renders project rule card with all elements", () => {
    render(<ProjectRuleCard projectRule={mockProjectRule} />);

    // Check if title is rendered
    expect(screen.getByText("Test Project Rule")).toBeInTheDocument();

    // Check if description is rendered
    expect(
      screen.getByText("This is a test project rule description"),
    ).toBeInTheDocument();

    // Check if tags are rendered
    expect(screen.getByText("typescript")).toBeInTheDocument();
    expect(screen.getByText("react")).toBeInTheDocument();
    expect(screen.getByText("nextjs")).toBeInTheDocument();

    // Check if author is rendered
    expect(screen.getByText("@testuser")).toBeInTheDocument();

    // Check if link is rendered with correct href
    const link = screen.getByRole("link", {
      name: /view project rule: test project rule/i,
    });
    expect(link).toHaveAttribute(
      "href",
      "/rules/project-rule/test-project-rule",
    );
  });

  test("renders project rule card without tags", () => {
    const projectRuleWithoutTags = { ...mockProjectRule, tags: undefined };
    render(<ProjectRuleCard projectRule={projectRuleWithoutTags} />);

    // Check if title and description are still rendered
    expect(screen.getByText("Test Project Rule")).toBeInTheDocument();
    expect(
      screen.getByText("This is a test project rule description"),
    ).toBeInTheDocument();
  });

  test("renders project rule card without author", () => {
    const projectRuleWithoutAuthor = { ...mockProjectRule, author: undefined };
    render(<ProjectRuleCard projectRule={projectRuleWithoutAuthor} />);

    // Check if title and description are still rendered
    expect(screen.getByText("Test Project Rule")).toBeInTheDocument();
    expect(
      screen.getByText("This is a test project rule description"),
    ).toBeInTheDocument();
  });
});
