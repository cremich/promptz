#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

// Required fields for all content types
const REQUIRED_FIELDS = ["title", "description", "tags"];

// Optional fields
const OPTIONAL_FIELDS = [
  "author",
  "date",
  "lastmod",
  "draft",
  "featured",
  "sourceURL",
  "difficulty",
  "categories",
];

// Agent-specific optional fields
const AGENT_FIELDS = ["tools", "mcpServers", "resources"];

function validateFrontMatter(filePath, content) {
  const errors = [];
  const warnings = [];

  // Extract front matter
  const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontMatterMatch) {
    errors.push("No front matter found");
    return { errors, warnings };
  }

  let frontMatter;
  try {
    frontMatter = yaml.load(frontMatterMatch[1]);
  } catch (e) {
    errors.push(`Invalid YAML in front matter: ${e.message}`);
    return { errors, warnings };
  }

  // Check required fields
  for (const field of REQUIRED_FIELDS) {
    if (!frontMatter[field]) {
      errors.push(`Missing required field: ${field}`);
    } else if (
      field === "tags" &&
      (!Array.isArray(frontMatter[field]) || frontMatter[field].length === 0)
    ) {
      errors.push("Tags must be a non-empty array");
    }
  }

  // Validate field types and constraints
  if (frontMatter.title && typeof frontMatter.title !== "string") {
    errors.push("Title must be a string");
  }

  if (frontMatter.description) {
    if (typeof frontMatter.description !== "string") {
      errors.push("Description must be a string");
    } else if (frontMatter.description.length > 200) {
      warnings.push("Description is longer than 200 characters");
    }
  }

  if (frontMatter.author && typeof frontMatter.author !== "string") {
    errors.push("Author must be a string");
  }

  if (
    frontMatter.tags &&
    Array.isArray(frontMatter.tags) &&
    frontMatter.tags.length > 10
  ) {
    warnings.push("More than 10 tags specified");
  }

  // Tag naming validation
  if (frontMatter.tags && Array.isArray(frontMatter.tags)) {
    for (const tag of frontMatter.tags) {
      if (typeof tag !== "string") {
        errors.push(`Tag must be a string: ${tag}`);
      } else if (tag.length === 0) {
        errors.push("Empty tag found");
      } else if (tag.length > 50) {
        warnings.push(`Tag too long (>50 chars): ${tag}`);
      }
    }
  }

  if (frontMatter.sourceURL && typeof frontMatter.sourceURL === "string") {
    try {
      new URL(frontMatter.sourceURL);
    } catch (e) {
      errors.push("sourceURL must be a valid URL");
    }
  }

  if (
    frontMatter.difficulty &&
    !["beginner", "intermediate", "advanced"].includes(frontMatter.difficulty)
  ) {
    errors.push("Difficulty must be one of: beginner, intermediate, advanced");
  }

  return { errors, warnings };
}

function getAllMarkdownFiles(dir) {
  const files = [];

  function scanDir(currentDir) {
    const items = fs.readdirSync(currentDir);

    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        scanDir(fullPath);
      } else if (item.endsWith(".md") && !item.startsWith("_index.md")) {
        files.push(fullPath);
      }
    }
  }

  scanDir(dir);
  return files;
}

function main() {
  const contentDir = path.join(__dirname, "..", "content");

  // Check if a specific file was provided as argument
  const targetFile = process.argv[2];
  let files;

  if (targetFile) {
    // Validate single file
    const fullPath = path.resolve(targetFile);
    if (!fs.existsSync(fullPath)) {
      console.error(`❌ File not found: ${targetFile}`);
      process.exit(1);
    }
    files = [fullPath];
  } else {
    // Validate all files
    files = getAllMarkdownFiles(contentDir);
  }

  let totalErrors = 0;
  let totalWarnings = 0;
  let validFiles = 0;

  console.log(`Validating ${files.length} content files...\n`);

  for (const file of files) {
    const relativePath = path.relative(contentDir, file);
    const content = fs.readFileSync(file, "utf8");
    const { errors, warnings } = validateFrontMatter(file, content);

    if (errors.length === 0 && warnings.length === 0) {
      validFiles++;
      console.log(`✅ ${relativePath}`);
    } else {
      if (errors.length > 0) {
        console.log(`❌ ${relativePath}`);
        errors.forEach((error) => console.log(`   Error: ${error}`));
        totalErrors += errors.length;
      }

      if (warnings.length > 0) {
        console.log(`⚠️  ${relativePath}`);
        warnings.forEach((warning) => console.log(`   Warning: ${warning}`));
        totalWarnings += warnings.length;
      }
    }
  }

  console.log(`\n📊 Validation Summary:`);
  console.log(`   Total files: ${files.length}`);
  console.log(`   Valid files: ${validFiles}`);
  console.log(`   Files with errors: ${files.length - validFiles}`);
  console.log(`   Total errors: ${totalErrors}`);
  console.log(`   Total warnings: ${totalWarnings}`);

  if (totalErrors > 0) {
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { validateFrontMatter, getAllMarkdownFiles };
