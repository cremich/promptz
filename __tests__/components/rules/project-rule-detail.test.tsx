import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProjectRuleDetail from "@/components/rules/project-rule-detail";
import { ProjectRule } from "@/lib/models/project-rule-model";

// Mock the child components
jest.mock("@/components/common/tags", () => {
  return function MockTags({ tags }: { tags: string[] }) {
    return <div data-testid="tags-mock">{tags.join(", ")}</div>;
  };
});

jest.mock("@/components/common/source-url", () => {
  return {
    SourceURL: function MockSourceURL({ url }: { url: string }) {
      return <div data-testid="source-url-mock">{url}</div>;
    },
  };
});

jest.mock("@/components/common/submission", () => {
  return function MockSubmission({
    createdAt,
    updatedAt,
    author,
  }: {
    createdAt?: string;
    updatedAt?: string;
    author?: string;
  }) {
    return (
      <div data-testid="mock-submission">
        {createdAt} {updatedAt} {author}
      </div>
    );
  };
});

describe("ProjectRuleDetail", () => {
  // Sample project rule data for testing
  const mockProjectRule: ProjectRule = {
    id: "rule-123",
    name: "Test Rule",
    description: "This is a test rule description",
    tags: ["test", "rule", "example"],
    content: "# Test Rule Content\n\nThis is the content of the test rule.",
    author: "Test Author",
    authorId: "user-123",
    slug: "test-rule",
    sourceURL: "https://github.com/example/repo",
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-02T00:00:00.000Z",
  };

  test("Renders the project rule details correctly", () => {
    render(<ProjectRuleDetail projectRule={mockProjectRule} />);

    // Check if title is rendered
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Test Rule",
    );

    // Check if description is rendered
    expect(
      screen.getByText("This is a test rule description"),
    ).toBeInTheDocument();

    // Check if tags are rendered
    const tags = screen.getByTestId("tags-mock");
    expect(tags).toHaveTextContent("test, rule, example");

    // Check if content is rendered
    expect(
      screen.getByText(
        "# Test Rule Content This is the content of the test rule.",
      ),
    ).toBeInTheDocument();

    // Check if source URL is rendered
    const sourceUrl = screen.getByTestId("source-url-mock");
    expect(sourceUrl).toHaveTextContent("https://github.com/example/repo");

    // Check that edit button is not rendered for non-owners
    expect(screen.queryByTestId("edit-button-mock")).not.toBeInTheDocument();
  });

  test("Handles missing optional fields gracefully", () => {
    const minimalProjectRule: ProjectRule = {
      id: "rule-123",
      name: "Minimal Rule",
      description: "Minimal description",
    };

    render(<ProjectRuleDetail projectRule={minimalProjectRule} />);

    // Check if title and description are rendered
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Minimal Rule",
    );
    expect(screen.getByText("Minimal description")).toBeInTheDocument();

    // Check that optional elements are not rendered
    expect(screen.queryByTestId("tags-mock")).not.toBeInTheDocument();
    expect(screen.queryByTestId("source-url-mock")).not.toBeInTheDocument();

    // Check that content section is not rendered when content is missing
    expect(
      screen.queryByTestId("project-rule-content-section"),
    ).not.toBeInTheDocument();
  });

  test("Renders hero section with proper structure", () => {
    render(<ProjectRuleDetail projectRule={mockProjectRule} />);

    // Check if hero section is rendered
    const heroSection = screen.getByTestId("project-rule-hero-section");
    expect(heroSection).toBeInTheDocument();
  });

  test("Displays copy and download counts in hero section", () => {
    const projectRuleWithCounts: ProjectRule = {
      ...mockProjectRule,
      copyCount: 15,
      downloadCount: 25,
    };

    render(<ProjectRuleDetail projectRule={projectRuleWithCounts} />);

    // Check if copy count is displayed
    expect(screen.getByTestId("copy-count")).toHaveTextContent("15");
    expect(screen.getByText("copies")).toBeInTheDocument();

    // Check if download count is displayed
    expect(screen.getByTestId("download-count")).toHaveTextContent("25");
    expect(screen.getByText("downloads")).toBeInTheDocument();
  });

  test("Renders content section with proper structure", () => {
    render(<ProjectRuleDetail projectRule={mockProjectRule} />);

    // Check if content section is rendered
    const contentSection = screen.getByTestId("project-rule-content-section");
    expect(contentSection).toBeInTheDocument();
  });
});
