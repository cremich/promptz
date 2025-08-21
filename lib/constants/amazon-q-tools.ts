// Common Amazon Q CLI tools for autocomplete
export const AMAZON_Q_CLI_TOOLS = [
  // File system operations
  "fs_read",
  "fs_write",
  "execute_bash",
  "knowledge",
  "thinking",
  "use_aws",
] as const;

// MCP Server special tools
export const MCP_SERVER_SPECIAL_TOOLS = [
  "*", // Wildcard to include all available tools
  "@builtin", // Include all built-in tools
] as const;

// Tool categories for better organization
export const TOOL_CATEGORIES = {
  "Built-In Tools": [
    "fs_read",
    "fs_write",
    "execute_bash",
    "knowledge",
    "thinking",
    "use_aws",
  ],
  "MCP Server Tools": [
    ...MCP_SERVER_SPECIAL_TOOLS,
    // Dynamic MCP server tools will be added here based on configuration
  ],
} as const;
