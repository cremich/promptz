import matter from "gray-matter";
import type { PromptFrontmatter, ParsedMarkdown } from "./types";

export function parseMarkdownFile(markdownContent: string): ParsedMarkdown {
  const parsed = matter(markdownContent);

  const frontmatter = parsed.data as PromptFrontmatter;
  validateFrontmatter(frontmatter);

  return {
    frontmatter,
    content: parsed.content,
    rawContent: markdownContent,
  };
}

export function validateFrontmatter(frontmatter: PromptFrontmatter): void {
  if (!frontmatter.title) {
    throw new Error("title is required");
  }

  if (!frontmatter.description) {
    throw new Error("description is required");
  }

  if (!frontmatter.author) {
    throw new Error("author is required");
  }
}
