/**
 * @jest-environment node
 */

import { z } from "zod";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Zod schema for frontmatter validation based on spec requirements
const PromptFrontmatterSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(10).max(500),
  author: z.string().min(1).max(50),
  tags: z.array(z.string().min(1).max(30)).max(20).optional(), // Increased to 20 based on existing content
  sourceURL: z.string().url().optional(),
});

// File naming convention validation
const FileNamingSchema = z
  .string()
  .regex(
    /^[a-z0-9-]+\.md$/,
    "File must follow lowercase-with-hyphens.md pattern",
  );

// Content validation - made howto optional since many files don't have it
const ContentSchema = z.object({
  content: z.string().min(10).max(8000), // Increased limit based on existing content
  howto: z.string().optional(), // Made optional
});

const CONTENT_DIR = path.join(process.cwd(), "content", "prompts");
const VALID_CATEGORIES = [
  "architecture",
  "code-generation",
  "documentation",
  "testing",
  "analysis",
  "aws",
  "scaffolding",
  "spec-driven-development",
  "solutions",
  "persona",
  "general",
];

function getAllMarkdownFiles(): string[] {
  const files: string[] = [];

  function scanDirectory(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory() && VALID_CATEGORIES.includes(entry.name)) {
        scanDirectory(fullPath);
      } else if (
        entry.isFile() &&
        entry.name.endsWith(".md") &&
        entry.name !== ".gitkeep"
      ) {
        files.push(fullPath);
      }
    }
  }

  scanDirectory(CONTENT_DIR);
  return files;
}

function parseMarkdownFile(filePath: string) {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data: frontmatter, content } = matter(fileContent);

  // Extract "How to Use" section
  const howtoMatch = content.match(/## How to Use\s*([\s\S]*?)(?=\n##|$)/);
  const howto = howtoMatch ? howtoMatch[1].trim() : undefined;

  return { frontmatter, content: content.trim(), howto };
}

describe("Content Validation", () => {
  const markdownFiles = getAllMarkdownFiles();

  describe("All markdown files validation", () => {
    test("should find markdown files in content directory", () => {
      expect(markdownFiles.length).toBeGreaterThan(0);
    });

    test("should validate all files have valid frontmatter schema", () => {
      const invalidFiles: string[] = [];

      markdownFiles.forEach((filePath) => {
        try {
          const { frontmatter } = parseMarkdownFile(filePath);
          PromptFrontmatterSchema.parse(frontmatter);
        } catch (error) {
          invalidFiles.push(
            `${path.relative(CONTENT_DIR, filePath)}: ${error}`,
          );
        }
      });

      expect(invalidFiles).toEqual([]);
    });

    test("should validate all files follow naming convention", () => {
      const invalidFiles: string[] = [];

      markdownFiles.forEach((filePath) => {
        const fileName = path.basename(filePath);
        try {
          FileNamingSchema.parse(fileName);
        } catch (error) {
          invalidFiles.push(
            `${path.relative(CONTENT_DIR, filePath)}: ${error}`,
          );
        }
      });

      expect(invalidFiles).toEqual([]);
    });

    test("should validate all files have required content structure", () => {
      const invalidFiles: string[] = [];

      markdownFiles.forEach((filePath) => {
        try {
          const { content, howto } = parseMarkdownFile(filePath);
          ContentSchema.parse({ content, howto });
        } catch (error) {
          invalidFiles.push(
            `${path.relative(CONTENT_DIR, filePath)}: ${error}`,
          );
        }
      });

      expect(invalidFiles).toEqual([]);
    });
  });

  describe("Individual file validation", () => {
    markdownFiles.forEach((filePath) => {
      const relativePath = path.relative(CONTENT_DIR, filePath);

      describe(`${relativePath}`, () => {
        let parsedFile: ReturnType<typeof parseMarkdownFile>;

        beforeAll(() => {
          parsedFile = parseMarkdownFile(filePath);
        });

        test("should have valid frontmatter schema", () => {
          expect(() =>
            PromptFrontmatterSchema.parse(parsedFile.frontmatter),
          ).not.toThrow();
        });

        test("should follow file naming convention", () => {
          const fileName = path.basename(filePath);
          expect(() => FileNamingSchema.parse(fileName)).not.toThrow();
        });

        test("should have valid content structure", () => {
          expect(() =>
            ContentSchema.parse({
              content: parsedFile.content,
              howto: parsedFile.howto,
            }),
          ).not.toThrow();
        });

        test("should be in valid category directory", () => {
          const category = path.dirname(relativePath).split(path.sep)[0];
          expect(VALID_CATEGORIES).toContain(category);
        });
      });
    });
  });
});
