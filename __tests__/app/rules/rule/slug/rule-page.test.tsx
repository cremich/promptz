import { describe, expect, test } from "@jest/globals";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProjectRulePage, {
  generateMetadata,
} from "@/app/rules/rule/[slug]/page";
import { fetchProjectRuleBySlug } from "@/lib/actions/fetch-rules-action";
import { notFound } from "next/navigation";
import { ProjectRule } from "@/lib/models/project-rule-model";

// Mock the server actions
jest.mock("@/lib/actions/fetch-rules-action", () => ({
  fetchProjectRuleBySlug: jest.fn(),
}));

// Mock the ProjectRuleDetail component
jest.mock("@/components/rules/project-rule-detail", () => {
  return function MockProjectRuleDetail({ projectRule }: { projectRule: any }) {
    return (
      <div data-testid="project-rule-detail-mock">
        <div data-testid="project-rule-title">{projectRule.title}</div>
      </div>
    );
  };
});

// Mock next/navigation
jest.mock("next/navigation", () => ({
  notFound: jest.fn(),
}));

describe("ProjectRulePage", () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Renders the project rule detail when rule exists", async () => {
    // Mock the project rule data
    const mockProjectRule = {
      id: "rule-123",
      title: "Test Rule",
      slug: "test-rule",
      description: "This is a test rule",
      tags: ["test", "rule"],
      content: "# Test Rule Content",
      author: "Test Author",
      authorId: "user-123::^",
      public: true,
      createdAt: "2023-01-01T00:00:00.000Z",
      updatedAt: "2023-01-02T00:00:00.000Z",
    };

    // Setup mocks
    (fetchProjectRuleBySlug as jest.Mock).mockResolvedValue(mockProjectRule);

    // Render the component with mock params
    const { findByTestId } = render(
      await ProjectRulePage({ params: Promise.resolve({ slug: "test-rule" }) }),
    );

    // Check if the ProjectRuleDetail component is rendered with correct props
    const projectRuleDetail = await findByTestId("project-rule-detail-mock");
    expect(projectRuleDetail).toBeInTheDocument();
    const projectRuleDetailTitle = await findByTestId("project-rule-title");
    expect(projectRuleDetailTitle).toBeInTheDocument();

    // Verify that notFound was not called
    expect(notFound).not.toHaveBeenCalled();
  });

  test("Calls notFound when project rule doesn't exist", async () => {
    // Mock fetchProjectRuleBySlug to return undefined (rule not found)
    (fetchProjectRuleBySlug as jest.Mock).mockResolvedValue(undefined);

    try {
      // Render the component
      await ProjectRulePage({
        params: Promise.resolve({ slug: "non-existent-rule" }),
      });
    } catch (error) {
      // This is expected as notFound() throws an error in tests
    }

    // Verify that notFound was called
    expect(notFound).toHaveBeenCalled();
  });
});

describe("generateMetadata", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Returns correct metadata when project rule exists", async () => {
    // Mock project rule
    const mockProjectRule: ProjectRule = {
      id: "rule-123",
      name: "Test Rule",
      slug: "test-rule",
      description: "This is a test rule",
    };

    // Setup mock
    (fetchProjectRuleBySlug as jest.Mock).mockResolvedValue(mockProjectRule);

    // Call generateMetadata
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: "test-rule" }),
    });

    // Check metadata values
    expect(metadata).toEqual({
      title: "Test Rule - Project Rule for Amazon Q Developer",
      description: "This is a test rule",
      openGraph: {
        title: "Test Rule - Project Rule for Amazon Q Developer",
        description: "This is a test rule",
      },
    });
  });

  test("Returns not found metadata when project rule doesn't exist", async () => {
    // Mock fetchProjectRuleBySlug to return undefined
    (fetchProjectRuleBySlug as jest.Mock).mockResolvedValue(undefined);

    // Call generateMetadata
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: "non-existent-rule" }),
    });

    // Check metadata values for not found case
    expect(metadata).toEqual({
      title: "Project Rule Not Found",
    });
  });
});
