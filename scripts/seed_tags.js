#!/usr/bin/env node

/**
 * Script to seed the Tag table with predefined tags from the tag enumerations
 * This script populates the Tag table with all predefined tags, ensuring they are
 * properly categorized and described for optimal user experience.
 *
 * Uses AWS SDK v3 for JavaScript
 */

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  DeleteCommand,
  ScanCommand,
  BatchWriteCommand,
} from "@aws-sdk/lib-dynamodb";
import readline from "readline";

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Promisify the question function
function question(query) {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

// Predefined tag enumerations from the codebase
const SdlcActivity = {
  DEBUG: "Debugging",
  DEPLOY: "Deploy",
  DESIGN: "Design",
  DOCUMENT: "Documentation",
  ENHANCE: "Enhance",
  IMPLEMENT: "Implement",
  OPERATE: "Operate",
  OPTIMIZE: "Optimize",
  PATCH: "Patch Management",
  PLAN: "Plan",
  REFACTOR: "Refactoring",
  REQ: "Requirements",
  SECURITY: "Security",
  SUPPORT: "Support",
  TEST: "Test",
};

const PromptCategory = {
  CHAT: "Chat",
  DEV_AGENT: "Dev Agent",
  DOC_AGENT: "Doc Agent",
  INLINE: "Inline",
  REVIEW_AGENT: "Review Agent",
  TEST_AGENT: "Test Agent",
  TRANSFORM: "Transform Agent",
  TRANSLATE: "Translate",
};

const QInterface = {
  IDE: "IDE",
  CLI: "CLI",
  CONSOLE: "Management Console",
};

const ProjectRuleTag = {
  NEXTJS: "NextJS",
  REACT: "React",
  VUE: "Vue.js",
  SWIFT: "Swift",
  KOTLIN: "Kotlin",
  TYPESCRIPT: "TypeScript",
  JAVASCRIPT: "JavaScript",
  PYTHON: "Python",
  JAVA: "Java",
  RUST: "Rust",
  GO: "Go",
  AWS: "AWS",
  AMPLIFY: "Amplify",
  CDK: "CDK",
  SAM: "SAM",
  CLOUDFORMATION: "Cloudformation",
  SECURITY: "Security",
  PERFORMANCE: "Performance",
  ACCESSIBILITY: "Accessibility",
  SEO: "SEO",
};

// Tag definitions with categories and descriptions
const tagDefinitions = [
  // SDLC Activity Tags
  {
    name: SdlcActivity.DEBUG,
    category: "SDLC",
    description:
      "Tags for prompts and rules related to debugging code, troubleshooting issues, and error resolution",
  },
  {
    name: SdlcActivity.DEPLOY,
    category: "SDLC",
    description:
      "Tags for deployment-related prompts and rules, including CI/CD, infrastructure deployment, and release management",
  },
  {
    name: SdlcActivity.DESIGN,
    category: "SDLC",
    description:
      "Tags for software design, architecture planning, and system design prompts and rules",
  },
  {
    name: SdlcActivity.DOCUMENT,
    category: "SDLC",
    description:
      "Tags for documentation creation, API documentation, and technical writing prompts and rules",
  },
  {
    name: SdlcActivity.ENHANCE,
    category: "SDLC",
    description:
      "Tags for feature enhancement, improvement suggestions, and code optimization prompts and rules",
  },
  {
    name: SdlcActivity.IMPLEMENT,
    category: "SDLC",
    description:
      "Tags for code implementation, feature development, and programming task prompts and rules",
  },
  {
    name: SdlcActivity.OPERATE,
    category: "SDLC",
    description:
      "Tags for operational tasks, monitoring, maintenance, and system administration prompts and rules",
  },
  {
    name: SdlcActivity.OPTIMIZE,
    category: "SDLC",
    description:
      "Tags for performance optimization, code efficiency, and resource utilization prompts and rules",
  },
  {
    name: SdlcActivity.PATCH,
    category: "SDLC",
    description:
      "Tags for patch management, security updates, and bug fix prompts and rules",
  },
  {
    name: SdlcActivity.PLAN,
    category: "SDLC",
    description:
      "Tags for project planning, sprint planning, and development strategy prompts and rules",
  },
  {
    name: SdlcActivity.REFACTOR,
    category: "SDLC",
    description:
      "Tags for code refactoring, restructuring, and code quality improvement prompts and rules",
  },
  {
    name: SdlcActivity.REQ,
    category: "SDLC",
    description:
      "Tags for requirements gathering, analysis, and specification prompts and rules",
  },
  {
    name: SdlcActivity.SECURITY,
    category: "SDLC",
    description:
      "Tags for security analysis, vulnerability assessment, and secure coding prompts and rules",
  },
  {
    name: SdlcActivity.SUPPORT,
    category: "SDLC",
    description:
      "Tags for customer support, issue resolution, and maintenance prompts and rules",
  },
  {
    name: SdlcActivity.TEST,
    category: "SDLC",
    description:
      "Tags for testing, quality assurance, and test automation prompts and rules",
  },

  // Prompt Agent Tags
  {
    name: PromptCategory.CHAT,
    category: "Agent",
    description:
      "Tags for conversational prompts designed for chat-based interactions with Amazon Q Developer",
  },
  {
    name: PromptCategory.DEV_AGENT,
    category: "Agent",
    description:
      "Tags for prompts designed for Amazon Q Developer Agent for software development tasks",
  },
  {
    name: PromptCategory.DOC_AGENT,
    category: "Agent",
    description:
      "Tags for prompts designed for Amazon Q Developer Agent for documentation tasks",
  },
  {
    name: PromptCategory.INLINE,
    category: "Agent",
    description:
      "Tags for inline prompts used directly within code editors and development environments",
  },
  {
    name: PromptCategory.REVIEW_AGENT,
    category: "Agent",
    description:
      "Tags for prompts designed for Amazon Q Developer Agent for code review tasks",
  },
  {
    name: PromptCategory.TEST_AGENT,
    category: "Agent",
    description:
      "Tags for prompts designed for Amazon Q Developer Agent for testing and quality assurance tasks",
  },
  {
    name: PromptCategory.TRANSFORM,
    category: "Agent",
    description:
      "Tags for prompts designed for Amazon Q Developer Transform Agent for code transformation tasks",
  },
  {
    name: PromptCategory.TRANSLATE,
    category: "Agent",
    description:
      "Tags for prompts designed for code translation and language conversion tasks",
  },

  // Q Interface Tags
  {
    name: QInterface.IDE,
    category: "Interface",
    description:
      "Tags for prompts and rules designed for use within Integrated Development Environments",
  },
  {
    name: QInterface.CLI,
    category: "Interface",
    description:
      "Tags for prompts and rules designed for use with Amazon Q Developer CLI",
  },
  {
    name: QInterface.CONSOLE,
    category: "Interface",
    description:
      "Tags for prompts and rules designed for use within AWS Management Console",
  },

  // Technology and Framework Tags
  {
    name: ProjectRuleTag.NEXTJS,
    category: "Framework",
    description:
      "Tags for Next.js framework-specific prompts and project rules",
  },
  {
    name: ProjectRuleTag.REACT,
    category: "Framework",
    description: "Tags for React library-specific prompts and project rules",
  },
  {
    name: ProjectRuleTag.VUE,
    category: "Framework",
    description: "Tags for Vue.js framework-specific prompts and project rules",
  },
  {
    name: ProjectRuleTag.SWIFT,
    category: "Language",
    description:
      "Tags for Swift programming language-specific prompts and project rules",
  },
  {
    name: ProjectRuleTag.KOTLIN,
    category: "Language",
    description:
      "Tags for Kotlin programming language-specific prompts and project rules",
  },
  {
    name: ProjectRuleTag.TYPESCRIPT,
    category: "Language",
    description:
      "Tags for TypeScript programming language-specific prompts and project rules",
  },
  {
    name: ProjectRuleTag.JAVASCRIPT,
    category: "Language",
    description:
      "Tags for JavaScript programming language-specific prompts and project rules",
  },
  {
    name: ProjectRuleTag.PYTHON,
    category: "Language",
    description:
      "Tags for Python programming language-specific prompts and project rules",
  },
  {
    name: ProjectRuleTag.JAVA,
    category: "Language",
    description:
      "Tags for Java programming language-specific prompts and project rules",
  },
  {
    name: ProjectRuleTag.RUST,
    category: "Language",
    description:
      "Tags for Rust programming language-specific prompts and project rules",
  },
  {
    name: ProjectRuleTag.GO,
    category: "Language",
    description:
      "Tags for Go programming language-specific prompts and project rules",
  },
  {
    name: ProjectRuleTag.AMPLIFY,
    category: "Framework",
    description: "Tags for AWS Amplify-specific prompts and project rules",
  },
  {
    name: ProjectRuleTag.CDK,
    category: "IaC",
    description:
      "Tags for AWS CDK (Cloud Development Kit)-specific prompts and project rules",
  },
  {
    name: ProjectRuleTag.SAM,
    category: "IaC",
    description:
      "Tags for AWS SAM (Serverless Application Model)-specific prompts and project rules",
  },
  {
    name: ProjectRuleTag.CLOUDFORMATION,
    category: "IaC",
    description:
      "Tags for AWS CloudFormation-specific prompts and project rules",
  },
  {
    name: ProjectRuleTag.PERFORMANCE,
    category: "Misc",
    description:
      "Tags for performance optimization and monitoring prompts and project rules",
  },
  {
    name: ProjectRuleTag.ACCESSIBILITY,
    category: "Misc",
    description:
      "Tags for accessibility compliance and inclusive design prompts and project rules",
  },
  {
    name: ProjectRuleTag.SEO,
    category: "Misc",
    description:
      "Tags for search engine optimization prompts and project rules",
  },
];

/**
 * Validates tag data before insertion
 * @param {Object} tag - Tag object to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function validateTag(tag) {
  if (!tag.name || typeof tag.name !== "string" || tag.name.trim() === "") {
    console.error(`Invalid tag name: ${tag.name}`);
    return false;
  }

  if (
    !tag.category ||
    typeof tag.category !== "string" ||
    tag.category.trim() === ""
  ) {
    console.error(`Invalid tag category for ${tag.name}: ${tag.category}`);
    return false;
  }

  if (tag.description && typeof tag.description !== "string") {
    console.error(
      `Invalid tag description for ${tag.name}: ${tag.description}`,
    );
    return false;
  }

  return true;
}

/**
 * Seeds tags into the DynamoDB table
 * @param {DynamoDBDocumentClient} docClient - DynamoDB document client
 * @param {string} tableName - Name of the Tag table
 * @param {boolean} dryRun - Whether to run in dry-run mode
 * @returns {Promise<number>} - Number of tags seeded
 */
async function seedTags(docClient, tableName, dryRun = false) {
  let seededCount = 0;
  let errorCount = 0;

  console.log(
    `\n${dryRun ? "DRY RUN: " : ""}Seeding ${tagDefinitions.length} tags...`,
  );

  for (const tagDef of tagDefinitions) {
    try {
      // Validate tag data
      if (!validateTag(tagDef)) {
        errorCount++;
        continue;
      }

      const tagItem = {
        name: tagDef.name.trim(),
        category: tagDef.category.trim(),
        description: tagDef.description?.trim() || "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log(
        `${dryRun ? "Would seed" : "Seeding"} tag: ${tagItem.name} (${tagItem.category})`,
      );

      if (!dryRun) {
        // Use PutCommand with ConditionExpression to prevent overwriting existing tags
        const putParams = {
          TableName: tableName,
          Item: tagItem,
          ConditionExpression: "attribute_not_exists(#name)",
          ExpressionAttributeNames: {
            "#name": "name",
          },
        };

        try {
          await docClient.send(new PutCommand(putParams));
          seededCount++;
          console.log(`  ✓ Successfully seeded: ${tagItem.name}`);
        } catch (error) {
          if (error.name === "ConditionalCheckFailedException") {
            console.log(`  ⚠ Tag already exists: ${tagItem.name}`);
          } else {
            console.error(`  ✗ Failed to seed ${tagItem.name}:`, error.message);
            errorCount++;
          }
        }
      } else {
        seededCount++;
        console.log(`  ✓ Would seed: ${tagItem.name}`);
      }
    } catch (error) {
      console.error(`Error processing tag ${tagDef.name}:`, error.message);
      errorCount++;
    }
  }

  console.log(`\n${dryRun ? "DRY RUN " : ""}Seeding completed!`);
  console.log(`Tags ${dryRun ? "that would be" : ""} seeded: ${seededCount}`);
  if (errorCount > 0) {
    console.log(`Errors encountered: ${errorCount}`);
  }

  return seededCount;
}

/**
 * Removes all seeded tags from the DynamoDB table (rollback functionality)
 * @param {DynamoDBDocumentClient} docClient - DynamoDB document client
 * @param {string} tableName - Name of the Tag table
 * @param {boolean} dryRun - Whether to run in dry-run mode
 * @returns {Promise<number>} - Number of tags removed
 */
async function rollbackTags(docClient, tableName, dryRun = false) {
  let removedCount = 0;
  let errorCount = 0;

  console.log(`\n${dryRun ? "DRY RUN: " : ""}Rolling back seeded tags...`);

  // Get all tag names that we would have seeded
  const tagNamesToRemove = tagDefinitions.map((tag) => tag.name);

  for (const tagName of tagNamesToRemove) {
    try {
      console.log(`${dryRun ? "Would remove" : "Removing"} tag: ${tagName}`);

      if (!dryRun) {
        const deleteParams = {
          TableName: tableName,
          Key: { name: tagName },
          ConditionExpression: "attribute_exists(#name)",
          ExpressionAttributeNames: {
            "#name": "name",
          },
        };

        try {
          await docClient.send(new DeleteCommand(deleteParams));
          removedCount++;
          console.log(`  ✓ Successfully removed: ${tagName}`);
        } catch (error) {
          if (error.name === "ConditionalCheckFailedException") {
            console.log(`  ⚠ Tag does not exist: ${tagName}`);
          } else {
            console.error(`  ✗ Failed to remove ${tagName}:`, error.message);
            errorCount++;
          }
        }
      } else {
        removedCount++;
        console.log(`  ✓ Would remove: ${tagName}`);
      }
    } catch (error) {
      console.error(`Error processing tag ${tagName}:`, error.message);
      errorCount++;
    }
  }

  console.log(`\n${dryRun ? "DRY RUN " : ""}Rollback completed!`);
  console.log(`Tags ${dryRun ? "that would be" : ""} removed: ${removedCount}`);
  if (errorCount > 0) {
    console.log(`Errors encountered: ${errorCount}`);
  }

  return removedCount;
}

/**
 * Lists existing tags in the table for verification
 * @param {DynamoDBDocumentClient} docClient - DynamoDB document client
 * @param {string} tableName - Name of the Tag table
 */
async function listExistingTags(docClient, tableName) {
  console.log("\nListing existing tags in the table...");

  try {
    const scanParams = {
      TableName: tableName,
      ProjectionExpression: "#name, category, description",
      ExpressionAttributeNames: {
        "#name": "name",
      },
    };

    let lastEvaluatedKey = undefined;
    let totalCount = 0;

    do {
      if (lastEvaluatedKey) {
        scanParams.ExclusiveStartKey = lastEvaluatedKey;
      }

      const scanResponse = await docClient.send(new ScanCommand(scanParams));
      const items = scanResponse.Items || [];

      items.forEach((item) => {
        console.log(
          `  - ${item.name} (${item.category}): ${item.description || "No description"}`,
        );
        totalCount++;
      });

      lastEvaluatedKey = scanResponse.LastEvaluatedKey;
    } while (lastEvaluatedKey);

    console.log(`\nTotal existing tags: ${totalCount}`);
  } catch (error) {
    console.error("Error listing existing tags:", error.message);
  }
}

/**
 * Main function to handle user input and execute the seeding operation
 */
async function main() {
  try {
    console.log("=== Tag Seeding Script ===");
    console.log(
      "This script will populate the Tag table with predefined tags from the codebase.",
    );
    console.log(`Total tags to process: ${tagDefinitions.length}`);

    // Get user inputs
    const tableName = await question("Enter the DynamoDB Tag table name: ");
    const region =
      (await question("Enter the AWS region (default: us-east-1): ")) ||
      "us-east-1";

    const operation = await question("Choose operation (seed/rollback/list): ");

    if (!["seed", "rollback", "list"].includes(operation.toLowerCase())) {
      console.log(
        "Invalid operation. Please choose 'seed', 'rollback', or 'list'.",
      );
      rl.close();
      return;
    }

    let dryRun = false;
    if (operation.toLowerCase() !== "list") {
      dryRun =
        (await question("Run in dry-run mode? (y/n): ")).toLowerCase() === "y";
    }

    console.log(`\nConfiguration:`);
    console.log(`- Table: ${tableName}`);
    console.log(`- Region: ${region}`);
    console.log(`- Operation: ${operation}`);
    if (operation.toLowerCase() !== "list") {
      console.log(`- Dry run: ${dryRun ? "Yes" : "No"}`);
    }

    const confirmation = await question(
      "\nProceed with these settings? (y/n): ",
    );
    if (confirmation.toLowerCase() !== "y") {
      console.log("Operation cancelled by user.");
      rl.close();
      return;
    }

    // Initialize DynamoDB client
    const client = new DynamoDBClient({ region });
    const docClient = DynamoDBDocumentClient.from(client);

    // Execute the chosen operation
    switch (operation.toLowerCase()) {
      case "seed":
        await seedTags(docClient, tableName, dryRun);
        break;
      case "rollback":
        await rollbackTags(docClient, tableName, dryRun);
        break;
      case "list":
        await listExistingTags(docClient, tableName);
        break;
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    rl.close();
  }
}

// Export functions for testing
export {
  tagDefinitions,
  validateTag,
  seedTags,
  rollbackTags,
  listExistingTags,
};

// Run the script if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
