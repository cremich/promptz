const fs = require("fs");
const path = require("path");

function processFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");

  // Match frontmatter and extract author field
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) return;

  let frontmatter = frontmatterMatch[1];

  // Replace author: value with authors: [value]
  const authorMatch = frontmatter.match(/^author:\s*(.+)$/m);
  if (authorMatch) {
    const authorValue = authorMatch[1].trim();
    // Remove quotes if present and wrap in array
    const cleanValue = authorValue.replace(/^["']|["']$/g, "");
    frontmatter = frontmatter.replace(
      /^author:\s*.+$/m,
      `authors: ["${cleanValue}"]`,
    );

    const newContent = content.replace(
      /^---\n[\s\S]*?\n---/,
      `---\n${frontmatter}\n---`,
    );
    fs.writeFileSync(filePath, newContent);
    console.log(`Updated: ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (file.endsWith(".md")) {
      processFile(filePath);
    }
  }
}

walkDir("./content");
