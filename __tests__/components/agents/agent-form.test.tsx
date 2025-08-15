import { describe, expect, test, beforeEach } from "@jest/globals";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import AgentForm from "@/components/agents/agent-form";
import { Agent } from "@/lib/models/agent-model";
import { Tag } from "@/lib/models/tags-model";

// Mock the new components
jest.mock("@/components/forms/tools-multi-select", () => ({
  ToolsMultiSelect: ({ value, onChange, placeholder }: any) => (
    <div data-testid="tools-multi-select">
      <span>{placeholder}</span>
      <div data-testid="selected-tools">
        {value?.map((tool: string) => (
          <span key={tool} data-testid={`tool-${tool}`}>
            {tool}
          </span>
        ))}
      </div>
      <button
        onClick={() => onChange([...value, "test_tool"])}
        data-testid="add-tool"
      >
        Add Tool
      </button>
    </div>
  ),
}));

jest.mock("@/components/forms/tool-aliases-manager", () => ({
  ToolAliasesManager: ({ value, onChange }: any) => (
    <div data-testid="tool-aliases-manager">
      <div data-testid="aliases">
        {Object.entries(value || {}).map(([alias, tool]: [string, any]) => (
          <div key={alias} data-testid={`alias-${alias}`}>
            {alias} → {tool}
          </div>
        ))}
      </div>
      <button
        onClick={() => onChange({ ...value, test_alias: "test_tool" })}
        data-testid="add-alias"
      >
        Add Alias
      </button>
    </div>
  ),
}));

jest.mock("@/components/forms/mcp-servers-manager", () => ({
  McpServersManager: ({ value, onChange }: any) => (
    <div data-testid="mcp-servers-manager">
      <div data-testid="servers">
        {Object.entries(value || {}).map(([name, config]: [string, any]) => (
          <div key={name} data-testid={`server-${name}`}>
            {name}: {config.command}
          </div>
        ))}
      </div>
      {Object.keys(value || {}).length === 0 && (
        <div>
          <p>No MCP servers configured</p>
          <p>Add MCP servers to extend your agent's capabilities</p>
        </div>
      )}
      <input placeholder="Server name (e.g., 'filesystem', 'git')" />
      <button
        onClick={() =>
          onChange({
            ...value,
            test_server: {
              command: "test-command",
              args: [],
              env: {},
              timeout: undefined,
              disabled: false,
            },
          })
        }
      >
        Add Server
      </button>
    </div>
  ),
}));

jest.mock("@/components/forms/resources-manager", () => ({
  ResourcesManager: ({ value, onChange }: any) => (
    <div data-testid="resources-manager">
      <div data-testid="resources">
        {(value || []).map((resource: string, index: number) => (
          <div key={index} data-testid={`resource-${index}`}>
            {resource}
          </div>
        ))}
      </div>
      <input
        placeholder="Enter file path (e.g., ./src/components, ~/documents/config.json)"
        data-testid="resource-input"
      />
      <button
        onClick={() => onChange([...(value || []), "./new/resource.txt"])}
        data-testid="add-resource"
      >
        Add Resource
      </button>
    </div>
  ),
}));

jest.mock("@/components/forms/hooks-manager", () => ({
  HooksManager: ({ value, onChange }: any) => (
    <div data-testid="hooks-manager">
      <div data-testid="hooks">
        {Object.entries(value || {}).map(
          ([hookType, hookConfig]: [string, any]) => (
            <div key={hookType} data-testid={`hook-${hookType}`}>
              <span>
                {hookType === "agentSpawn"
                  ? "Agent Spawn"
                  : hookType === "userPromptSubmit"
                    ? "User Prompt Submit"
                    : hookType}
              </span>
              <span>: {hookConfig.command}</span>
            </div>
          ),
        )}
      </div>
      <div data-testid="add-hook-section">
        <span>Add Lifecycle Hook</span>
        <span>Select hook type</span>
        <button
          onClick={() =>
            onChange({
              ...value,
              agentSpawn: { command: "test command" },
            })
          }
          data-testid="add-hook"
        >
          Add Hook
        </button>
      </div>
    </div>
  ),
}));

// Mock the server actions
jest.mock("@/lib/actions/submit-agent-action", () => ({
  onSubmitAction: jest.fn(),
}));

jest.mock("@/lib/actions/delete-agent-action", () => ({
  deleteAgent: jest.fn(),
}));

// Mock next/navigation
jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

// Mock sonner toast
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock React hooks
const mockFormAction = jest.fn();
jest.mock("react", () => {
  const originalReact = jest.requireActual("react");
  return {
    ...originalReact,
    useActionState: () => [
      { message: "", success: true, errors: {} },
      mockFormAction,
      false, // isPending
    ],
    useEffect: jest.fn((fn) => fn()),
  };
});

const mockTags: Tag[] = [
  { name: "frontend", description: "Frontend development", category: "SDLC" },
  { name: "backend", description: "Backend development", category: "SDLC" },
  { name: "testing", description: "Testing and QA", category: "SDLC" },
];

const mockAgent: Agent = {
  id: "test-agent-id",
  name: "Test Agent",
  description: "A test agent for development",
  prompt: "You are a helpful development assistant",
  tools: ["git", "npm"],
  mcpServers: {
    "test-server": {
      command: "node server.js",
      args: ["--port", "3000"],
    },
  },
  resources: ["file://./config.json"],
  hooks: {
    agentSpawn: { command: "echo 'Agent started'" },
  },
  toolsSettings: { git: { defaultBranch: "main" } },
  toolAliases: { g: "git" },
  allowedTools: ["git", "npm", "node"],
  useLegacyMcpJson: false,
  tags: ["frontend", "testing"],
  scope: "PUBLIC",
  sourceURL: "https://example.com/agent",
  author: "Test Author",
  authorId: "test-author-id",
  slug: "test-agent",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  copyCount: 5,
  downloadCount: 10,
};

describe("AgentForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Basic Information Section", () => {
    test("renders basic information form fields", () => {
      render(<AgentForm tags={mockTags} />);

      // Check for Basic Information section
      expect(screen.getByText("Basic Information")).toBeInTheDocument();
      expect(
        screen.getByText(
          "What is this agent doing? What is the goal and purpose of this Amazon Q Developer CLI agent?",
        ),
      ).toBeInTheDocument();

      // Check for form fields
      expect(screen.getByLabelText("Agent Name")).toBeInTheDocument();
      expect(screen.getByLabelText("Description")).toBeInTheDocument();
      expect(screen.getByLabelText("System Prompt")).toBeInTheDocument();
    });

    test("displays proper placeholders for basic information fields", () => {
      render(<AgentForm tags={mockTags} />);

      expect(
        screen.getByPlaceholderText(
          "A clear and descriptive name for your agent",
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(
          "What is this agent doing? What is the goal and purpose?",
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(
          "Define the agent's behavior, personality, and instructions...",
        ),
      ).toBeInTheDocument();
    });

    test("shows helpful descriptions for basic information fields", () => {
      render(<AgentForm tags={mockTags} />);

      expect(
        screen.getByText((content, element) => {
          return content.includes(
            "Choose a name that clearly describes what your agent does",
          );
        }),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "Provide a detailed description of what your agent does and how it helps with development tasks",
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "The system prompt defines how your agent behaves and responds. Be specific about the agent's role, expertise, and communication style.",
        ),
      ).toBeInTheDocument();
    });

    test("allows user to input basic information", () => {
      render(<AgentForm tags={mockTags} />);

      const nameInput = screen.getByLabelText("Agent Name");
      const descriptionInput = screen.getByLabelText("Description");
      const promptInput = screen.getByLabelText("System Prompt");

      fireEvent.change(nameInput, { target: { value: "My Test Agent" } });
      fireEvent.change(descriptionInput, {
        target: { value: "This is a test agent" },
      });
      fireEvent.change(promptInput, {
        target: { value: "You are a test assistant" },
      });

      expect(nameInput).toHaveValue("My Test Agent");
      expect(descriptionInput).toHaveValue("This is a test agent");
      expect(promptInput).toHaveValue("You are a test assistant");
    });
  });

  describe("Tools Configuration Section", () => {
    test("renders tools configuration form fields", () => {
      render(<AgentForm tags={mockTags} />);

      // Check for Tools Configuration section
      expect(screen.getByText("Tools Configuration")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Configure which tools your agent can use and how they are accessed",
        ),
      ).toBeInTheDocument();

      // Check for form fields
      expect(screen.getByText("Available Tools")).toBeInTheDocument();
      expect(screen.getByText("Tool Aliases")).toBeInTheDocument();
      expect(
        screen.getByText("Allowed Tools (Restriction)"),
      ).toBeInTheDocument();
      expect(screen.getByText("Legacy MCP JSON Support")).toBeInTheDocument();
    });

    test("displays proper placeholders for tools fields", () => {
      render(<AgentForm tags={mockTags} />);

      expect(
        screen.getByText("Select tools your agent can use..."),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Optionally restrict to specific tools..."),
      ).toBeInTheDocument();
    });

    test("shows helpful descriptions for tools fields", () => {
      render(<AgentForm tags={mockTags} />);

      expect(
        screen.getByText(
          "Select the tools that your agent is allowed to use. These tools will be available for the agent to call during conversations.",
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText((content, element) => {
          return content.includes(
            "Create shortcuts for tools by defining aliases",
          );
        }),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "Optional: Restrict the agent to only use these specific tools. If empty, all configured tools are allowed.",
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "Enable support for legacy MCP JSON format. Only enable this if you need compatibility with older MCP servers.",
        ),
      ).toBeInTheDocument();
    });

    test("renders tools multi-select components", () => {
      render(<AgentForm tags={mockTags} />);

      const toolsSelects = screen.getAllByTestId("tools-multi-select");
      expect(toolsSelects).toHaveLength(2); // Available Tools and Allowed Tools
    });

    test("renders tool aliases manager", () => {
      render(<AgentForm tags={mockTags} />);

      expect(screen.getByTestId("tool-aliases-manager")).toBeInTheDocument();
    });

    test("renders legacy MCP JSON toggle", () => {
      render(<AgentForm tags={mockTags} />);

      const toggle = screen.getByRole("switch");
      expect(toggle).toBeInTheDocument();
    });

    test("pre-populates tools configuration when agent is provided", () => {
      render(<AgentForm agent={mockAgent} tags={mockTags} />);

      // Check that tools are displayed (there will be multiple instances due to Available Tools and Allowed Tools)
      expect(screen.getAllByTestId("tool-git")).toHaveLength(2);
      expect(screen.getAllByTestId("tool-npm")).toHaveLength(2);

      // Check that aliases are displayed
      expect(screen.getByTestId("alias-g")).toBeInTheDocument();
    });

    test("allows interaction with tools configuration", () => {
      render(<AgentForm tags={mockTags} />);

      const addToolButton = screen.getAllByTestId("add-tool")[0];
      const addAliasButton = screen.getByTestId("add-alias");
      const legacyToggle = screen.getByRole("switch");

      // Test adding a tool
      fireEvent.click(addToolButton);

      // Test adding an alias
      fireEvent.click(addAliasButton);

      // Test toggling legacy MCP support
      fireEvent.click(legacyToggle);

      // These interactions should not throw errors
      expect(addToolButton).toBeInTheDocument();
      expect(addAliasButton).toBeInTheDocument();
      expect(legacyToggle).toBeInTheDocument();
    });
  });

  describe("MCP Servers Configuration Section", () => {
    test("renders MCP servers configuration form fields", () => {
      render(<AgentForm tags={mockTags} />);

      // Check for MCP Servers Configuration section
      expect(screen.getByText("MCP Servers Configuration")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Configure Model Context Protocol (MCP) servers to extend your agent's capabilities with external data sources and tools",
        ),
      ).toBeInTheDocument();

      // Check for MCP Servers field
      expect(screen.getByText("MCP Servers")).toBeInTheDocument();
      expect(
        screen.getByText(
          "MCP servers provide your agent with access to external tools and data sources.",
          { exact: false },
        ),
      ).toBeInTheDocument();
    });

    test("renders empty MCP servers state", () => {
      render(<AgentForm tags={mockTags} />);

      expect(screen.getByText("No MCP servers configured")).toBeInTheDocument();
      expect(
        screen.getByText("Add MCP servers to extend your agent's capabilities"),
      ).toBeInTheDocument();
    });

    test("pre-populates MCP servers when agent is provided", () => {
      const agentWithMcpServers = {
        ...mockAgent,
        mcpServers: {
          filesystem: {
            command: "npx @modelcontextprotocol/server-filesystem",
            args: ["--root", "/tmp"],
            env: { NODE_ENV: "production" },
            timeout: 30,
            disabled: false,
          },
        },
      };

      render(<AgentForm agent={agentWithMcpServers} tags={mockTags} />);

      // Check that MCP server is displayed (the mock component shows server names)
      expect(screen.getByTestId("mcp-servers-manager")).toBeInTheDocument();
      expect(screen.getByTestId("servers")).toBeInTheDocument();
    });

    test("allows interaction with MCP servers configuration", () => {
      render(<AgentForm tags={mockTags} />);

      const serverNameInput = screen.getByPlaceholderText(
        "Server name (e.g., 'filesystem', 'git')",
      );
      const addServerButton = screen.getByText("Add Server");

      // These elements should be present and interactable
      expect(serverNameInput).toBeInTheDocument();
      expect(addServerButton).toBeInTheDocument();

      // Test adding a server name
      fireEvent.change(serverNameInput, { target: { value: "filesystem" } });
      expect(serverNameInput).toHaveValue("filesystem");

      // Test clicking add button
      fireEvent.click(addServerButton);

      // These interactions should not throw errors
      expect(serverNameInput).toBeInTheDocument();
      expect(addServerButton).toBeInTheDocument();
    });
  });

  describe("Resources & Lifecycle Hooks Section", () => {
    test("renders resources and hooks configuration form fields", () => {
      render(<AgentForm tags={mockTags} />);

      // Check for Resources & Lifecycle Hooks section
      expect(
        screen.getByText("Resources & Lifecycle Hooks"),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "Configure file resources your agent can access and lifecycle hooks for custom behavior at specific execution points",
        ),
      ).toBeInTheDocument();

      // Check for form fields
      expect(screen.getByText("File Resources")).toBeInTheDocument();
      expect(screen.getByText("Lifecycle Hooks")).toBeInTheDocument();
    });

    test("renders resources manager component", () => {
      render(<AgentForm tags={mockTags} />);

      // Check that resources manager is rendered
      expect(
        screen.getByPlaceholderText(/Enter file path/),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /Add Resource/ }),
      ).toBeInTheDocument();
    });

    test("renders hooks manager component", () => {
      render(<AgentForm tags={mockTags} />);

      // Check that hooks manager is rendered
      expect(screen.getByText("Add Lifecycle Hook")).toBeInTheDocument();
      expect(screen.getByText("Select hook type")).toBeInTheDocument();
    });

    test("pre-populates resources and hooks when editing existing agent", () => {
      const agentWithResourcesAndHooks = {
        ...mockAgent,
        resources: ["./src/config.json", "/absolute/path/file.txt"],
        hooks: {
          agentSpawn: { command: "npm install" },
          userPromptSubmit: { command: "echo 'Processing prompt'" },
        },
      };

      render(<AgentForm agent={agentWithResourcesAndHooks} tags={mockTags} />);

      // Resources should be pre-populated
      expect(screen.getByText("./src/config.json")).toBeInTheDocument();
      expect(screen.getByText("/absolute/path/file.txt")).toBeInTheDocument();

      // Hooks should be pre-populated
      expect(screen.getByText("Agent Spawn")).toBeInTheDocument();
      expect(screen.getByText("User Prompt Submit")).toBeInTheDocument();
    });
  });

  describe("Metadata & Settings Section", () => {
    test("renders metadata and settings form fields", () => {
      render(<AgentForm tags={mockTags} />);

      // Check for Metadata section
      expect(screen.getByText("Metadata & Settings")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Configure tags, visibility, and additional information for your agent",
        ),
      ).toBeInTheDocument();

      // Check for form fields
      expect(screen.getByText("Tags")).toBeInTheDocument();
      expect(screen.getByLabelText("Source URL")).toBeInTheDocument();
      expect(screen.getByText("Visibility")).toBeInTheDocument();
    });

    test("displays proper placeholders for metadata fields", () => {
      render(<AgentForm tags={mockTags} />);

      expect(
        screen.getByPlaceholderText(
          "Optional: Link to original source or inspiration",
        ),
      ).toBeInTheDocument();
    });

    test("shows helpful descriptions for metadata fields", () => {
      render(<AgentForm tags={mockTags} />);

      expect(
        screen.getByText((content, element) => {
          return content.includes(
            "Add relevant tags to help others discover your agent",
          );
        }),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "If this agent was inspired by or adapted from another source, provide the URL here",
        ),
      ).toBeInTheDocument();
    });

    test("allows user to input metadata information", () => {
      render(<AgentForm tags={mockTags} />);

      const sourceURLInput = screen.getByLabelText("Source URL");

      fireEvent.change(sourceURLInput, {
        target: { value: "https://example.com" },
      });

      expect(sourceURLInput).toHaveValue("https://example.com");
    });

    test("displays visibility options", () => {
      render(<AgentForm tags={mockTags} />);

      const visibilitySelect = screen.getByRole("combobox");
      expect(visibilitySelect).toBeInTheDocument();

      // Check visibility description
      expect(
        screen.getByText(
          "Keep your agent private as a draft or just for you or make it public to share it with the community. A private agent can still be shared via URL but will not be listed on promptz.dev.",
        ),
      ).toBeInTheDocument();
    });
  });

  describe("Form Actions", () => {
    test("renders save button", () => {
      render(<AgentForm tags={mockTags} />);

      const saveButton = screen.getByRole("button", { name: /save agent/i });
      expect(saveButton).toBeInTheDocument();
      expect(saveButton).toHaveAttribute("type", "submit");
    });

    test("does not render delete button for new agent", () => {
      render(<AgentForm tags={mockTags} />);

      const deleteButton = screen.queryByRole("button", {
        name: /delete agent/i,
      });
      expect(deleteButton).not.toBeInTheDocument();
    });

    test("renders delete button for existing agent", () => {
      render(<AgentForm agent={mockAgent} tags={mockTags} />);

      const deleteButton = screen.getByRole("button", {
        name: /delete agent/i,
      });
      expect(deleteButton).toBeInTheDocument();
    });
  });

  describe("Form Pre-population", () => {
    test("pre-populates form fields when agent is provided", () => {
      render(<AgentForm agent={mockAgent} tags={mockTags} />);

      expect(screen.getByDisplayValue("Test Agent")).toBeInTheDocument();
      expect(
        screen.getByDisplayValue("A test agent for development"),
      ).toBeInTheDocument();
      expect(
        screen.getByDisplayValue("You are a helpful development assistant"),
      ).toBeInTheDocument();
      expect(
        screen.getByDisplayValue("https://example.com/agent"),
      ).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    test("has proper form labels and descriptions", () => {
      render(<AgentForm tags={mockTags} />);

      // Check that form fields have proper labels
      expect(screen.getByLabelText("Agent Name")).toBeInTheDocument();
      expect(screen.getByLabelText("Description")).toBeInTheDocument();
      expect(screen.getByLabelText("System Prompt")).toBeInTheDocument();
      expect(screen.getByLabelText("Source URL")).toBeInTheDocument();
    });

    test("has proper button types and attributes", () => {
      render(<AgentForm agent={mockAgent} tags={mockTags} />);

      const saveButton = screen.getByRole("button", { name: /save agent/i });
      const deleteButton = screen.getByRole("button", {
        name: /delete agent/i,
      });

      expect(saveButton).toHaveAttribute("type", "submit");
      expect(deleteButton).toHaveAttribute("type", "button");
    });
  });
});
