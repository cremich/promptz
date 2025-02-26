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

export type Draft = {
  id?: string;
  title?: string;
  description?: string;
  tags?: string[];
  instruction?: string;
  howto?: string;
};

export const promptFormSchema = z.object({
  id: z.string().uuid("id is not a valid uuid"),
  title: z
    .string()
    .max(100, "Title must be less than 100 characters")
    .min(3, "Title must be more than 3 characters"),
  description: z
    .string()
    .min(10, "Description must be more than 10 characters")
    .max(500, "Description must be less than 500 characters"),
  howto: z
    .string()
    .max(4000, "How to must be less than 4000 characters")
    .optional(),
  instruction: z
    .string()
    .min(10, "Prompt must be more than 10 characters")
    .max(4000, "Prompt must be less than 4000 characters"),
  tags: z.array(z.string()),
});
