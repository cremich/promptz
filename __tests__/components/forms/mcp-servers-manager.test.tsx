import { describe, expect, test, jest } from "@jest/globals";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { McpServersManager } from "@/components/forms/mcp-servers-manager";
import { McpServerConfig } from "@/lib/models/agent-model";

// Mock the UI components
jest.mock("@/components/ui/collapsible", () => ({
  Collapsible: ({ children, open, onOpenChange }: any) => (
    <div data-testid="collapsible" data-open={open} onClick={onOpenChange}>
      {children}
    </div>
  ),
  CollapsibleTrigger: ({ children, asChild }: any) => (
    <div data-testid="collapsible-trigger">{children}</div>
  ),
  CollapsibleContent: ({ children }: any) => (
    <div data-testid="collapsible-content">{children}</div>
  ),
}));

describe("McpServersManager", () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  test("renders empty state when no servers configured", () => {
    render(<McpServersManager value={{}} onChange={mockOnChange} />);

    expect(screen.getByText("No MCP servers configured")).toBeInTheDocument();
    expect(
      screen.getByText("Add MCP servers to extend your agent's capabilities"),
    ).toBeInTheDocument();
  });

  test("renders add server input and button", () => {
    render(<McpServersManager value={{}} onChange={mockOnChange} />);

    expect(
      screen.getByPlaceholderText("Server name (e.g., 'filesystem', 'git')"),
    ).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  test("adds new server when add button is clicked", () => {
    render(<McpServersManager value={{}} onChange={mockOnChange} />);

    const input = screen.getByPlaceholderText(
      "Server name (e.g., 'filesystem', 'git')",
    );
    const addButton = screen.getByRole("button");

    fireEvent.change(input, { target: { value: "filesystem" } });
    fireEvent.click(addButton);

    expect(mockOnChange).toHaveBeenCalledWith({
      filesystem: {
        command: "",
        args: [],
        env: {},
        timeout: undefined,
        disabled: false,
      },
    });
  });

  test("adds new server when Enter key is pressed", () => {
    render(<McpServersManager value={{}} onChange={mockOnChange} />);

    const input = screen.getByPlaceholderText(
      "Server name (e.g., 'filesystem', 'git')",
    );

    fireEvent.change(input, { target: { value: "filesystem" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    expect(mockOnChange).toHaveBeenCalledWith({
      filesystem: {
        command: "",
        args: [],
        env: {},
        timeout: undefined,
        disabled: false,
      },
    });
  });

  test("does not add server with empty name", () => {
    render(<McpServersManager value={{}} onChange={mockOnChange} />);

    const addButton = screen.getByRole("button");
    fireEvent.click(addButton);

    expect(mockOnChange).not.toHaveBeenCalled();
  });

  test("does not add server with duplicate name", () => {
    const existingServers = {
      filesystem: {
        command: "npx @modelcontextprotocol/server-filesystem",
        args: [],
        env: {},
        timeout: undefined,
        disabled: false,
      },
    };

    render(
      <McpServersManager value={existingServers} onChange={mockOnChange} />,
    );

    const input = screen.getByPlaceholderText(
      "Server name (e.g., 'filesystem', 'git')",
    );
    const addButton = screen
      .getAllByRole("button")
      .find((button) => button.className.includes("border-green-600"));

    fireEvent.change(input, { target: { value: "filesystem" } });
    if (addButton) {
      fireEvent.click(addButton);
    }

    expect(mockOnChange).not.toHaveBeenCalled();
  });

  test("renders existing servers", () => {
    const servers: Record<string, McpServerConfig> = {
      filesystem: {
        command: "npx @modelcontextprotocol/server-filesystem",
        args: ["--root", "/tmp"],
        env: { NODE_ENV: "production" },
        timeout: 30,
        disabled: false,
      },
      git: {
        command: "npx @modelcontextprotocol/server-git",
        args: [],
        env: {},
        timeout: undefined,
        disabled: true,
      },
    };

    render(<McpServersManager value={servers} onChange={mockOnChange} />);

    expect(screen.getByText("filesystem")).toBeInTheDocument();
    expect(screen.getByText("git")).toBeInTheDocument();
    expect(
      screen.getByText("Command: npx @modelcontextprotocol/server-filesystem"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Command: npx @modelcontextprotocol/server-git"),
    ).toBeInTheDocument();
  });

  test("shows disabled badge for disabled servers", () => {
    const servers: Record<string, McpServerConfig> = {
      git: {
        command: "npx @modelcontextprotocol/server-git",
        args: [],
        env: {},
        timeout: undefined,
        disabled: true,
      },
    };

    render(<McpServersManager value={servers} onChange={mockOnChange} />);

    expect(screen.getByText("Disabled")).toBeInTheDocument();
  });

  test("removes server when delete button is clicked", () => {
    const servers: Record<string, McpServerConfig> = {
      filesystem: {
        command: "npx @modelcontextprotocol/server-filesystem",
        args: [],
        env: {},
        timeout: undefined,
        disabled: false,
      },
    };

    render(<McpServersManager value={servers} onChange={mockOnChange} />);

    const deleteButton = screen
      .getAllByRole("button")
      .find((button) => button.className.includes("border-red-600"));

    if (deleteButton) {
      fireEvent.click(deleteButton);
    }

    expect(mockOnChange).toHaveBeenCalledWith({});
  });

  test("clears input after adding server", () => {
    render(<McpServersManager value={{}} onChange={mockOnChange} />);

    const input = screen.getByPlaceholderText(
      "Server name (e.g., 'filesystem', 'git')",
    ) as HTMLInputElement;
    const addButton = screen.getByRole("button");

    fireEvent.change(input, { target: { value: "filesystem" } });
    fireEvent.click(addButton);

    expect(input.value).toBe("");
  });

  test("disables add button when input is empty", () => {
    render(<McpServersManager value={{}} onChange={mockOnChange} />);

    const addButton = screen.getByRole("button");
    expect(addButton).toBeDisabled();
  });

  test("disables add button when server name already exists", () => {
    const existingServers = {
      filesystem: {
        command: "test-command",
        args: [],
        env: {},
        timeout: undefined,
        disabled: false,
      },
    };

    render(
      <McpServersManager value={existingServers} onChange={mockOnChange} />,
    );

    const input = screen.getByPlaceholderText(
      "Server name (e.g., 'filesystem', 'git')",
    );
    const addButton = screen
      .getAllByRole("button")
      .find((button) => button.className.includes("border-green-600"));

    fireEvent.change(input, { target: { value: "filesystem" } });

    expect(addButton).toBeDisabled();
  });

  test("applies custom className", () => {
    const { container } = render(
      <McpServersManager
        value={{}}
        onChange={mockOnChange}
        className="custom-class"
      />,
    );

    expect(container.firstChild).toHaveClass("custom-class");
  });
});
