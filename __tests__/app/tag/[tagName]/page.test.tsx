import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import PromptsTagPage, { generateMetadata } from "@/app/tag/[tagName]/page";
import { getPromptsRulesAndAgentsByTag } from "@/lib/actions/fetch-tags-action";

// Mock the fetch-tags-action
jest.mock("@/lib/actions/fetch-tags-action", () => ({
  getTag: jest.fn(),
  getPromptsRulesAndAgentsByTag: jest.fn(),
}));

// Mock the prompt, rule, and agent card components
jest.mock("@/components/prompt/prompt-card", () => {
  return function MockPromptCard({ prompt }: { prompt: any }) {
    return (
      <div data-testid="prompt-card">
        <h3>{prompt.title}</h3>
        <p>{prompt.description}</p>
      </div>
    );
  };
});

jest.mock("@/components/rules/project-rule-card", () => {
  return function MockProjectRuleCard({ projectRule }: { projectRule: any }) {
    return (
      <div data-testid="rule-card">
        <h3>{projectRule.title}</h3>
        <p>{projectRule.description}</p>
      </div>
    );
  };
});

jest.mock("@/components/agents/agent-card", () => {
  return function MockAgentCard({ agent }: { agent: any }) {
    return (
      <div data-testid="agent-card">
        <h3>{agent.name}</h3>
        <p>{agent.description}</p>
      </div>
    );
  };
});

jest.mock("@/components/common/create-button", () => {
  return function MockCreateButton({
    href,
    name,
  }: {
    href: string;
    name: string;
  }) {
    return (
      <a href={href} data-testid="create-button">
        {name}
      </a>
    );
  };
});

// Mock next/navigation
jest.mock("next/navigation", () => ({
  notFound: jest.fn(),
}));

describe("PromptsTagPage", () => {
  const mockTag = {
    name: "TypeScript",
    description: "TypeScript related prompts, rules, and agents",
    category: "Technology",
  };

  const mockPrompts = [
    {
      id: "1",
      title: "TypeScript Interface Generator",
      description: "Generate TypeScript interfaces from JSON",
      tags: ["TypeScript", "Interface"],
      slug: "typescript-interface-generator",
      createdAt: "2023-01-01T12:00:00Z",
      updatedAt: "2023-01-01T12:00:00Z",
      public: true,
    },
    {
      id: "2",
      title: "TypeScript Error Handler",
      description: "Handle TypeScript compilation errors",
      tags: ["TypeScript", "Error"],
      slug: "typescript-error-handler",
      createdAt: "2023-01-02T12:00:00Z",
      updatedAt: "2023-01-02T12:00:00Z",
      public: true,
    },
  ];

  const mockRules = [
    {
      id: "1",
      title: "TypeScript Coding Standards",
      description: "Enforce TypeScript coding standards",
      tags: ["TypeScript", "Standards"],
      slug: "typescript-coding-standards",
      createdAt: "2023-01-01T12:00:00Z",
      updatedAt: "2023-01-01T12:00:00Z",
      public: true,
    },
  ];

  const mockAgents = [
    {
      id: "1",
      name: "TypeScript Assistant",
      description: "AI assistant for TypeScript development",
      tags: ["TypeScript", "Assistant"],
      slug: "typescript-assistant",
      tools: ["fs_read", "fs_write"],
      author: "Test Author",
      createdAt: "2023-01-01T12:00:00Z",
      updatedAt: "2023-01-01T12:00:00Z",
      copyCount: 5,
      downloadCount: 10,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Renders tag page with prompts, rules, and agents", async () => {
    jest.mocked(getPromptsRulesAndAgentsByTag).mockResolvedValue({
      tag: mockTag,
      prompts: mockPrompts,
      rules: mockRules,
      agents: mockAgents,
    });

    const props = {
      params: Promise.resolve({ tagName: "TypeScript" }),
    };

    render(await PromptsTagPage(props));

    // Check if tag header is rendered
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(
      screen.getByText("TypeScript related prompts, rules, and agents"),
    ).toBeInTheDocument();
    expect(screen.getByText("Technology")).toBeInTheDocument();

    // Check if stats are displayed
    expect(screen.getByText("2 prompts")).toBeInTheDocument();
    expect(screen.getByText("1 project rules")).toBeInTheDocument();
    expect(screen.getByText("1 agents")).toBeInTheDocument();

    // Check if prompts section is rendered
    expect(screen.getByText("Related Prompts")).toBeInTheDocument();
    expect(screen.getAllByTestId("prompt-card")).toHaveLength(2);

    // Check if rules section is rendered
    expect(screen.getByText("Related Project Rules")).toBeInTheDocument();
    expect(screen.getAllByTestId("rule-card")).toHaveLength(1);

    // Check if agents section is rendered
    expect(screen.getByText("Related Agents")).toBeInTheDocument();
    expect(screen.getAllByTestId("agent-card")).toHaveLength(1);
  });

  test("Renders empty state when no content is found", async () => {
    jest.mocked(getPromptsRulesAndAgentsByTag).mockResolvedValue({
      tag: mockTag,
      prompts: [],
      rules: [],
      agents: [],
    });

    const props = {
      params: Promise.resolve({ tagName: "EmptyTag" }),
    };

    render(await PromptsTagPage(props));

    // Check if empty state is rendered
    expect(screen.getByText("No content found")).toBeInTheDocument();
    expect(
      screen.getByText(
        /There are no prompts, project rules, or agents tagged with/,
      ),
    ).toBeInTheDocument();
    expect(screen.getAllByTestId("create-button")).toHaveLength(3);
    expect(screen.getByText("Create Agent")).toBeInTheDocument();
  });

  test("Handles URL decoding correctly", async () => {
    jest.mocked(getPromptsRulesAndAgentsByTag).mockResolvedValue({
      tag: { ...mockTag, name: "Next.js" },
      prompts: [],
      rules: [],
      agents: [],
    });

    const props = {
      params: Promise.resolve({ tagName: "Next.js" }),
    };

    render(await PromptsTagPage(props));

    expect(getPromptsRulesAndAgentsByTag).toHaveBeenCalledWith("Next.js");
    expect(screen.getByText("Next.js")).toBeInTheDocument();
  });

  test("Renders only prompts section when no rules or agents exist", async () => {
    jest.mocked(getPromptsRulesAndAgentsByTag).mockResolvedValue({
      tag: mockTag,
      prompts: mockPrompts,
      rules: [],
      agents: [],
    });

    const props = {
      params: Promise.resolve({ tagName: "TypeScript" }),
    };

    render(await PromptsTagPage(props));

    expect(screen.getByText("Related Prompts")).toBeInTheDocument();
    expect(screen.getAllByTestId("prompt-card")).toHaveLength(2);
    expect(screen.queryByText("Related Project Rules")).not.toBeInTheDocument();
    expect(screen.queryByText("Related Agents")).not.toBeInTheDocument();
  });

  test("Renders only rules section when no prompts or agents exist", async () => {
    jest.mocked(getPromptsRulesAndAgentsByTag).mockResolvedValue({
      tag: mockTag,
      prompts: [],
      rules: mockRules,
      agents: [],
    });

    const props = {
      params: Promise.resolve({ tagName: "TypeScript" }),
    };

    render(await PromptsTagPage(props));

    expect(screen.getByText("Related Project Rules")).toBeInTheDocument();
    expect(screen.getAllByTestId("rule-card")).toHaveLength(1);
    expect(screen.queryByText("Related Prompts")).not.toBeInTheDocument();
    expect(screen.queryByText("Related Agents")).not.toBeInTheDocument();
  });

  test("Renders only agents section when no prompts or rules exist", async () => {
    jest.mocked(getPromptsRulesAndAgentsByTag).mockResolvedValue({
      tag: mockTag,
      prompts: [],
      rules: [],
      agents: mockAgents,
    });

    const props = {
      params: Promise.resolve({ tagName: "TypeScript" }),
    };

    render(await PromptsTagPage(props));

    expect(screen.getByText("Related Agents")).toBeInTheDocument();
    expect(screen.getAllByTestId("agent-card")).toHaveLength(1);
    expect(screen.queryByText("Related Prompts")).not.toBeInTheDocument();
    expect(screen.queryByText("Related Project Rules")).not.toBeInTheDocument();
  });

  test("Renders mixed content sections correctly", async () => {
    jest.mocked(getPromptsRulesAndAgentsByTag).mockResolvedValue({
      tag: mockTag,
      prompts: mockPrompts,
      rules: [],
      agents: mockAgents,
    });

    const props = {
      params: Promise.resolve({ tagName: "TypeScript" }),
    };

    render(await PromptsTagPage(props));

    expect(screen.getByText("Related Prompts")).toBeInTheDocument();
    expect(screen.getByText("Related Agents")).toBeInTheDocument();
    expect(screen.getAllByTestId("prompt-card")).toHaveLength(2);
    expect(screen.getAllByTestId("agent-card")).toHaveLength(1);
    expect(screen.queryByText("Related Project Rules")).not.toBeInTheDocument();
  });
});

describe("generateMetadata", () => {
  const { getTag } = require("@/lib/actions/fetch-tags-action");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Generates correct metadata for existing tag", async () => {
    const mockTag = {
      name: "TypeScript",
      description: "TypeScript related prompts, rules, and agents",
      category: "Technology",
    };

    getTag.mockResolvedValue(mockTag);

    const props = {
      params: Promise.resolve({ tagName: "TypeScript" }),
    };

    const metadata = await generateMetadata(props);

    expect(metadata.title).toBe(
      "TypeScript Prompts, Rules & Agents for Amazon Q Developer - Promptz",
    );
    expect(metadata.description).toContain(
      "Discover TypeScript prompts, project rules, and agents for Amazon Q Developer",
    );
    expect(metadata.keywords).toContain("TypeScript");
    expect(metadata.keywords).toContain("Amazon Q Developer");
    expect(metadata.keywords).toContain("prompts");
    expect(metadata.keywords).toContain("project rules");
    expect(metadata.keywords).toContain("agents");
    expect(metadata.openGraph?.title).toBe(
      "TypeScript Prompts, Rules & Agents for Amazon Q Developer - Promptz",
    );
    expect(metadata.alternates?.canonical).toBe(
      "https://promptz.dev/tag/TypeScript",
    );
  });

  test("Generates fallback metadata for non-existent tag", async () => {
    getTag.mockResolvedValue(null);

    const props = {
      params: Promise.resolve({ tagName: "NonExistentTag" }),
    };

    const metadata = await generateMetadata(props);

    expect(metadata.title).toBe("Tag Not Found - Promptz");
    expect(metadata.description).toBe("The requested tag could not be found.");
  });

  test("Generates metadata without description when tag has no description", async () => {
    const mockTag = {
      name: "TestTag",
      category: "Technology",
    };

    getTag.mockResolvedValue(mockTag);

    const props = {
      params: Promise.resolve({ tagName: "TestTag" }),
    };

    const metadata = await generateMetadata(props);

    expect(metadata.description).toContain(
      "Browse prompts, project rules, and agents tagged with TestTag",
    );
    expect(metadata.description).not.toContain("undefined");
  });

  test("Handles URL encoding in metadata generation", async () => {
    const mockTag = {
      name: "Next.js",
      description: "Next.js framework prompts, rules, and agents",
    };

    getTag.mockResolvedValue(mockTag);

    const props = {
      params: Promise.resolve({ tagName: "Next.js" }),
    };

    const metadata = await generateMetadata(props);

    expect(metadata.alternates?.canonical).toBe(
      "https://promptz.dev/tag/Next.js",
    );
    expect(metadata.openGraph?.url).toBe("https://promptz.dev/tag/Next.js");
  });

  test("Handles errors gracefully in metadata generation", async () => {
    getTag.mockRejectedValue(new Error("Database error"));

    const props = {
      params: Promise.resolve({ tagName: "ErrorTag" }),
    };

    const metadata = await generateMetadata(props);

    expect(metadata.title).toBe("Tag - Promptz");
    expect(metadata.description).toBe(
      "Browse prompts, project rules, and agents by tag on Promptz.",
    );
  });
});
