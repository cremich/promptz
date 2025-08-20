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
} as const;
