import { z } from "zod";

export type Agent = {
  id?: string;
  name?: string;
  description?: string;
  tags?: string[];
  prompt?: string;
  tools?: string[];
  mcpServers?: Record<string, McpServerConfig>;
  resources?: string[];
  hooks?: Record<string, HookCommand>;
  toolsSettings?: Record<string, unknown>;
  toolAliases?: Record<string, string>;
  allowedTools?: string[];
  useLegacyMcpJson?: boolean;
  author?: string;
  slug?: string;
  sourceURL?: string;
  createdAt?: string;
  updatedAt?: string;
};

export interface McpServerConfig {
  command: string;
  args?: string[];
  env?: Record<string, string>;
  timeout?: number;
  disabled?: boolean;
}

export interface HookCommand {
  command: string;
}

// Validation schema for search and filter params
export const agentSearchParamsSchema = z.object({
  query: z.string().optional(),
  sort: z.string().optional(),
  tags: z.union([z.string(), z.array(z.string())]).optional(),
});
