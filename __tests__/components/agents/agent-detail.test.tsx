import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import AgentDetail from "@/components/agents/agent-detail";
import { Agent } from "@/lib/models/agent-model";

// Mock child components
jest.mock("@/components/common/author", () => {
  return function MockAuthor({ name }: { name: string }) {
    return <div data-testid="author">Author: {name}</div>;
  };
});

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
    expect(screen.getByTestId("author")).toHaveTextContent("Author: Test User");
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

    expect(screen.getByTestId("agent-configuration")).toHaveTextContent(
      "Agent Configuration",
    );
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

    expect(screen.queryByTestId("author")).not.toBeInTheDocument();
  });

  test("Shows formatted creation date", () => {
    render(<AgentDetail agent={mockAgent} isOwner={false} />);

    expect(
      screen.getByText("Submitted on January 1, 2024"),
    ).toBeInTheDocument();
  });

  test("Shows formatted updated date when available", () => {
    const agentWithUpdatedDate = {
      ...mockAgent,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-02-15T00:00:00Z",
    };
    render(<AgentDetail agent={agentWithUpdatedDate} isOwner={false} />);

    expect(
      screen.getByText("Submitted on February 15, 2024"),
    ).toBeInTheDocument();
  });

  test("Shows unknown date when no creation date is available", () => {
    const agentWithoutDate = {
      ...mockAgent,
      createdAt: undefined,
      updatedAt: undefined,
    };
    render(<AgentDetail agent={agentWithoutDate} isOwner={false} />);

    expect(screen.getByText("Submitted on Unknown date")).toBeInTheDocument();
  });
});
