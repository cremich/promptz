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

export type AmazonQCliTool = (typeof AMAZON_Q_CLI_TOOLS)[number];

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
