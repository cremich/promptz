import {
  sourceURLSchema,
  titleSchema,
  descriptionSchema,
  tagSchema,
  publicSchema,
  idSchema,
  scopeSchema,
} from "@/lib/forms/schema-definitions";
import { z } from "zod";

export type ProjectRule = {
  id?: string;
  name?: string;
  description?: string;
  tags?: string[];
  content?: string;
  author?: string;
  authorId?: string;
  scope?: string;
  slug?: string;
  sourceURL?: string;
  createdAt?: string;
  updatedAt?: string;
  copyCount?: number;
  downloadCount?: number;
};
export const projectRuleFormSchema = z.object({
  id: idSchema,
  sourceURL: sourceURLSchema,
  name: titleSchema,
  description: descriptionSchema,
  content: z
    .string()
    .trim()
    .min(10, "Content must be more than 10 characters")
    .max(30000, "Content must be less than 30000 characters"),
  tags: tagSchema,
  scope: scopeSchema,
}); // Validation schema for project rule search and filter params

export const projectRuleSearchParamsSchema = z.object({
  query: z.string().optional(),
  sort: z.string().optional(),
  tags: z.union([z.string(), z.array(z.string())]).optional(),
});
