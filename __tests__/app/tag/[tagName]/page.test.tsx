import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import PromptsTagPage, { generateMetadata } from "@/app/tag/[tagName]/page";
import { getPromptsAndRulesByTag } from "@/lib/actions/fetch-tags-action";

// Mock the fetch-tags-action
jest.mock("@/lib/actions/fetch-tags-action", () => ({
  getTag: jest.fn(),
  getPromptsAndRulesByTag: jest.fn(),
}));

// Mock the prompt and rule card components
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
    description: "TypeScript related prompts and rules",
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Renders tag page with prompts and rules", async () => {
    jest.mocked(getPromptsAndRulesByTag).mockResolvedValue({
      tag: mockTag,
      prompts: mockPrompts,
      rules: mockRules,
    });

    const props = {
      params: Promise.resolve({ tagName: "TypeScript" }),
    };

    render(await PromptsTagPage(props));

    // Check if tag header is rendered
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(
      screen.getByText("TypeScript related prompts and rules"),
    ).toBeInTheDocument();
    expect(screen.getByText("Technology")).toBeInTheDocument();

    // Check if stats are displayed
    expect(screen.getByText("2 prompts")).toBeInTheDocument();
    expect(screen.getByText("1 project rules")).toBeInTheDocument();

    // Check if prompts section is rendered
    expect(screen.getByText("Related Prompts")).toBeInTheDocument();
    expect(screen.getAllByTestId("prompt-card")).toHaveLength(2);

    // Check if rules section is rendered
    expect(screen.getByText("Related Project Rules")).toBeInTheDocument();
    expect(screen.getAllByTestId("rule-card")).toHaveLength(1);
  });

  test("Renders empty state when no content is found", async () => {
    jest.mocked(getPromptsAndRulesByTag).mockResolvedValue({
      tag: mockTag,
      prompts: [],
      rules: [],
    });

    const props = {
      params: Promise.resolve({ tagName: "EmptyTag" }),
    };

    render(await PromptsTagPage(props));

    // Check if empty state is rendered
    expect(screen.getByText("No content found")).toBeInTheDocument();
    expect(
      screen.getByText(/There are no prompts or project rules tagged with/),
    ).toBeInTheDocument();
    expect(screen.getAllByTestId("create-button")).toHaveLength(2);
  });

  test("Handles URL decoding correctly", async () => {
    jest.mocked(getPromptsAndRulesByTag).mockResolvedValue({
      tag: { ...mockTag, name: "Next.js" },
      prompts: [],
      rules: [],
    });

    const props = {
      params: Promise.resolve({ tagName: "Next.js" }),
    };

    render(await PromptsTagPage(props));

    expect(getPromptsAndRulesByTag).toHaveBeenCalledWith("Next.js");
    expect(screen.getByText("Next.js")).toBeInTheDocument();
  });

  test("Renders only prompts section when no rules exist", async () => {
    jest.mocked(getPromptsAndRulesByTag).mockResolvedValue({
      tag: mockTag,
      prompts: mockPrompts,
      rules: [],
    });

    const props = {
      params: Promise.resolve({ tagName: "TypeScript" }),
    };

    render(await PromptsTagPage(props));

    expect(screen.getByText("Related Prompts")).toBeInTheDocument();
    expect(screen.getAllByTestId("prompt-card")).toHaveLength(2);
    expect(screen.queryByText("Related Project Rules")).not.toBeInTheDocument();
  });

  test("Renders only rules section when no prompts exist", async () => {
    jest.mocked(getPromptsAndRulesByTag).mockResolvedValue({
      tag: mockTag,
      prompts: [],
      rules: mockRules,
    });

    const props = {
      params: Promise.resolve({ tagName: "TypeScript" }),
    };

    render(await PromptsTagPage(props));

    expect(screen.getByText("Related Project Rules")).toBeInTheDocument();
    expect(screen.getAllByTestId("rule-card")).toHaveLength(1);
    expect(screen.queryByText("Related Prompts")).not.toBeInTheDocument();
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
      description: "TypeScript related prompts and rules",
      category: "Technology",
    };

    getTag.mockResolvedValue(mockTag);

    const props = {
      params: Promise.resolve({ tagName: "TypeScript" }),
    };

    const metadata = await generateMetadata(props);

    expect(metadata.title).toBe(
      "TypeScript Prompts for Amazon Q Developer - Promptz",
    );
    expect(metadata.description).toContain(
      "Discover TypeScript prompts for Amazon Q Developer",
    );
    expect(metadata.keywords).toContain("TypeScript");
    expect(metadata.keywords).toContain("Amazon Q Developer");
    expect(metadata.openGraph?.title).toBe(
      "TypeScript Prompts for Amazon Q Developer - Promptz",
    );
    expect(metadata.alternates?.canonical).toBe(
      "https://promptz.dev/prompts/tag/TypeScript",
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
      "Browse prompts tagged with TestTag",
    );
    expect(metadata.description).not.toContain("undefined");
  });

  test("Handles URL encoding in metadata generation", async () => {
    const mockTag = {
      name: "Next.js",
      description: "Next.js framework prompts",
    };

    getTag.mockResolvedValue(mockTag);

    const props = {
      params: Promise.resolve({ tagName: "Next.js" }),
    };

    const metadata = await generateMetadata(props);

    expect(metadata.alternates?.canonical).toBe(
      "https://promptz.dev/prompts/tag/Next.js",
    );
    expect(metadata.openGraph?.url).toBe(
      "https://promptz.dev/prompts/tag/Next.js",
    );
  });

  test("Handles errors gracefully in metadata generation", async () => {
    getTag.mockRejectedValue(new Error("Database error"));

    const props = {
      params: Promise.resolve({ tagName: "ErrorTag" }),
    };

    const metadata = await generateMetadata(props);

    expect(metadata.title).toBe("Tag - Promptz");
    expect(metadata.description).toBe("Browse prompts by tag on Promptz.");
  });
});
