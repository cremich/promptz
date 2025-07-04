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
    title: "Test Project Rule",
    description: "Test description",
    slug: "test-project-rule",
    author: "Test Author",
    tags: ["test", "example"],
  };

  test("Renders basic project rule card without copy count", () => {
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
    expect(screen.getByText("25 times copied").closest("div")).toHaveClass(
      "flex",
      "items-center",
    );
  });

  test("Shows copy count even when copyCount is 0", () => {
    const projectRuleWithZeroCopies = { ...baseProjectRule, copyCount: 0 };
    render(<ProjectRuleCard projectRule={projectRuleWithZeroCopies} />);

    // Should show copy count even when it's 0
    expect(screen.getByText("0 times copied")).toBeInTheDocument();
    // The copy icon should be present - check by looking for the SVG with the lucide-copy class
    const copyIcon = document.querySelector(".lucide-copy");
    expect(copyIcon).toBeInTheDocument();
  });

  test("Shows 'Trending' badge for project rules with 50-99 copies", () => {
    const trendingProjectRule = { ...baseProjectRule, copyCount: 75 };
    render(<ProjectRuleCard projectRule={trendingProjectRule} />);

    expect(screen.getByText("Trending")).toBeInTheDocument();
    expect(screen.getByText("75 times copied")).toBeInTheDocument();
  });

  test("Shows 'Hot' badge for project rules with 100+ copies", () => {
    const hotProjectRule = { ...baseProjectRule, copyCount: 150 };
    render(<ProjectRuleCard projectRule={hotProjectRule} />);

    expect(screen.getByText("Hot")).toBeInTheDocument();
    expect(screen.getByText("150 times copied")).toBeInTheDocument();
  });

  test("Does not show popularity badge for project rules with less than 50 copies", () => {
    const lowCopyProjectRule = { ...baseProjectRule, copyCount: 25 };
    render(<ProjectRuleCard projectRule={lowCopyProjectRule} />);

    expect(screen.queryByText("Trending")).not.toBeInTheDocument();
    expect(screen.queryByText("Hot")).not.toBeInTheDocument();
    expect(screen.getByText("25 times copied")).toBeInTheDocument();
  });

  test("Formats large copy counts with locale string", () => {
    const popularProjectRule = { ...baseProjectRule, copyCount: 1234 };
    render(<ProjectRuleCard projectRule={popularProjectRule} />);

    // Check that the number is formatted (could be "1,234" or "1.234" depending on locale)
    const formattedNumber = (1234).toLocaleString();
    expect(
      screen.getByText(`${formattedNumber} times copied`),
    ).toBeInTheDocument();
  });

  test("Has correct link href with project rule slug", () => {
    render(<ProjectRuleCard projectRule={baseProjectRule} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/rules/rule/test-project-rule");
    expect(link).toHaveAttribute("aria-label", "Show Test Project Rule");
  });

  test("Applies correct CSS classes for styling", () => {
    render(<ProjectRuleCard projectRule={baseProjectRule} />);

    const card = screen.getByTestId("project-rule-card");
    expect(card).toHaveClass(
      "h-full",
      "bg-gradient-to-br",
      "from-neutral-800",
      "to-neutral-900",
      "border-neutral-700",
    );
  });

  test("Shows both badge and copy count for highly popular project rules", () => {
    const veryPopularProjectRule = { ...baseProjectRule, copyCount: 200 };
    render(<ProjectRuleCard projectRule={veryPopularProjectRule} />);

    expect(screen.getByText("Hot")).toBeInTheDocument();
    expect(screen.getByText("200 times copied")).toBeInTheDocument();
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

  test("Does not show copy count when copyCount is undefined", () => {
    const projectRuleWithoutCopyCount = {
      ...baseProjectRule,
      copyCount: undefined,
    };
    render(<ProjectRuleCard projectRule={projectRuleWithoutCopyCount} />);

    expect(screen.queryByText(/times copied/)).not.toBeInTheDocument();
    const copyIcon = document.querySelector(".lucide-copy");
    expect(copyIcon).not.toBeInTheDocument();
  });
});
