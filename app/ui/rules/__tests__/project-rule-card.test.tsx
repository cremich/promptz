import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import ProjectRuleCard from "../project-rule-card";

describe("ProjectRuleCard", () => {
  const mockProjectRule = {
    id: "123",
    title: "Test Rule",
    description: "This is a test rule",
    tags: ["NextJS", "React"],
    author: "testuser",
    slug: "test-rule",
  };

  test("renders project rule card with correct content", () => {
    render(<ProjectRuleCard projectRule={mockProjectRule} />);

    // Check if title is rendered
    expect(screen.getByText("Test Rule")).toBeInTheDocument();

    // Check if description is rendered
    expect(screen.getByText("This is a test rule")).toBeInTheDocument();

    // Check if tags are rendered
    expect(screen.getByText("NextJS")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();

    // Check if author is rendered
    expect(screen.getByText("@testuser")).toBeInTheDocument();

    // Check if link has correct href
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/rules/rule/test-rule");
  });
});
