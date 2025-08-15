import {
  idSchema,
  sourceURLSchema,
  titleSchema,
  descriptionSchema,
  tagSchema,
  scopeSchema,
} from "@/lib/forms/schema-definitions";
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
  toolsSettings?: Record<string, any>;
  toolAliases?: Record<string, string>;
  allowedTools?: string[];
  useLegacyMcpJson?: boolean;
  author?: string;
  authorId?: string;
  scope?: string;
  slug?: string;
  sourceURL?: string;
  createdAt?: string;
  updatedAt?: string;
  copyCount?: number;
  downloadCount?: number;
  popularityScore?: number;
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

// MCP Server configuration schema
const mcpServerConfigSchema = z.object({
  command: z.string().min(1, "Command is required"),
  args: z.array(z.string()).optional(),
  env: z.record(z.string(), z.string()).optional(),
  timeout: z.number().positive("Timeout must be a positive number").optional(),
  disabled: z.boolean().optional(),
});

// Hook command schema
const hookCommandSchema = z.object({
  command: z.string().min(1, "Command is required"),
});

// Valid hook types
const validHookTypes = ["agentSpawn", "userPromptSubmit"] as const;

// Hooks schema with validation for known hook types
const hooksSchema = z
  .record(z.string(), hookCommandSchema)
  .optional()
  .refine(
    (hooks) => {
      if (!hooks) return true;
      return Object.keys(hooks).every((key) =>
        validHookTypes.includes(key as any),
      );
    },
    {
      message: `Invalid hook type. Valid types are: ${validHookTypes.join(", ")}`,
    },
  );

// Tool aliases schema - mapping of alias names to tool names
const toolAliasesSchema = z
  .record(z.string(), z.string().min(1, "Tool alias must be a string"))
  .optional();

// Resource validation schema
const resourceSchema = z.string().refine(
  (resource) => {
    // Allow file paths (absolute, relative, or home directory)
    if (
      resource.startsWith("/") ||
      resource.startsWith("./") ||
      resource.startsWith("../") ||
      resource.startsWith("~/")
    ) {
      return true;
    }

    // Allow promptz.dev URLs
    try {
      const url = new URL(resource);
      return url.hostname === "promptz.dev" && url.protocol === "https:";
    } catch {
      return false;
    }
  },
  {
    message:
      "Invalid resource. Must be a file path or a promptz.dev URL (https://promptz.dev/...)",
  },
);

export const agentFormSchema = z.object({
  id: idSchema,
  sourceURL: sourceURLSchema,
  name: titleSchema,
  description: descriptionSchema,
  howto: z
    .string()
    .trim()
    .max(4000, "How to must be less than 4000 characters")
    .optional(),
  prompt: z
    .string()
    .trim()
    .min(10, "System prompt must be more than 10 characters")
    .max(4000, "System prompt must be less than 4000 characters"),
  tools: z.array(z.string()).min(1, "At least one tool must be selected"),
  mcpServers: z.record(z.string(), mcpServerConfigSchema).optional(),
  resources: z.array(resourceSchema).default([]),
  hooks: hooksSchema,
  toolsSettings: z.record(z.string(), z.any()).optional(),
  toolAliases: toolAliasesSchema,
  allowedTools: z.array(z.string()).default([]),
  useLegacyMcpJson: z.boolean().default(false),
  tags: tagSchema,
  scope: scopeSchema,
});

// Validation schema for search and filter params
export const agentSearchParamsSchema = z.object({
  query: z.string().optional(),
  sort: z.string().optional(),
  tags: z.union([z.string(), z.array(z.string())]).optional(),
});
