#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const contentDir = path.join(__dirname, "../content");

function validateTaxonomies() {
  const errors = [];

  // Define expected categories based on folder structure
  const expectedCategories = {
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
  };

  function processDirectory(dir, relativePath = "") {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const itemRelativePath = path.join(relativePath, item);

      if (fs.statSync(fullPath).isDirectory()) {
        processDirectory(fullPath, itemRelativePath);
      } else if (item.endsWith(".md") && item !== "_index.md") {
        validateFile(fullPath, itemRelativePath);
      }
    }
  }

  function validateFile(filePath, relativePath) {
    const content = fs.readFileSync(filePath, "utf8");
    const { data: frontMatter } = matter(content);

    // Determine expected category from path
    const pathParts = relativePath.split(path.sep);
    if (pathParts.length >= 2) {
      const categoryKey = `${pathParts[0]}/${pathParts[1]}`;
      const expectedCategory = expectedCategories[categoryKey];

      if (expectedCategory) {
        // Check if categories field exists and includes expected category
        if (
          !frontMatter.categories ||
          !frontMatter.categories.includes(expectedCategory)
        ) {
          errors.push({
            file: relativePath,
            error: `Missing category "${expectedCategory}"`,
            current: frontMatter.categories || [],
          });
        }
      }
    }

    // Validate required fields
    if (!frontMatter.title) {
      errors.push({
        file: relativePath,
        error: "Missing required field: title",
      });
    }
    if (!frontMatter.description) {
      errors.push({
        file: relativePath,
        error: "Missing required field: description",
      });
    }
    if (!frontMatter.author) {
      errors.push({
        file: relativePath,
        error: "Missing required field: author",
      });
    }
  }

  processDirectory(contentDir);

  if (errors.length > 0) {
    console.error("Taxonomy validation errors:");
    errors.forEach((error) => {
      console.error(`  ${error.file}: ${error.error}`);
    });
    process.exit(1);
  } else {
    console.log("✅ All taxonomies are valid");
  }
}

validateTaxonomies();
