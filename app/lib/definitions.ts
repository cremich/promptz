import { z } from "zod";

export enum SdlcActivity {
  DEBUG = "Debugging",
  DEPLOY = "Deploy",
  DESIGN = "Design",
  DOCUMENT = "Documentation",
  ENHANCE = "Enhance",
  IMPLEMENT = "Implement",
  OPERATE = "Operate",
  OPTIMIZE = "Optimize",
  PATCH = "Patch Management",
  PLAN = "Plan",
  REFACTOR = "Refactoring",
  REQ = "Requirements",
  SECURITY = "Security",
  SUPPORT = "Support",
  TEST = "Test",
}

export enum PromptCategory {
  CHAT = "Chat",
  DEV_AGENT = "Dev Agent",
  DOC_AGENT = "Doc Agent",
  INLINE = "Inline",
  REVIEW_AGENT = "Review Agent",
  TEST_AGENT = "Test Agent",
  TRANSFORM = "Transform Agent",
  TRANSLATE = "Translate",
}

export enum QInterface {
  IDE = "IDE",
  CLI = "CLI",
  CONSOLE = "Management Console",
}

export type User = {
  id: string;
  username: string;
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
  public?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export const promptFormSchema = z.object({
  id: z.string().uuid().optional(),
  title: z
    .string()
    .trim()
    .max(100, "Title must be less than 100 characters")
    .min(3, "Title must be more than 3 characters"),
  description: z
    .string()
    .trim()
    .min(10, "Description must be more than 10 characters")
    .max(500, "Description must be less than 500 characters"),
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
  tags: z.array(z.string()).optional(),
  public: z.boolean(),
});

// Validation schema for search and filter params
export const searchParamsSchema = z.object({
  query: z.string().optional(),
  sort: z.string().optional(),
  my: z.string().optional(),
});
