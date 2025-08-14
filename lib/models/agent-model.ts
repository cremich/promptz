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
  mcpServers?: any;
  resources?: string[];
  hooks?: any;
  toolsSettings?: any;
  toolAliases?: any;
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
  mcpServers: z.any().optional(),
  resources: z.array(z.string()).default([]),
  hooks: z.any().optional(),
  toolsSettings: z.any().optional(),
  toolAliases: z.any().optional(),
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
