import {
  idSchema,
  sourceURLSchema,
  titleSchema,
  descriptionSchema,
  tagSchema,
  publicSchema,
} from "@/lib/forms/schema-definitions";
import { z } from "zod";

export type Prompt = {
  id?: string;
  title?: string;
  description?: string;
  tags?: string[];
  instruction?: string;
  howto?: string;
  author?: string;
  authorId?: string;
  public?: boolean;
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
  title: titleSchema,
  description: descriptionSchema,
  howto: z
    .string()
    .trim()
    .max(4000, "How to must be less than 4000 characters")
    .optional(),
  instruction: z
    .string()
    .trim()
    .min(10, "Prompt must be more than 10 characters")
    .max(4000, "Prompt must be less than 4000 characters"),
  tags: tagSchema,
  public: publicSchema,
}); // Validation schema for search and filter params

export const promptSearchParamsSchema = z.object({
  query: z.string().optional(),
  sort: z.string().optional(),
  tags: z.union([z.string(), z.array(z.string())]).optional(),
});
