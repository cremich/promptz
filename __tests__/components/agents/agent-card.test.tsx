import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import AgentCard from "@/components/agents/agent-card";
import { Agent } from "@/lib/models/agent-model";

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

describe("AgentCard", () => {
  const mockAgent: Agent = {
    id: "1",
    name: "Test Agent",
    description: "A test agent for development",
    slug: "test-agent",
    tags: ["development", "testing"],
    tools: ["git", "npm", "docker"],
    author: "Test Author",
    copyCount: 25,
    downloadCount: 15,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  };

  test("renders agent card with basic information", () => {
    render(<AgentCard agent={mockAgent} />);

    expect(screen.getByText("Test Agent")).toBeInTheDocument();
    expect(
      screen.getByText("A test agent for development"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("tags-mock")).toHaveTextContent(
      "development, testing",
    );
    expect(screen.getByTestId("author-mock")).toHaveTextContent("Test Author");
  });

  test("renders agent card with tools", () => {
    render(<AgentCard agent={mockAgent} />);

    expect(screen.getByText("git")).toBeInTheDocument();
    expect(screen.getByText("npm")).toBeInTheDocument();
    expect(screen.getByText("docker")).toBeInTheDocument();
  });

  test("renders agent card with usage statistics", () => {
    render(<AgentCard agent={mockAgent} />);

    expect(screen.getByText("25")).toBeInTheDocument();
    expect(screen.getByText("15")).toBeInTheDocument();
  });

  test("renders trending badge for popular agents", () => {
    const popularAgent: Agent = {
      ...mockAgent,
      copyCount: 30,
      downloadCount: 25,
    };

    render(<AgentCard agent={popularAgent} />);

    expect(screen.getByText("Trending")).toBeInTheDocument();
  });

  test("renders hot badge for very popular agents", () => {
    const hotAgent: Agent = {
      ...mockAgent,
      copyCount: 60,
      downloadCount: 50,
    };

    render(<AgentCard agent={hotAgent} />);

    expect(screen.getByText("Hot")).toBeInTheDocument();
  });

  test("renders agent card with many tools showing overflow", () => {
    const agentWithManyTools: Agent = {
      ...mockAgent,
      tools: ["git", "npm", "docker", "kubernetes", "terraform", "ansible"],
    };

    render(<AgentCard agent={agentWithManyTools} />);

    expect(screen.getByText("git")).toBeInTheDocument();
    expect(screen.getByText("npm")).toBeInTheDocument();
    expect(screen.getByText("docker")).toBeInTheDocument();
    expect(screen.getByText("+3 more")).toBeInTheDocument();
  });

  test("renders agent card without optional fields", () => {
    const minimalAgent: Agent = {
      id: "2",
      name: "Minimal Agent",
      description: "A minimal agent",
      slug: "minimal-agent",
    };

    render(<AgentCard agent={minimalAgent} />);

    expect(screen.getByText("Minimal Agent")).toBeInTheDocument();
    expect(screen.getByText("A minimal agent")).toBeInTheDocument();
    expect(screen.queryByTestId("tags-mock")).not.toBeInTheDocument();
    expect(screen.queryByTestId("author-mock")).not.toBeInTheDocument();
  });

  test("renders correct link to agent detail page", () => {
    render(<AgentCard agent={mockAgent} />);

    const link = screen.getByRole("link", { name: "Show Test Agent" });
    expect(link).toHaveAttribute("href", "/agents/agent/test-agent");
  });

  test("does not show usage statistics when counts are zero", () => {
    const agentWithZeroCounts: Agent = {
      ...mockAgent,
      copyCount: 0,
      downloadCount: 0,
    };

    render(<AgentCard agent={agentWithZeroCounts} />);

    expect(screen.queryByText("0")).not.toBeInTheDocument();
  });

  test("shows only copy count when download count is zero", () => {
    const agentWithOnlyCopies: Agent = {
      ...mockAgent,
      copyCount: 10,
      downloadCount: 0,
    };

    render(<AgentCard agent={agentWithOnlyCopies} />);

    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.queryByText("0")).not.toBeInTheDocument();
  });

  test("shows only download count when copy count is zero", () => {
    const agentWithOnlyDownloads: Agent = {
      ...mockAgent,
      copyCount: 0,
      downloadCount: 8,
    };

    render(<AgentCard agent={agentWithOnlyDownloads} />);

    expect(screen.getByText("8")).toBeInTheDocument();
    expect(screen.queryByText("0")).not.toBeInTheDocument();
  });
});
