import {
  idSchema,
  descriptionSchema,
  nameSchema,
  optionalURLSchema,
} from "@/lib/forms/schema-definitions";
import { z } from "zod";

export type Model = {
  id?: string;
  name?: string;
  description?: string;
  documentationURL?: string;
  author?: string;
  authorId?: string;
  provider?: string;
  providerId?: string;
  slug?: string;
  createdAt?: string;
  updatedAt?: string;
};
export const modelFormSchema = z.object({
  id: idSchema,
  name: nameSchema,
  description: descriptionSchema,
  documentationURL: optionalURLSchema,
  providerId: idSchema,
}); // Validation schema for search and filter params

export const modelSearchParamsSchema = z.object({
  query: z.string().optional(),
  sort: z.string().optional(),
});
