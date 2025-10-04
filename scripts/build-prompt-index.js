const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

function scanMarkdownFiles(contentDir) {
  const files = [];

  function scanDirectory(dir) {
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

function generateId(filePath) {
  // Create deterministic ID from file path
  const relativePath = filePath
    .replace(/^.*content\/prompts\//, "")
    .replace(/\.md$/, "");
  return relativePath.replace(/\//g, "-");
}

function generateSlugFromFilename(filename) {
  return filename.replace(/\.md$/, "");
}

function extractContentSections(content) {
  const lines = content.split("\n");
  let currentSection = "content";
  const sections = { content: [], howto: [] };

  for (const line of lines) {
    if (
      line.toLowerCase().includes("## how to use") ||
      line.toLowerCase().includes("## usage") ||
      line.toLowerCase().includes("## instructions")
    ) {
      currentSection = "howto";
      continue;
    }

    sections[currentSection].push(line);
  }

  return {
    content: sections.content.join("\n").trim(),
    howto: sections.howto.join("\n").trim(),
  };
}

function getCategoryFromPath(filePath, contentDir) {
  const relativePath = path.relative(contentDir, filePath);
  const parts = relativePath.split(path.sep);
  return parts[0] || "general";
}

function convertMarkdownToPrompt(
  frontmatter,
  content,
  howto,
  category,
  filePath,
) {
  const slug = generateSlugFromFilename(path.basename(filePath));

  const stats = fs.statSync(filePath);

  return {
    id: generateId(filePath),
    slug,
    name: frontmatter.title,
    description: frontmatter.description,
    tags: [category, ...(frontmatter.tags || [])],
    content,
    howto,
    author: frontmatter.author,
    sourceURL: frontmatter.sourceURL || "",
    scope: "PUBLIC",
    createdAt: stats.birthtime.toISOString(),
    updatedAt: stats.mtime.toISOString(),
    copyCount: 0,
    downloadCount: 0,
    starCount: 0,
    popularityScore: 0,
  };
}

function buildPromptIndex(contentDir) {
  const files = scanMarkdownFiles(contentDir);
  const prompts = [];

  for (const filePath of files) {
    try {
      const fileContent = fs.readFileSync(filePath, "utf8");
      const parsed = matter(fileContent);
      const sections = extractContentSections(parsed.content);
      const category = getCategoryFromPath(filePath, contentDir);

      const prompt = convertMarkdownToPrompt(
        parsed.data,
        sections.content,
        sections.howto,
        category,
        filePath,
      );

      prompts.push(prompt);
    } catch (error) {
      throw new Error(`Error processing ${filePath}: ${error.message}`);
    }
  }

  return {
    prompts,
    metadata: {
      totalCount: prompts.length,
      lastBuildTime: new Date().toISOString(),
    },
  };
}

// Main execution
const contentDir = path.join(__dirname, "..", "content", "prompts");
const outputPath = path.join(__dirname, "..", "data", "prompt-index.json");

try {
  console.log("Building prompt index...");
  const index = buildPromptIndex(contentDir);

  // Ensure output directory exists
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(index, null, 2));
  console.log(`✅ Built prompt index with ${index.prompts.length} prompts`);
  console.log(`📁 Saved to: ${outputPath}`);
} catch (error) {
  console.error("❌ Error building prompt index:", error.message);
  process.exit(1);
}
