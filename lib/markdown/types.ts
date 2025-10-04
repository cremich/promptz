export interface PromptFrontmatter {
  title: string; // Required: Display name
  description: string; // Required: Brief description
  author: string; // Required: Content creator
  tags?: string[]; // Optional: Additional tags
  sourceURL?: string; // Optional: Reference link
}

export interface ParsedMarkdown {
  frontmatter: PromptFrontmatter;
  content: string; // Raw markdown content without frontmatter
  rawContent: string; // Complete raw content including frontmatter
}

export interface ProcessedContent {
  content: string; // Main prompt content
  howto: string; // How to use section
}
