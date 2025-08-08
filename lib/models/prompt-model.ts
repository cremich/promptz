import {
  idSchema,
  sourceURLSchema,
  titleSchema,
  descriptionSchema,
  tagSchema,
  scopeSchema,
} from "@/lib/forms/schema-definitions";
import { z } from "zod";

export type Prompt = {
  id?: string;
  name?: string;
  description?: string;
  tags?: string[];
  content?: string;
  howto?: string;
  author?: string;
  authorId?: string;
  scope?: string;
  slug?: string;
  sourceURL?: string;
  createdAt?: string;
  updatedAt?: string;
  copyCount?: number;
  starCount?: number;
  popularityScore?: number;
};
export const promptFormSchema = z.object({
  id: idSchema,
  sourceURL: sourceURLSchema,
  name: titleSchema,
  description: descriptionSchema,
  howto: z
    .string()
    .trim()
    .max(4000, "How to must be less than 4000 characters")
    .optional(),
  content: z
    .string()
    .trim()
    .min(10, "Prompt must be more than 10 characters")
    .max(4000, "Prompt must be less than 4000 characters"),
  tags: tagSchema,
  scope: scopeSchema,
}); // Validation schema for search and filter params

//TODO: refactor to use a single schema for both project rules and prompts
export const promptSearchParamsSchema = z.object({
  query: z.string().optional(),
  sort: z.string().optional(),
  tags: z.union([z.string(), z.array(z.string())]).optional(),
});
