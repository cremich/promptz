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
    };

    render(<AgentCard agent={agentWithZeroCounts} />);

    expect(screen.queryByText("0")).not.toBeInTheDocument();
  });
});
