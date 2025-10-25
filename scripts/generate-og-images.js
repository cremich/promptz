const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const matter = require("gray-matter");

const CONTENT_DIR = "content";
const OUTPUT_DIR = "static/og-images";
const LOGO_PATH = "assets/images/promptz_logo.png";

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function getAllMarkdownFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...getAllMarkdownFiles(fullPath));
    } else if (item.endsWith(".md") && !item.startsWith("_")) {
      files.push(fullPath);
    }
  }

  return files;
}

function generateHTML(frontMatter, contentType, logoBase64) {
  const { title, description, authors, tags } = frontMatter;
  const author = Array.isArray(authors) ? authors[0] : authors || "Unknown";
  const tagList = Array.isArray(tags) ? tags.slice(0, 4) : [];

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #1a1625 0%, #2d1b69 50%, #8b5cf6 100%);
          width: 1200px;
          height: 630px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 60px 80px;
          box-sizing: border-box;
          color: white;
          position: relative;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 40px;
        }
        .logo {
          width: 120px;
          height: auto;
          opacity: 0.9;
        }
        .type {
          font-size: 20px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 2px;
          opacity: 0.8;
          background: rgba(255, 255, 255, 0.1);
          padding: 8px 16px;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .content {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .title {
          font-size: 52px;
          font-weight: 700;
          line-height: 1.1;
          margin-bottom: 30px;
          max-height: 220px;
          overflow: hidden;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        .description {
          font-size: 26px;
          line-height: 1.4;
          opacity: 0.9;
          margin-bottom: 40px;
          max-height: 110px;
          overflow: hidden;
        }
        .meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 18px;
        }
        .author {
          opacity: 0.8;
          font-weight: 500;
        }
        .tags {
          display: flex;
          gap: 12px;
        }
        .tag {
          background: rgba(139, 92, 246, 0.3);
          border: 1px solid rgba(139, 92, 246, 0.5);
          padding: 6px 14px;
          border-radius: 16px;
          font-size: 14px;
          font-weight: 500;
        }
        .gradient-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
          pointer-events: none;
        }
      </style>
    </head>
    <body>
      <div class="gradient-overlay"></div>
      <div class="header">
        <img src="data:image/png;base64,${logoBase64}" alt="Promptz" class="logo" />
        <div class="type">${contentType}</div>
      </div>
      <div class="content">
        <div class="title">${title}</div>
        <div class="description">${description}</div>
      </div>
      <div class="meta">
        <div class="author">by ${author}</div>
        <div class="tags">
          ${tagList.map((tag) => `<div class="tag">#${tag}</div>`).join("")}
        </div>
      </div>
    </body>
    </html>
  `;
}

async function generateOGImage(filePath, logoBase64) {
  const content = fs.readFileSync(filePath, "utf8");
  const { data: frontMatter } = matter(content);

  if (!frontMatter.title || !frontMatter.description) {
    console.log(`Skipping ${filePath}: missing title or description`);
    return;
  }

  const relativePath = path.relative(CONTENT_DIR, filePath);
  const contentType = relativePath.split("/")[0].toUpperCase();
  const slug = relativePath.replace(/\.md$/, "").replace(/\//g, "-");
  const outputPath = path.join(OUTPUT_DIR, `${slug}.png`);

  const html = generateHTML(frontMatter, contentType, logoBase64);

  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  await page.setViewport({ width: 1200, height: 630 });
  await page.setContent(html);
  await page.screenshot({ path: outputPath, type: "png" });

  await browser.close();
  console.log(`Generated: ${outputPath}`);
}

async function main() {
  console.log("Generating OpenGraph images...");

  // Load and encode logo
  const logoBuffer = fs.readFileSync(LOGO_PATH);
  const logoBase64 = logoBuffer.toString("base64");

  const markdownFiles = getAllMarkdownFiles(CONTENT_DIR);
  const contentFiles = markdownFiles.filter(
    (file) =>
      file.includes("/prompts/") ||
      file.includes("/rules/") ||
      file.includes("/agents/"),
  );

  console.log(`Found ${contentFiles.length} content files`);

  for (const file of contentFiles) {
    try {
      await generateOGImage(file, logoBase64);
    } catch (error) {
      console.error(`Error generating image for ${file}:`, error.message);
    }
  }

  console.log("OpenGraph image generation complete!");
}

main().catch(console.error);
