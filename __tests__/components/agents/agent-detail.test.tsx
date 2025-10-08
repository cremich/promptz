import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import AgentDetail from "@/components/agents/agent-detail";
import { Agent } from "@/lib/models/agent-model";

// Mock child components - Author component is no longer used, replaced by Submission component

jest.mock("@/components/common/tags", () => {
  return function MockTags({ tags }: { tags: string[] }) {
    return <div data-testid="tags">Tags: {tags.join(", ")}</div>;
  };
});
jest.mock("@/components/common/source-url", () => ({
  SourceURL: function MockSourceURL({ url }: { url: string }) {
    return <div data-testid="source-url">Source: {url}</div>;
  },
}));

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

jest.mock("@/components/prompt/prompt-instruction", () => {
  return function PromptInstruction({ text }: { text: string }) {
    return <div data-testid="prompt-instruction">{text}</div>;
  };
});

describe("AgentDetail", () => {
  const mockAgent: Agent = {
    id: "agent-1",
    name: "Test Agent",
    slug: "test-agent",
    description: "A test agent for testing",
    tags: ["test", "agent"],
    prompt: "You are a helpful test agent",
    tools: ["tool1", "tool2"],
    author: "Test User",
    sourceURL: "https://github.com/test/agent",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  };

  test("Renders agent details correctly", async () => {
    render(<AgentDetail agent={mockAgent} />);

    expect(screen.getByText("Test Agent")).toBeInTheDocument();
    expect(screen.getByText("A test agent for testing")).toBeInTheDocument();
    expect(screen.getByTestId("mock-submission")).toBeInTheDocument();
    expect(screen.getByTestId("tags")).toHaveTextContent("Tags: test, agent");
  });

  test("Shows agent instruction when prompt exists", () => {
    render(<AgentDetail agent={mockAgent} />);

    expect(screen.getByTestId("prompt-instruction")).toHaveTextContent(
      "You are a helpful test agent",
    );
  });

  test("Shows agent configuration section", () => {
    render(<AgentDetail agent={mockAgent} />);

    expect(screen.getByText("Agent Configuration")).toBeInTheDocument();
  });

  test("Shows source URL when provided", () => {
    render(<AgentDetail agent={mockAgent} />);

    expect(screen.getByTestId("source-url")).toHaveTextContent(
      "Source: https://github.com/test/agent",
    );
  });

  test("Hides source URL when not provided", () => {
    const agentWithoutSource = { ...mockAgent, sourceURL: undefined };
    render(<AgentDetail agent={agentWithoutSource} />);

    expect(screen.queryByTestId("source-url")).not.toBeInTheDocument();
  });

  test("Handles agent without tags", () => {
    const agentWithoutTags = { ...mockAgent, tags: undefined };
    render(<AgentDetail agent={agentWithoutTags} />);

    expect(screen.queryByTestId("tags")).not.toBeInTheDocument();
  });

  test("Shows enhanced configuration cards", () => {
    const agentWithConfig = {
      ...mockAgent,
      tools: ["tool1", "tool2"],
      allowedTools: ["allowed1", "allowed2"],
      resources: ["file://resource1.txt"],
      mcpServers: { server1: { command: "test" } },
    };
    render(<AgentDetail agent={agentWithConfig} />);

    expect(screen.getByTestId("tools-card")).toBeInTheDocument();
    expect(screen.getByTestId("resources-card")).toBeInTheDocument();
    expect(screen.getByTestId("mcp-servers-card")).toBeInTheDocument();
  });

  test("Hides configuration sections when no data is available", () => {
    const minimalAgent = {
      ...mockAgent,
      tools: undefined,
      allowedTools: undefined,
      resources: undefined,
      mcpServers: undefined,
    };
    render(<AgentDetail agent={minimalAgent} />);

    expect(screen.queryByTestId("tools-card")).not.toBeInTheDocument();
    expect(screen.queryByTestId("resources-card")).not.toBeInTheDocument();
    expect(screen.queryByTestId("mcp-servers-card")).not.toBeInTheDocument();
  });

  test("Shows system prompt with enhanced styling", () => {
    render(<AgentDetail agent={mockAgent} />);

    const promptSection = screen.getByTestId("system-prompt-section");
    expect(promptSection).toBeInTheDocument();
    expect(promptSection).toHaveClass("bg-gradient-to-r");
  });
});
