import { z } from "zod";

export type User = {
  id: string;
  displayName: string;
  guest: boolean;
};

export type Prompt = {
  id?: string;
  title?: string;
  description?: string;
  tags?: string[];
  instruction?: string;
  howto?: string;
  author?: string;
  authorId?: string;
};

export const promptFormSchema = z.object({
  id: z.string().uuid("id is not a valid uuid"),
  title: z
    .string()
    .max(100, "Title must be less than 100 characters")
    .min(3, "Title must be more than 3 characters"),
});
