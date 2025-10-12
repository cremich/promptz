import { z } from "zod";
import matter from "gray-matter";

// Zod schema for frontmatter validation
export const PromptFrontmatterSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be 100 characters or less"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be 500 characters or less"),
  author: z
    .string()
    .min(1, "Author is required")
    .max(50, "Author must be 50 characters or less"),
  tags: z
    .array(z.string().min(1).max(30))
    .max(10, "Maximum 10 tags allowed")
    .optional(),
  sourceURL: z.string().url("Invalid URL format").optional(),
});

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ContentSections {
  content: string;
  howto: string;
}

// Security validation functions
export function hasBase64Content(content: string): boolean {
  // Check for base64 patterns (data URLs or long base64 strings)
  const base64DataUrlPattern = /data:[^;]+;base64,/i;
  const longBase64Pattern = /[A-Za-z0-9+/]{50,}={0,2}/; // 50+ chars to avoid false positives
  return base64DataUrlPattern.test(content) || longBase64Pattern.test(content);
}

export function hasImageDataUrls(content: string): boolean {
  const imageDataUrlPattern = /data:image\/[^;]+;base64,/i;
  return imageDataUrlPattern.test(content);
}

export function hasScriptTags(content: string): boolean {
  const scriptPattern = /<script[\s\S]*?>[\s\S]*?<\/script>/gi;
  return scriptPattern.test(content);
}

export function hasSuspiciousUnicode(content: string): boolean {
  // Check for suspicious Unicode characters (zero-width, control characters)
  // Exclude common whitespace characters like \n (0x0A), \r (0x0D), \t (0x09)
  const suspiciousPattern =
    /[\u200B-\u200D\u2060\uFEFF\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/;
  return suspiciousPattern.test(content);
}

export function validateSecurity(content: string): string[] {
  const issues: string[] = [];

  if (hasBase64Content(content)) {
    issues.push("Contains suspicious base64 encoded content");
  }

  if (hasImageDataUrls(content)) {
    issues.push("Contains image data URLs which are not allowed");
  }

  if (hasScriptTags(content)) {
    issues.push("Contains script tags which are not allowed");
  }

  if (hasSuspiciousUnicode(content)) {
    issues.push("Contains suspicious Unicode characters");
  }

  return issues;
}

// File naming validation
export function validateFileName(fileName: string): boolean {
  const validPattern = /^[a-z0-9-]+\.md$/;
  return validPattern.test(fileName);
}

// Content validation
export function validateContent(content: string, howto: string): string[] {
  const issues: string[] = [];

  if (!content || content.trim().length < 10) {
    issues.push("Main prompt content must be at least 10 characters");
  }

  if (content && content.length > 4000) {
    issues.push("Main prompt content must be 4000 characters or less");
  }

  if (!howto || howto.trim().length === 0) {
    issues.push("'How to Use' section is required and cannot be empty");
  }

  return issues;
}

// Extract content sections from markdown
export function extractContentSections(content: string): ContentSections {
  const lines = content.split("\n");
  const mainContent: string[] = [];
  const howtoContent: string[] = [];
  let inHowtoSection = false;

  for (const line of lines) {
    if (line.toLowerCase().includes("## how to use")) {
      inHowtoSection = true;
      continue;
    }

    if (inHowtoSection) {
      howtoContent.push(line);
    } else {
      mainContent.push(line);
    }
  }

  return {
    content: mainContent.join("\n").trim(),
    howto: howtoContent.join("\n").trim(),
  };
}

// Validate frontmatter against schema
export function validateFrontmatter(
  frontmatter: Record<string, unknown>,
): string[] {
  const errors: string[] = [];

  const result = PromptFrontmatterSchema.safeParse(frontmatter);
  if (!result.success) {
    result.error.issues.forEach((issue) => {
      const field = issue.path.join(".");
      errors.push(`Frontmatter ${field}: ${issue.message}`);
    });
  }

  return errors;
}

// Main validation function for markdown content
export function validateMarkdownContent(
  fileContent: string,
  fileName: string,
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    // Validate file naming
    if (!validateFileName(fileName)) {
      errors.push("File name must follow pattern: lowercase-with-hyphens.md");
    }

    // Parse frontmatter and content
    const parsed = matter(fileContent);

    // Validate frontmatter schema
    const frontmatterErrors = validateFrontmatter(parsed.data);
    errors.push(...frontmatterErrors);

    // Extract content sections
    const { content, howto } = extractContentSections(parsed.content);

    // Validate content structure
    const contentIssues = validateContent(content, howto);
    errors.push(...contentIssues);

    // Security validation
    const securityIssues = validateSecurity(fileContent);
    errors.push(...securityIssues);

    // Additional checks
    if (
      parsed.data.sourceURL &&
      !parsed.data.sourceURL.startsWith("https://")
    ) {
      warnings.push("Source URL should use HTTPS for security");
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  } catch (error) {
    return {
      valid: false,
      errors: [
        `Failed to parse markdown file: ${error instanceof Error ? error.message : "Unknown error"}`,
      ],
      warnings: [],
    };
  }
}
