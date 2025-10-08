import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProjectRuleCard from "@/components/rules/project-rule-card";
import { ProjectRule } from "@/lib/models/project-rule-model";

// Mock the Author component
jest.mock("@/components/common/author", () => {
  return function MockAuthor({ name }: { name: string }) {
    return <div data-testid="author-mock">{name}</div>;
  };
});

// Mock the Tags component
jest.mock("@/components/common/tags", () => {
  return function MockTags({ tags }: { tags: string[] }) {
    return <div data-testid="tags-mock">{tags.join(", ")}</div>;
  };
});

describe("ProjectRuleCard", () => {
  const baseProjectRule: ProjectRule = {
    id: "test-id",
    name: "Test Project Rule",
    description: "Test description",
    slug: "test-project-rule",
    author: "Test Author",
    tags: ["test", "example"],
  };

  test("Renders basic project rule card without copy count or download count", () => {
    render(<ProjectRuleCard projectRule={baseProjectRule} />);

    expect(screen.getByText("Test Project Rule")).toBeInTheDocument();
    expect(screen.getByText("Test description")).toBeInTheDocument();
    expect(screen.getByTestId("author-mock")).toBeInTheDocument();
    expect(screen.getByTestId("tags-mock")).toBeInTheDocument();
  });

  test("Shows copy count when copyCount is greater than 0", () => {
    const projectRuleWithCopies = { ...baseProjectRule, copyCount: 25 };
    render(<ProjectRuleCard projectRule={projectRuleWithCopies} />);

    expect(screen.getByText("25 times copied")).toBeInTheDocument();
  });

  test("Shows download count when downloadCount is greater than 0", () => {
    const projectRuleWithDownloads = { ...baseProjectRule, downloadCount: 15 };
    render(<ProjectRuleCard projectRule={projectRuleWithDownloads} />);

    expect(screen.getByText("15 downloads")).toBeInTheDocument();
  });

  test("Shows both copy count and download count", () => {
    const projectRuleWithBoth = {
      ...baseProjectRule,
      copyCount: 25,
      downloadCount: 15,
    };
    render(<ProjectRuleCard projectRule={projectRuleWithBoth} />);

    expect(screen.getByText("25 times copied")).toBeInTheDocument();
    expect(screen.getByText("15 downloads")).toBeInTheDocument();
  });

  test("Shows copy count and download count even when they are 0", () => {
    const projectRuleWithZeros = {
      ...baseProjectRule,
      copyCount: 0,
      downloadCount: 0,
    };
    render(<ProjectRuleCard projectRule={projectRuleWithZeros} />);

    expect(screen.getByText("0 times copied")).toBeInTheDocument();
    expect(screen.getByText("0 downloads")).toBeInTheDocument();
  });

  test("Has correct link href with project rule slug", () => {
    render(<ProjectRuleCard projectRule={baseProjectRule} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/rules/rule/test-project-rule");
    expect(link).toHaveAttribute("aria-label", "Show Test Project Rule");
  });

  test("Handles project rules without tags gracefully", () => {
    const projectRuleWithoutTags = { ...baseProjectRule, tags: undefined };
    render(<ProjectRuleCard projectRule={projectRuleWithoutTags} />);

    expect(screen.getByText("Test Project Rule")).toBeInTheDocument();
    expect(screen.queryByTestId("tags-mock")).not.toBeInTheDocument();
  });

  test("Handles project rules without author gracefully", () => {
    const projectRuleWithoutAuthor = { ...baseProjectRule, author: undefined };
    render(<ProjectRuleCard projectRule={projectRuleWithoutAuthor} />);

    expect(screen.getByText("Test Project Rule")).toBeInTheDocument();
    expect(screen.queryByTestId("author-mock")).not.toBeInTheDocument();
  });
});
