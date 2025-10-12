#!/usr/bin/env ts-node

import * as fs from "fs";
import * as path from "path";
import {
  validateMarkdownContent,
  ValidationResult,
} from "../lib/markdown/validator";

interface ValidationResults {
  [filePath: string]: ValidationResult;
}

interface FormattedResults {
  output: string;
  hasErrors: boolean;
  summary: {
    totalFiles: number;
    validFiles: number;
    totalErrors: number;
    totalWarnings: number;
  };
}

// Get all markdown files in content directory
function getAllMarkdownFiles(contentDir: string): string[] {
  const files: string[] = [];

  function scanDirectory(dir: string): void {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else if (item.endsWith(".md") && !item.startsWith(".")) {
        files.push(fullPath);
      }
    }
  }

  if (fs.existsSync(contentDir)) {
    scanDirectory(contentDir);
  }

  return files;
}

// Validate a single markdown file
function validateMarkdownFile(filePath: string): ValidationResult {
  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return {
        valid: false,
        errors: [`File not found: ${filePath}`],
        warnings: [],
      };
    }

    // Read file content
    const fileContent = fs.readFileSync(filePath, "utf8");
    const fileName = path.basename(filePath);

    // Use the validator module
    return validateMarkdownContent(fileContent, fileName);
  } catch (error) {
    return {
      valid: false,
      errors: [
        `Failed to read file: ${error instanceof Error ? error.message : "Unknown error"}`,
      ],
      warnings: [],
    };
  }
}

// Format validation results for user-friendly output
function formatResults(results: ValidationResults): FormattedResults {
  let output = "";
  let totalErrors = 0;
  let totalWarnings = 0;

  for (const [filePath, result] of Object.entries(results)) {
    const relativePath = path.relative(process.cwd(), filePath);

    if (result.valid && result.warnings.length === 0) {
      output += `✅ ${relativePath}\n`;
    } else {
      if (result.errors.length > 0) {
        output += `❌ ${relativePath}\n`;
        result.errors.forEach((error) => {
          output += `   Error: ${error}\n`;
          totalErrors++;
        });
      }

      if (result.warnings.length > 0) {
        if (result.errors.length === 0) {
          output += `⚠️  ${relativePath}\n`;
        }
        result.warnings.forEach((warning) => {
          output += `   Warning: ${warning}\n`;
          totalWarnings++;
        });
      }
    }
    output += "\n";
  }

  // Summary
  const totalFiles = Object.keys(results).length;
  const validFiles = Object.values(results).filter((r) => r.valid).length;

  output += `\n📊 Validation Summary:\n`;
  output += `   Files processed: ${totalFiles}\n`;
  output += `   Valid files: ${validFiles}\n`;
  output += `   Files with errors: ${totalFiles - validFiles}\n`;
  output += `   Total errors: ${totalErrors}\n`;
  output += `   Total warnings: ${totalWarnings}\n`;

  return {
    output,
    hasErrors: totalErrors > 0,
    summary: {
      totalFiles,
      validFiles,
      totalErrors,
      totalWarnings,
    },
  };
}

// Main CLI function
function main(): void {
  const args = process.argv.slice(2);
  const contentDir = path.join(process.cwd(), "content", "prompts");

  let filesToValidate: string[] = [];

  if (args.length === 0) {
    // Validate all files in content directory
    filesToValidate = getAllMarkdownFiles(contentDir);

    if (filesToValidate.length === 0) {
      console.log("❌ No markdown files found in content/prompts directory");
      process.exit(1);
    }

    console.log(
      `🔍 Validating ${filesToValidate.length} markdown files in content/prompts...\n`,
    );
  } else {
    // Validate specific file
    const targetFile = path.resolve(args[0]);

    if (!targetFile.endsWith(".md")) {
      console.log("❌ File must have .md extension");
      process.exit(1);
    }

    filesToValidate = [targetFile];
    console.log(
      `🔍 Validating ${path.relative(process.cwd(), targetFile)}...\n`,
    );
  }

  // Run validation
  const results: ValidationResults = {};

  for (const filePath of filesToValidate) {
    results[filePath] = validateMarkdownFile(filePath);
  }

  // Format and display results
  const { output, hasErrors } = formatResults(results);
  console.log(output);

  // Exit with appropriate code
  if (hasErrors) {
    console.log("❌ Validation failed with errors");
    process.exit(1);
  } else {
    console.log("✅ All validations passed");
    process.exit(0);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { validateMarkdownFile, getAllMarkdownFiles, formatResults, main };
