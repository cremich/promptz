import { describe, expect, test, jest } from "@jest/globals";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ToolsMultiSelect } from "@/components/forms/tools-multi-select";
import { McpServerConfig } from "@/lib/models/agent-model";

describe("ToolsMultiSelect", () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  test("renders with placeholder when no tools selected", () => {
    render(
      <ToolsMultiSelect
        value={[]}
        onChange={mockOnChange}
        placeholder="Select tools..."
      />,
    );

    expect(screen.getByText("Select tools...")).toBeInTheDocument();
  });

  test("displays selected tools as badges", () => {
    render(
      <ToolsMultiSelect
        value={["fs_read", "fs_write"]}
        onChange={mockOnChange}
      />,
    );

    expect(screen.getByText("fs_read")).toBeInTheDocument();
    expect(screen.getByText("fs_write")).toBeInTheDocument();
  });

  test("applies custom className", () => {
    render(
      <ToolsMultiSelect
        value={[]}
        onChange={mockOnChange}
        className="custom-class"
      />,
    );

    const container = screen.getByRole("combobox").closest(".custom-class");
    expect(container).toBeInTheDocument();
  });

  describe("MCP Server Tools Integration", () => {
    const mockMcpServers: Record<string, McpServerConfig> = {
      git: {
        command: "npx @modelcontextprotocol/server-git",
        args: [],
        disabled: false,
      },
      filesystem: {
        command: "npx @modelcontextprotocol/server-filesystem",
        args: ["/path/to/files"],
        disabled: false,
      },
      disabled_server: {
        command: "npx @modelcontextprotocol/server-disabled",
        args: [],
        disabled: true,
      },
    };

    test("includes MCP server tools when mcpServers prop is provided", async () => {
      render(
        <ToolsMultiSelect
          value={[]}
          onChange={mockOnChange}
          mcpServers={mockMcpServers}
        />,
      );

      // Open the dropdown
      const combobox = screen.getByRole("combobox");
      fireEvent.click(combobox);

      // Wait for dropdown to open and check for MCP server tools
      await waitFor(() => {
        expect(screen.getByText("MCP Server Tools")).toBeInTheDocument();
      });

      // Check for server-level tools (@server_name)
      expect(screen.getByText("@git")).toBeInTheDocument();
      expect(screen.getByText("@filesystem")).toBeInTheDocument();
    });

    test("excludes disabled MCP servers from available tools", async () => {
      render(
        <ToolsMultiSelect
          value={[]}
          onChange={mockOnChange}
          mcpServers={mockMcpServers}
        />,
      );

      // Open the dropdown
      const combobox = screen.getByRole("combobox");
      fireEvent.click(combobox);

      await waitFor(() => {
        expect(screen.getByText("MCP Server Tools")).toBeInTheDocument();
      });

      // Disabled server should not appear
      expect(screen.queryByText("@disabled_server")).not.toBeInTheDocument();
    });

    test("includes wildcard and builtin tools in MCP server category", async () => {
      render(
        <ToolsMultiSelect
          value={[]}
          onChange={mockOnChange}
          mcpServers={mockMcpServers}
        />,
      );

      // Open the dropdown
      const combobox = screen.getByRole("combobox");
      fireEvent.click(combobox);

      await waitFor(() => {
        expect(screen.getByText("MCP Server Tools")).toBeInTheDocument();
      });

      // Check for special tools
      expect(screen.getByText("*")).toBeInTheDocument();
      expect(screen.getByText("@builtin")).toBeInTheDocument();
    });

    test("allows selection of MCP server tools", async () => {
      render(
        <ToolsMultiSelect
          value={[]}
          onChange={mockOnChange}
          mcpServers={mockMcpServers}
        />,
      );

      // Open the dropdown
      const combobox = screen.getByRole("combobox");
      fireEvent.click(combobox);

      await waitFor(() => {
        expect(screen.getByText("@git")).toBeInTheDocument();
      });

      // Select an MCP server tool
      fireEvent.click(screen.getByText("@git"));

      expect(mockOnChange).toHaveBeenCalledWith(["@git"]);
    });

    test("displays selected MCP server tools as badges", () => {
      render(
        <ToolsMultiSelect
          value={["@git", "@filesystem", "*"]}
          onChange={mockOnChange}
          mcpServers={mockMcpServers}
        />,
      );

      expect(screen.getByText("@git")).toBeInTheDocument();
      expect(screen.getByText("@filesystem")).toBeInTheDocument();
      expect(screen.getByText("*")).toBeInTheDocument();
    });

    test("filters MCP server tools based on search input", async () => {
      render(
        <ToolsMultiSelect
          value={[]}
          onChange={mockOnChange}
          mcpServers={mockMcpServers}
        />,
      );

      // Open the dropdown
      const combobox = screen.getByRole("combobox");
      fireEvent.click(combobox);

      await waitFor(() => {
        expect(screen.getByText("@git")).toBeInTheDocument();
      });

      // Search for "git"
      const searchInput = screen.getByPlaceholderText("Search tools...");
      fireEvent.change(searchInput, { target: { value: "git" } });

      await waitFor(() => {
        expect(screen.getByText("@git")).toBeInTheDocument();
        expect(screen.queryByText("@filesystem")).not.toBeInTheDocument();
      });
    });

    test("works without mcpServers prop (backward compatibility)", () => {
      render(<ToolsMultiSelect value={["fs_read"]} onChange={mockOnChange} />);

      expect(screen.getByText("fs_read")).toBeInTheDocument();
    });
  });
});
