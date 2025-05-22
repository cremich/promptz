import { z } from "zod";

export enum ModelType {
  PROMPT = "Prompt",
  RULE = "Rule",
}

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

export const idSchema = z
  .string()
  .uuid()
  .optional()
  .nullable()
  .or(z.literal(""));

export const sourceURLSchema = z
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
  .or(z.literal(""));

export const titleSchema = z
  .string()
  .trim()
  .max(100, "Title must be less than 100 characters")
  .min(3, "Title must be more than 3 characters");

export const descriptionSchema = z
  .string()
  .trim()
  .min(10, "Description must be more than 10 characters")
  .max(500, "Description must be less than 500 characters");

export const tagSchema = z.array(z.string()).optional();
export const publicSchema = z.boolean();
