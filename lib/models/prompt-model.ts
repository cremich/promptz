import { z } from "zod";

export type Prompt = {
  id?: string;
  name?: string;
  description?: string;
  tags?: string[];
  content?: string;
  howto?: string;
  author?: string;
  slug?: string;
  sourceURL?: string;
  createdAt?: string;
  updatedAt?: string;
};

//TODO: refactor to use a single schema for both project rules and prompts
export const promptSearchParamsSchema = z.object({
  query: z.string().optional(),
  sort: z.string().optional(),
  tags: z.union([z.string(), z.array(z.string())]).optional(),
});
