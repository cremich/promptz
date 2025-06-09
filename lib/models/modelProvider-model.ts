import {
  idSchema,
  sourceURLSchema,
  titleSchema,
  descriptionSchema,
  tagSchema,
  publicSchema,
  URLSchema,
  nameSchema,
} from "@/lib/forms/schema-definitions";
import { z } from "zod";

export type ModelProvider = {
  id?: string;
  name?: string;
  description?: string;
  website?: string;
  author?: string;
  authorId?: string;
  slug?: string;
  createdAt?: string;
  updatedAt?: string;
};
export const modelProviderFormSchema = z.object({
  id: idSchema,
  name: nameSchema,
  description: descriptionSchema,
  website: URLSchema,
}); // Validation schema for search and filter params

export const modelProviderSearchParamsSchema = z.object({
  query: z.string().optional(),
  sort: z.string().optional(),
});
