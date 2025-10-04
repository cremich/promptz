import fs from "fs";
import path from "path";
import { parseMarkdownFile } from "./parser";
import { extractContentSections, generateSlugFromFilename } from "./processor";
import type { PromptFrontmatter } from "./types";
import type { Prompt } from "@/lib/models/prompt-model";

export interface PromptIndex {
  prompts: Prompt[];
  searchIndex: {
    byTitle: Map<string, Prompt[]>;
    byDescription: Map<string, Prompt[]>;
    byContent: Map<string, Prompt[]>;
    byAuthor: Map<string, Prompt[]>;
    byTags: Map<string, Prompt[]>;
    byCategory: Map<string, Prompt[]>;
  };
  tagIndex: Map<string, Prompt[]>;
  categoryIndex: Map<string, Prompt[]>;
  metadata: {
    totalCount: number;
    lastBuildTime: string;
  };
}

export async function scanMarkdownFiles(contentDir: string): Promise<string[]> {
  const files: string[] = [];

  function scanDirectory(dir: string) {
    const entries = fs.readdirSync(dir);

    for (const entry of entries) {
      const fullPath = path.join(dir, entry);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else if (stat.isFile() && entry.endsWith(".md")) {
        files.push(fullPath);
      }
    }
  }

  scanDirectory(contentDir);
  return files;
}

function generateId(filePath: string): string {
  // Create deterministic ID from file path
  // Remove content/prompts/ prefix and .md suffix, replace slashes with dashes
  const relativePath = filePath
    .replace(/^.*content\/prompts\//, "")
    .replace(/\.md$/, "");
  return relativePath.replace(/\//g, "-");
}

export function convertMarkdownToPrompt(
  frontmatter: PromptFrontmatter,
  content: string,
  howto: string,
  category: string,
  filePath: string,
): Prompt {
  const slug = generateSlugFromFilename(path.basename(filePath));

  return {
    id: generateId(filePath),
    slug,
    name: frontmatter.title,
    description: frontmatter.description,
    tags: [category, ...(frontmatter.tags || [])],
    content,
    howto,
    author: frontmatter.author,
    sourceURL: frontmatter.sourceURL,
    scope: "PUBLIC",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    copyCount: 0,
    downloadCount: 0,
    starCount: 0,
    popularityScore: 0,
  };
}

function getCategoryFromPath(filePath: string, contentDir: string): string {
  const relativePath = path.relative(contentDir, filePath);
  const parts = relativePath.split(path.sep);
  return parts[0] || "general";
}

function buildSearchIndex(prompts: Prompt[]): PromptIndex["searchIndex"] {
  const searchIndex = {
    byTitle: new Map<string, Prompt[]>(),
    byDescription: new Map<string, Prompt[]>(),
    byContent: new Map<string, Prompt[]>(),
    byAuthor: new Map<string, Prompt[]>(),
    byTags: new Map<string, Prompt[]>(),
    byCategory: new Map<string, Prompt[]>(),
  };

  for (const prompt of prompts) {
    // Index by title words
    const titleWords = prompt.name?.toLowerCase().split(/\s+/) || [];
    for (const word of titleWords) {
      if (!searchIndex.byTitle.has(word)) {
        searchIndex.byTitle.set(word, []);
      }
      searchIndex.byTitle.get(word)!.push(prompt);
    }

    // Index by description words
    const descWords = prompt.description?.toLowerCase().split(/\s+/) || [];
    for (const word of descWords) {
      if (!searchIndex.byDescription.has(word)) {
        searchIndex.byDescription.set(word, []);
      }
      searchIndex.byDescription.get(word)!.push(prompt);
    }

    // Index by content words
    const contentWords = prompt.content?.toLowerCase().split(/\s+/) || [];
    for (const word of contentWords) {
      if (!searchIndex.byContent.has(word)) {
        searchIndex.byContent.set(word, []);
      }
      searchIndex.byContent.get(word)!.push(prompt);
    }

    // Index by author
    if (prompt.author) {
      if (!searchIndex.byAuthor.has(prompt.author)) {
        searchIndex.byAuthor.set(prompt.author, []);
      }
      searchIndex.byAuthor.get(prompt.author)!.push(prompt);
    }

    // Index by tags
    for (const tag of prompt.tags || []) {
      if (!searchIndex.byTags.has(tag.toLowerCase())) {
        searchIndex.byTags.set(tag.toLowerCase(), []);
      }
      searchIndex.byTags.get(tag.toLowerCase())!.push(prompt);
    }

    // Index by category (first tag is category)
    const category = prompt.tags?.[0];
    if (category) {
      if (!searchIndex.byCategory.has(category)) {
        searchIndex.byCategory.set(category, []);
      }
      searchIndex.byCategory.get(category)!.push(prompt);
    }
  }

  return searchIndex;
}

function buildTagIndex(prompts: Prompt[]): Map<string, Prompt[]> {
  const tagIndex = new Map<string, Prompt[]>();

  for (const prompt of prompts) {
    for (const tag of prompt.tags || []) {
      if (!tagIndex.has(tag)) {
        tagIndex.set(tag, []);
      }
      tagIndex.get(tag)!.push(prompt);
    }
  }

  return tagIndex;
}

function buildCategoryIndex(prompts: Prompt[]): Map<string, Prompt[]> {
  const categoryIndex = new Map<string, Prompt[]>();

  for (const prompt of prompts) {
    const category = prompt.tags?.[0]; // First tag is category
    if (category) {
      if (!categoryIndex.has(category)) {
        categoryIndex.set(category, []);
      }
      categoryIndex.get(category)!.push(prompt);
    }
  }

  return categoryIndex;
}

export async function buildPromptIndex(
  contentDir: string,
): Promise<PromptIndex> {
  const files = await scanMarkdownFiles(contentDir);
  const prompts: Prompt[] = [];

  for (const filePath of files) {
    try {
      const fileContent = fs.readFileSync(filePath, "utf8");
      const parsed = parseMarkdownFile(fileContent);
      const sections = extractContentSections(parsed.content);
      const category = getCategoryFromPath(filePath, contentDir);

      const prompt = convertMarkdownToPrompt(
        parsed.frontmatter,
        sections.content,
        sections.howto,
        category,
        filePath,
      );

      prompts.push(prompt);
    } catch (error) {
      throw new Error(
        `Error processing ${filePath}: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  const searchIndex = buildSearchIndex(prompts);
  const tagIndex = buildTagIndex(prompts);
  const categoryIndex = buildCategoryIndex(prompts);

  return {
    prompts,
    searchIndex,
    tagIndex,
    categoryIndex,
    metadata: {
      totalCount: prompts.length,
      lastBuildTime: new Date().toISOString(),
    },
  };
}
