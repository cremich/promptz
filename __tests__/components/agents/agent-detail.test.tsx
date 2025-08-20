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

jest.mock("@/components/common/copy-clipboard", () => {
  return function MockCopyClipboard() {
    return <button data-testid="copy-button">Copy</button>;
  };
});

jest.mock("@/components/common/edit-button", () => {
  return function MockEditButton({
    href,
    name,
  }: {
    href: string;
    name: string;
  }) {
    return (
      <a href={href} data-testid="edit-button">
        {name}
      </a>
    );
  };
});

jest.mock("@/components/common/download-button", () => ({
  DownloadButton: function MockAgentDownloadButton() {
    return <button data-testid="download-button">Download Agent</button>;
  },
}));

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
    scope,
  }: {
    createdAt?: string;
    updatedAt?: string;
    author?: string;
    scope?: string;
  }) {
    const formattedDate = createdAt
      ? new Date(updatedAt || createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "Unknown date";
    const authorText = author ? `by @${author}` : ``;
    return (
      <div className="flex items-center gap-3">
        <div data-testid="submitted-date">
          Submitted on {formattedDate} {authorText}
        </div>
        {scope !== undefined && (
          <div>{scope === "PUBLIC" ? "Public" : "Private"}</div>
        )}
      </div>
    );
  };
});

jest.mock("@/components/prompt/prompt-instruction", () => {
  return function PromptInstruction({ text }: { text: string }) {
    return <div data-testid="prompt-instruction">{text}</div>;
  };
});

jest.mock("@/components/agents/agent-configuration", () => {
  return function MockAgentConfiguration({ title }: { title: string }) {
    return <div data-testid="agent-configuration">{title}</div>;
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
    authorId: "user-1",
    scope: "PUBLIC",
    sourceURL: "https://github.com/test/agent",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    copyCount: 5,
    downloadCount: 10,
  };

  test("Renders agent details correctly", async () => {
    render(<AgentDetail agent={mockAgent} isOwner={false} />);

    expect(screen.getByText("Test Agent")).toBeInTheDocument();
    expect(screen.getByText("A test agent for testing")).toBeInTheDocument();
    expect(screen.getByTestId("submitted-date")).toHaveTextContent(
      "Submitted on January 1, 2024 by @Test User",
    );
    expect(screen.getByTestId("tags")).toHaveTextContent("Tags: test, agent");
    expect(screen.getByText("Public")).toBeInTheDocument();
  });

  test("Shows edit button when user is owner", () => {
    render(<AgentDetail agent={mockAgent} isOwner={true} />);

    const editButton = screen.getByTestId("edit-button");
    expect(editButton).toBeInTheDocument();
    expect(editButton).toHaveAttribute("href", "/agents/agent/test-agent/edit");
  });

  test("Hides edit button when user is not owner", () => {
    render(<AgentDetail agent={mockAgent} isOwner={false} />);

    expect(screen.queryByTestId("edit-button")).not.toBeInTheDocument();
  });

  test("Hides copy button when agent has no prompt", () => {
    const agentWithoutPrompt = { ...mockAgent, prompt: undefined };
    render(<AgentDetail agent={agentWithoutPrompt} isOwner={false} />);

    expect(screen.queryByTestId("copy-button")).not.toBeInTheDocument();
  });

  test("Shows download button", () => {
    render(<AgentDetail agent={mockAgent} isOwner={false} />);

    expect(screen.getByTestId("download-button")).toBeInTheDocument();
  });

  test("Shows agent instruction when prompt exists", () => {
    render(<AgentDetail agent={mockAgent} isOwner={false} />);

    expect(screen.getByTestId("prompt-instruction")).toHaveTextContent(
      "You are a helpful test agent",
    );
  });

  test("Shows agent configuration section", () => {
    render(<AgentDetail agent={mockAgent} isOwner={false} />);

    expect(screen.getByText("Agent Configuration")).toBeInTheDocument();
  });

  test("Shows source URL when provided", () => {
    render(<AgentDetail agent={mockAgent} isOwner={false} />);

    expect(screen.getByTestId("source-url")).toHaveTextContent(
      "Source: https://github.com/test/agent",
    );
  });

  test("Hides source URL when not provided", () => {
    const agentWithoutSource = { ...mockAgent, sourceURL: undefined };
    render(<AgentDetail agent={agentWithoutSource} isOwner={false} />);

    expect(screen.queryByTestId("source-url")).not.toBeInTheDocument();
  });

  test("Shows private badge for private agents", () => {
    const privateAgent = { ...mockAgent, scope: "PRIVATE" };
    render(<AgentDetail agent={privateAgent} isOwner={true} />);

    expect(screen.getByText("Private")).toBeInTheDocument();
  });

  test("Handles agent without tags", () => {
    const agentWithoutTags = { ...mockAgent, tags: undefined };
    render(<AgentDetail agent={agentWithoutTags} isOwner={false} />);

    expect(screen.queryByTestId("tags")).not.toBeInTheDocument();
  });

  test("Handles agent without author", () => {
    const agentWithoutAuthor = { ...mockAgent, author: undefined };
    render(<AgentDetail agent={agentWithoutAuthor} isOwner={false} />);

    expect(screen.getByTestId("submitted-date")).toHaveTextContent(
      "Submitted on January 1, 2024",
    );
    expect(screen.getByTestId("submitted-date")).not.toHaveTextContent("by @");
  });

  test("Shows formatted creation date", () => {
    render(<AgentDetail agent={mockAgent} isOwner={false} />);

    expect(screen.getByTestId("submitted-date")).toHaveTextContent(
      "Submitted on January 1, 2024",
    );
  });

  test("Shows formatted updated date when available", () => {
    const agentWithUpdatedDate = {
      ...mockAgent,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-02-15T00:00:00Z",
    };
    render(<AgentDetail agent={agentWithUpdatedDate} isOwner={false} />);

    expect(screen.getByTestId("submitted-date")).toHaveTextContent(
      "Submitted on February 15, 2024",
    );
  });

  test("Shows unknown date when no creation date is available", () => {
    const agentWithoutDate = {
      ...mockAgent,
      createdAt: undefined,
      updatedAt: undefined,
    };
    render(<AgentDetail agent={agentWithoutDate} isOwner={false} />);

    expect(screen.getByTestId("submitted-date")).toHaveTextContent(
      "Submitted on Unknown date",
    );
  });

  test("Renders modern hero section with gradient background", () => {
    render(<AgentDetail agent={mockAgent} isOwner={false} />);

    const heroSection = screen.getByTestId("agent-hero-section");
    expect(heroSection).toBeInTheDocument();
    expect(heroSection).toHaveClass("bg-gradient-to-br");
  });

  test("Displays agent stats in hero section", () => {
    render(<AgentDetail agent={mockAgent} isOwner={false} />);

    expect(screen.getByTestId("copy-count")).toHaveTextContent("5");
    expect(screen.getByTestId("download-count")).toHaveTextContent("10");
  });

  test("Shows enhanced configuration cards", () => {
    const agentWithConfig = {
      ...mockAgent,
      tools: ["tool1", "tool2"],
      allowedTools: ["allowed1", "allowed2"],
      resources: ["file://resource1.txt"],
      mcpServers: { server1: { command: "test" } },
    };
    render(<AgentDetail agent={agentWithConfig} isOwner={false} />);

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
    render(<AgentDetail agent={minimalAgent} isOwner={false} />);

    expect(screen.queryByTestId("tools-card")).not.toBeInTheDocument();
    expect(screen.queryByTestId("resources-card")).not.toBeInTheDocument();
    expect(screen.queryByTestId("mcp-servers-card")).not.toBeInTheDocument();
  });

  test("Shows system prompt with enhanced styling", () => {
    render(<AgentDetail agent={mockAgent} isOwner={false} />);

    const promptSection = screen.getByTestId("system-prompt-section");
    expect(promptSection).toBeInTheDocument();
    expect(promptSection).toHaveClass("bg-gradient-to-r");
  });
});
