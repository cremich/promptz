import path from "path";
import type { ProcessedContent } from "./types";

export function extractContentSections(
  markdownContent: string,
): ProcessedContent {
  const lines = markdownContent.split("\n");
  let content = "";
  let howto = "";
  let currentSection = "content";
  let isInHowToSection = false;

  for (const line of lines) {
    // Check if this is a heading
    if (line.startsWith("## How to Use") || line.startsWith("## How To Use")) {
      isInHowToSection = true;
      currentSection = "howto";
      continue;
    }

    // Check if this is another heading (not how-to)
    if (
      line.startsWith("## ") &&
      !line.includes("How to Use") &&
      !line.includes("How To Use")
    ) {
      isInHowToSection = false;
      currentSection = "other";
      continue;
    }

    // Skip the main title (first h1)
    if (line.startsWith("# ") && content === "" && howto === "") {
      continue;
    }

    // Add content to appropriate section
    if (currentSection === "content" && !isInHowToSection) {
      if (content !== "" || line.trim() !== "") {
        content += (content ? "\n" : "") + line;
      }
    } else if (currentSection === "howto" && isInHowToSection) {
      if (howto !== "" || line.trim() !== "") {
        howto += (howto ? "\n" : "") + line;
      }
    }
  }

  return {
    content: content.trim(),
    howto: howto.trim(),
  };
}

export function generateSlugFromFilename(filename: string): string {
  return path.basename(filename, ".md");
}
