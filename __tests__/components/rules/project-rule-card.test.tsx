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

  test("Shows 'Trending' badge for project rules with total popularity 50-99", () => {
    // 30 copies + 25 downloads = 55 total popularity
    const trendingProjectRule = {
      ...baseProjectRule,
      copyCount: 30,
      downloadCount: 25,
    };
    render(<ProjectRuleCard projectRule={trendingProjectRule} />);

    expect(screen.getByText("Trending")).toBeInTheDocument();
    expect(screen.getByText("30 times copied")).toBeInTheDocument();
    expect(screen.getByText("25 downloads")).toBeInTheDocument();
  });

  test("Shows 'Hot' badge for project rules with total popularity 100+", () => {
    // 60 copies + 50 downloads = 110 total popularity
    const hotProjectRule = {
      ...baseProjectRule,
      copyCount: 60,
      downloadCount: 50,
    };
    render(<ProjectRuleCard projectRule={hotProjectRule} />);

    expect(screen.getByText("Hot")).toBeInTheDocument();
    expect(screen.getByText("60 times copied")).toBeInTheDocument();
    expect(screen.getByText("50 downloads")).toBeInTheDocument();
  });

  test("Does not show popularity badge for project rules with total popularity less than 50", () => {
    // 20 copies + 15 downloads = 35 total popularity
    const lowPopularityProjectRule = {
      ...baseProjectRule,
      copyCount: 20,
      downloadCount: 15,
    };
    render(<ProjectRuleCard projectRule={lowPopularityProjectRule} />);

    expect(screen.queryByText("Trending")).not.toBeInTheDocument();
    expect(screen.queryByText("Hot")).not.toBeInTheDocument();
    expect(screen.getByText("20 times copied")).toBeInTheDocument();
    expect(screen.getByText("15 downloads")).toBeInTheDocument();
  });

  test("Shows 'Trending' badge when only copyCount reaches threshold", () => {
    // 75 copies + 0 downloads = 75 total popularity
    const trendingByCopiesProjectRule = {
      ...baseProjectRule,
      copyCount: 75,
      downloadCount: 0,
    };
    render(<ProjectRuleCard projectRule={trendingByCopiesProjectRule} />);

    expect(screen.getByText("Trending")).toBeInTheDocument();
    expect(screen.getByText("75 times copied")).toBeInTheDocument();
    expect(screen.getByText("0 downloads")).toBeInTheDocument();
  });

  test("Shows 'Trending' badge when only downloadCount reaches threshold", () => {
    // 0 copies + 60 downloads = 60 total popularity
    const trendingByDownloadsProjectRule = {
      ...baseProjectRule,
      copyCount: 0,
      downloadCount: 60,
    };
    render(<ProjectRuleCard projectRule={trendingByDownloadsProjectRule} />);

    expect(screen.getByText("Trending")).toBeInTheDocument();
    expect(screen.getByText("0 times copied")).toBeInTheDocument();
    expect(screen.getByText("60 downloads")).toBeInTheDocument();
  });

  test("Formats large copy counts and download counts with locale string", () => {
    const popularProjectRule = {
      ...baseProjectRule,
      copyCount: 1234,
      downloadCount: 5678,
    };
    render(<ProjectRuleCard projectRule={popularProjectRule} />);

    const formattedCopyCount = (1234).toLocaleString();
    const formattedDownloadCount = (5678).toLocaleString();
    expect(
      screen.getByText(`${formattedCopyCount} times copied`),
    ).toBeInTheDocument();
    expect(
      screen.getByText(`${formattedDownloadCount} downloads`),
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

  test("Shows both badge and metrics for highly popular project rules", () => {
    // 120 copies + 80 downloads = 200 total popularity
    const veryPopularProjectRule = {
      ...baseProjectRule,
      copyCount: 120,
      downloadCount: 80,
    };
    render(<ProjectRuleCard projectRule={veryPopularProjectRule} />);

    expect(screen.getByText("Hot")).toBeInTheDocument();
    expect(screen.getByText("120 times copied")).toBeInTheDocument();
    expect(screen.getByText("80 downloads")).toBeInTheDocument();
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
      downloadCount: 10,
    };
    render(<ProjectRuleCard projectRule={projectRuleWithoutCopyCount} />);

    expect(screen.queryByText(/times copied/)).not.toBeInTheDocument();
    expect(screen.getByText("10 downloads")).toBeInTheDocument();
  });

  test("Does not show download count when downloadCount is undefined", () => {
    const projectRuleWithoutDownloadCount = {
      ...baseProjectRule,
      copyCount: 10,
      downloadCount: undefined,
    };
    render(<ProjectRuleCard projectRule={projectRuleWithoutDownloadCount} />);

    expect(screen.getByText("10 times copied")).toBeInTheDocument();
    expect(screen.queryByText(/downloads/)).not.toBeInTheDocument();
  });

  test("Does not show any metrics when both counts are undefined", () => {
    const projectRuleWithoutCounts = {
      ...baseProjectRule,
      copyCount: undefined,
      downloadCount: undefined,
    };
    render(<ProjectRuleCard projectRule={projectRuleWithoutCounts} />);

    expect(screen.queryByText(/times copied/)).not.toBeInTheDocument();
    expect(screen.queryByText(/downloads/)).not.toBeInTheDocument();
    const copyIcon = document.querySelector(".lucide-copy");
    const downloadIcon = document.querySelector(".lucide-download");
    expect(copyIcon).not.toBeInTheDocument();
    expect(downloadIcon).not.toBeInTheDocument();
  });
});
