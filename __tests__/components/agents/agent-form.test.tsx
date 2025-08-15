import { describe, expect, test, beforeEach } from "@jest/globals";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import AgentForm from "@/components/agents/agent-form";
import { Agent } from "@/lib/models/agent-model";
import { Tag } from "@/lib/models/tags-model";

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
        screen.getByText(
          'Choose a name that clearly describes what your agent does (e.g., "Frontend Developer", "DevOps Assistant")',
        ),
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
        screen.getByText(
          'Add relevant tags to help others discover your agent (e.g., "frontend", "testing", "deployment")',
        ),
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
