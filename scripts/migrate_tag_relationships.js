#!/usr/bin/env node

/**
 * Script to update the owner attribute in DynamoDB table entries
 * This script transforms the owner attribute from "id::provider_id" to just "provider_id"
 *
 * Uses AWS SDK v3 for JavaScript
 */

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  UpdateCommand,
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

async function main() {
  try {
    // Get user inputs
    const tableName = await question("Enter the DynamoDB table name: ");
    const region =
      (await question("Enter the AWS region (default: us-east-1): ")) ||
      "us-east-1";
    const dryRun =
      (await question("Run in dry-run mode? (y/n): ")).toLowerCase() === "y";

    console.log(`\nConfiguration:`);
    console.log(`- Table: ${tableName}`);
    console.log(`- Region: ${region}`);
    console.log(`- Dry run: ${dryRun ? "Yes" : "No"}`);

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

    // Scan the table to get all items
    console.log("\nScanning table for items...");

    let lastEvaluatedKey = undefined;
    let processedItems = 0;
    let updatedItems = 0;

    do {
      const scanParams = {
        TableName: tableName,
        ExclusiveStartKey: lastEvaluatedKey,
      };

      const scanResponse = await docClient.send(new ScanCommand(scanParams));
      const items = scanResponse.Items || [];

      console.log(`Found ${items.length} items in this batch.`);
      processedItems += items.length;

      // Process each item
      for (const item of items) {
        console.log(`Item ID: ${item.id}`);

        if (!dryRun) {
          // Update the item in DynamoDB
          const updateParams = {
            TableName: tableName,
            Key: { id: item.id },
            UpdateExpression: "SET #tag_denormalized = :tag_denormalized",
            ExpressionAttributeNames: {
              "#tag_denormalized": "tag_denormalized",
            },
            ExpressionAttributeValues: {
              ":tag_denormalized": true,
            },
          };

          await docClient.send(new UpdateCommand(updateParams));
          updatedItems++;
          console.log("  ✓ Updated");
        } else {
          console.log("  ✓ Would update (dry run)");
          updatedItems++;
        }
      }

      lastEvaluatedKey = scanResponse.LastEvaluatedKey;
    } while (lastEvaluatedKey);

    console.log("\nOperation completed!");
    console.log(`Total items processed: ${processedItems}`);
    console.log(
      `Items ${dryRun ? "that would be" : ""} updated: ${updatedItems}`,
    );
  } catch (error) {
    console.error("Error:", error);
  } finally {
    rl.close();
  }
}

main();
