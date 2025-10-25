#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const contentDir = path.join(__dirname, "../content");

// Category mapping based on folder structure
const categoryMapping = {
  "prompts/architecture": "architecture",
  "prompts/code-generation": "code-generation",
  "prompts/documentation": "documentation",
  "prompts/testing": "testing",
  "prompts/analysis": "analysis",
  "prompts/aws": "aws",
  "prompts/scaffolding": "scaffolding",
  "prompts/spec-driven-development": "spec-driven-development",
  "prompts/solutions": "solutions",
  "prompts/persona": "persona",
  "prompts/general": "general",
  "rules/cdk": "cdk",
  "rules/typescript": "typescript",
  "rules/nextjs": "nextjs",
  "rules/python": "python",
  "rules/testing": "testing",
  "rules/security": "security",
  "rules/general": "general",
  "rules/amplify": "amplify",
  "rules/mobile": "mobile",
  "rules/vue": "vue",
  "rules/aws": "aws",
  "rules/javascript": "javascript",
  "rules/react": "react",
  "agents/code-review": "code-review",
  "agents/documentation": "documentation",
};

function updateFrontmatter() {
  let updatedCount = 0;

  function processDirectory(dir, relativePath = "") {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const itemRelativePath = path.join(relativePath, item);

      if (fs.statSync(fullPath).isDirectory()) {
        processDirectory(fullPath, itemRelativePath);
      } else if (item.endsWith(".md") && item !== "_index.md") {
        if (updateFile(fullPath, itemRelativePath)) {
          updatedCount++;
        }
      }
    }
  }

  function updateFile(filePath, relativePath) {
    const content = fs.readFileSync(filePath, "utf8");
    const { data: frontMatter, content: markdownContent } = matter(content);

    let updated = false;
    const newFrontMatter = { ...frontMatter };

    // Get category from path
    const pathParts = relativePath.split(path.sep);
    if (pathParts.length >= 2) {
      const categoryKey = `${pathParts[0]}/${pathParts[1]}`;
      const expectedCategory = categoryMapping[categoryKey];

      if (expectedCategory) {
        // Add categories array if missing or incorrect
        if (
          !newFrontMatter.categories ||
          !newFrontMatter.categories.includes(expectedCategory)
        ) {
          newFrontMatter.categories = [expectedCategory];
          updated = true;
        }
      }
    }

    // Ensure draft is set to false
    if (newFrontMatter.draft !== false) {
      newFrontMatter.draft = false;
      updated = true;
    }

    // Add weight for ordering (based on filename)
    if (!newFrontMatter.weight) {
      // Use filename hash for consistent ordering
      const filename = path.basename(filePath, ".md");
      newFrontMatter.weight = filename.length * 10; // Simple weight based on filename length
      updated = true;
    }

    // Clean up tags - remove "Unknown" and ensure proper format
    if (newFrontMatter.tags) {
      const cleanTags = newFrontMatter.tags
        .filter((tag) => tag !== "Unknown")
        .map((tag) => tag.trim());

      if (
        cleanTags.length !== newFrontMatter.tags.length ||
        cleanTags.some((tag, i) => tag !== newFrontMatter.tags[i])
      ) {
        newFrontMatter.tags = cleanTags;
        updated = true;
      }
    }

    // Add images array for OpenGraph if missing
    if (!newFrontMatter.images) {
      newFrontMatter.images = [];
      updated = true;
    }

    if (updated) {
      // Reorder frontmatter for consistency
      const orderedFrontMatter = {
        title: newFrontMatter.title,
        description: newFrontMatter.description,
        draft: newFrontMatter.draft,
        images: newFrontMatter.images,
        categories: newFrontMatter.categories,
        tags: newFrontMatter.tags,
        author: newFrontMatter.author,
        ...Object.fromEntries(
          Object.entries(newFrontMatter).filter(
            ([key]) =>
              ![
                "title",
                "description",
                "draft",
                "weight",
                "images",
                "categories",
                "tags",
                "author",
              ].includes(key),
          ),
        ),
      };

      // Remove undefined values
      Object.keys(orderedFrontMatter).forEach((key) => {
        if (orderedFrontMatter[key] === undefined) {
          delete orderedFrontMatter[key];
        }
      });

      const newContent = matter.stringify(markdownContent, orderedFrontMatter);
      fs.writeFileSync(filePath, newContent);

      console.log(`✅ Updated: ${relativePath}`);
      return true;
    }

    return false;
  }

  processDirectory(contentDir);

  console.log(
    `\n🎉 Updated ${updatedCount} files with Hugo-optimized frontmatter`,
  );
}

updateFrontmatter();
