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
  slug?: string;
  sourceURL?: string;
  createdAt?: string;
  updatedAt?: string;
};

const ALLOWED_DOMAINS = [
  "github.com",
  "dev.to",
  "hashnode.com",
  "medium.com",
  "stackoverflow.com",
  "community.aws",
  "linkedin.com",
  "aws.amazon.com",
  "docs.aws.amazon.com",
  "amazon.com",
  "amazon.science",
  "huggingface.co",
  "kaggle.com",
  "paperswithcode.com",
  "readthedocs.io",
  "gitbook.io",
];

export const promptFormSchema = z.object({
  id: z.string().uuid().optional(),
  sourceURL: z
    .string()
    .max(2048, "URL must not exceed 2048 characters")
    .url()
    .regex(/^https:\/\/.+/, "Only HTTPS URLs are allowed")
    .refine((url) => {
      try {
        const domain = new URL(url).hostname;
        return ALLOWED_DOMAINS.some(
          (allowed) => domain === allowed || domain.endsWith(`.${allowed}`),
        );
      } catch {
        return false;
      }
    }, "Domain not allowed. Please use a supported content platform.")
    .optional()
    .or(z.literal("")),
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
  interface: z.union([z.string(), z.array(z.string())]).optional(),
  category: z.union([z.string(), z.array(z.string())]).optional(),
  sdlc: z.union([z.string(), z.array(z.string())]).optional(),
});
