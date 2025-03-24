import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import ProjectRuleDetail from "../project-rule-detail";

describe("ProjectRuleDetail", () => {
  const mockProjectRule = {
    id: "123",
    title: "Test Rule",
    description: "This is a test rule",
    content: "# Test content",
    tags: ["TypeScript", "React"],
    author: "testuser",
    sourceURL: "https://github.com/example/repo",
    authorId: "user123::testuser",
    createdAt: "2025-03-20T12:00:00Z",
    public: true,
    slug: "test-rule",
  };

  test("renders project rule details correctly", () => {
    render(<ProjectRuleDetail projectRule={mockProjectRule} isOwner={false} />);

    // Check that the correct elements are rendered
    expect(screen.getByText("Test Rule")).toBeInTheDocument();
    expect(screen.getByText("This is a test rule")).toBeInTheDocument();
    expect(screen.getByText("# Test content")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("@testuser")).toBeInTheDocument();

    // Edit button should not be visible for non-owners
    expect(screen.queryByTestId("edit-button")).not.toBeInTheDocument();
  });

  test("shows edit button for owner", () => {
    render(<ProjectRuleDetail projectRule={mockProjectRule} isOwner={true} />);

    // Edit button should be visible for owners
    expect(screen.getByTestId("edit-button")).toBeInTheDocument();
  });

  test("renders source link when sourceURL is provided", () => {
    const projectRuleWithSource = {
      ...mockProjectRule,
      sourceURL: "https://github.com/example/repo",
    };

    render(
      <ProjectRuleDetail projectRule={projectRuleWithSource} isOwner={false} />,
    );

    // Source button should be visible
    expect(screen.getByText(mockProjectRule.sourceURL!)).toBeInTheDocument();
  });

  test("formats date correctly", () => {
    render(<ProjectRuleDetail projectRule={mockProjectRule} isOwner={false} />);

    // Check that the date is formatted correctly
    expect(screen.getByText("Submitted on March 20, 2025")).toBeInTheDocument();
  });

  test("handles missing date gracefully", () => {
    const projectRuleWithoutDate = {
      ...mockProjectRule,
      createdAt: undefined,
    };

    render(
      <ProjectRuleDetail
        projectRule={projectRuleWithoutDate}
        isOwner={false}
      />,
    );

    // Check that the date fallback is shown
    expect(screen.getByText("Submitted on Unknown date")).toBeInTheDocument();
  });
});
