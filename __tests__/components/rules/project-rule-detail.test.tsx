import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProjectRuleDetail from "@/components/rules/project-rule-detail";
import { ProjectRule } from "@/lib/models/project-rule-model";
import { ModelType } from "@/lib/forms/schema-definitions";

// Mock the child components
jest.mock("@/components/common/tags", () => {
  return function MockTags({ tags }: { tags: string[] }) {
    return <div data-testid="tags-mock">{tags.join(", ")}</div>;
  };
});

jest.mock("@/components/common/author", () => {
  return function MockAuthor({ name }: { name: string }) {
    return <div data-testid="author-mock">{name}</div>;
  };
});

jest.mock("@/components/common/edit-button", () => {
  return function MockEditRuleButton({ href }: { href: string }) {
    return <button data-testid="edit-button-mock">Edit {href}</button>;
  };
});

jest.mock("@/components/common/source-url", () => {
  return {
    SourceURL: function MockSourceURL({ url }: { url: string }) {
      return <div data-testid="source-url-mock">{url}</div>;
    },
  };
});

jest.mock("@/components/common/copy-clipboard", () => {
  return function MockCopyClipBoardButton({
    id,
    type,
    text,
  }: {
    id: string;
    type: ModelType;
    text: string;
  }) {
    return <button data-testid="copy-button-mock">Copy</button>;
  };
});

jest.mock("@/components/common/download-button", () => {
  return {
    DownloadButton: function MockDownloadButton({
      id,
      content,
      filename,
      label,
    }: {
      id: string;
      content: string;
      filename: string;
      label: string;
    }) {
      return <button data-testid="download-button-mock">{label}</button>;
    },
  };
});

describe("ProjectRuleDetail", () => {
  // Sample project rule data for testing
  const mockProjectRule: ProjectRule = {
    id: "rule-123",
    title: "Test Rule",
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
    render(<ProjectRuleDetail projectRule={mockProjectRule} isOwner={false} />);

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

    // Check if author is rendered
    const author = screen.getByTestId("author-mock");
    expect(author).toHaveTextContent("Test Author");

    // Check if date is rendered
    expect(screen.getByText(/Submitted on/)).toHaveTextContent(
      "Submitted on January 2, 2023",
    );

    // Check if content is rendered
    expect(
      screen.getByText(
        "# Test Rule Content This is the content of the test rule.",
      ),
    ).toBeInTheDocument();

    // Check if source URL is rendered
    const sourceUrl = screen.getByTestId("source-url-mock");
    expect(sourceUrl).toHaveTextContent("https://github.com/example/repo");

    // Check if copy and download buttons are rendered
    expect(screen.getByTestId("copy-button-mock")).toBeInTheDocument();
    expect(screen.getByTestId("download-button-mock")).toBeInTheDocument();

    // Check that edit button is not rendered for non-owners
    expect(screen.queryByTestId("edit-button-mock")).not.toBeInTheDocument();
  });

  test("Shows edit button when user is the owner", () => {
    render(<ProjectRuleDetail projectRule={mockProjectRule} isOwner={true} />);

    // Check if edit button is rendered for owners
    const editButton = screen.getByTestId("edit-button-mock");
    expect(editButton).toBeInTheDocument();
  });

  test("Handles missing optional fields gracefully", () => {
    const minimalProjectRule: ProjectRule = {
      id: "rule-123",
      title: "Minimal Rule",
      description: "Minimal description",
    };

    render(
      <ProjectRuleDetail projectRule={minimalProjectRule} isOwner={false} />,
    );

    // Check if title and description are rendered
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Minimal Rule",
    );
    expect(screen.getByText("Minimal description")).toBeInTheDocument();

    // Check that optional elements are not rendered
    expect(screen.queryByTestId("tags-mock")).not.toBeInTheDocument();
    expect(screen.queryByTestId("author-mock")).not.toBeInTheDocument();
    expect(screen.queryByTestId("source-url-mock")).not.toBeInTheDocument();
    expect(screen.queryByTestId("copy-button-mock")).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("download-button-mock"),
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId("edit-button-mock")).not.toBeInTheDocument();

    // Check that date shows as unknown when createdAt is missing
    expect(screen.getByText("Submitted on Unknown date")).toBeInTheDocument();
  });

  test("Uses updatedAt date when available", () => {
    const projectRuleWithUpdate: ProjectRule = {
      ...mockProjectRule,
      createdAt: "2023-01-01T00:00:00.000Z",
      updatedAt: "2023-02-15T00:00:00.000Z",
    };

    render(
      <ProjectRuleDetail projectRule={projectRuleWithUpdate} isOwner={false} />,
    );

    // Check if the displayed date is the updated date
    expect(screen.getByText(/Submitted on/)).toHaveTextContent(
      "Submitted on February 15, 2023",
    );
  });
});
