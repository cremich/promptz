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

export const projectRuleSearchParamsSchema = z.object({
  query: z.string().optional(),
  sort: z.string().optional(),
  tags: z.union([z.string(), z.array(z.string())]).optional(),
});
