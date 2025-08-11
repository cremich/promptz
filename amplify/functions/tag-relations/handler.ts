import {
  BatchProcessor,
  EventType,
  processPartialResponse,
} from "@aws-lambda-powertools/batch";
import { Logger } from "@aws-lambda-powertools/logger";
import type { DynamoDBRecord, DynamoDBStreamHandler } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  QueryCommand,
  BatchWriteCommand,
} from "@aws-sdk/lib-dynamodb";

// Initialize PowerTools utilities
const processor = new BatchProcessor(EventType.DynamoDBStreams);
const logger = new Logger({
  serviceName: "tag-relations-cdc",
  logLevel: "INFO",
});

// Initialize DynamoDB client
const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));

// Environment variables for table names - these will be set by Amplify
const PROMPT_TAG_TABLE = process.env.PROMPT_TAG_TABLE || "promptTag";
const RULE_TAG_TABLE = process.env.RULE_TAG_TABLE || "ruleTag";

/**
 * Extracts tags from a DynamoDB record image
 */
function extractTags(image: any): string[] {
  if (!image?.tags?.L) return [];

  return image.tags.L.map((tag: any) => tag.S).filter(
    (tag: string) => tag && tag.trim().length > 0,
  );
}

/**
 * Determines the item type based on the event source ARN
 */
function getItemType(eventSourceArn: string): "prompt" | "projectRule" | null {
  if (eventSourceArn.includes("prompt")) return "prompt";
  if (eventSourceArn.includes("projectRule")) return "projectRule";
  return null;
}

/**
 * Gets the appropriate join table name based on item type
 */
function getJoinTableName(itemType: "prompt" | "projectRule"): string {
  return itemType === "prompt" ? PROMPT_TAG_TABLE : RULE_TAG_TABLE;
}

/**
 * Removes all existing tag relationships for an item
 */
async function removeAllTagRelationships(
  itemId: string,
  itemType: "prompt" | "projectRule",
): Promise<void> {
  const tableName = getJoinTableName(itemType);
  const keyAttribute = itemType === "prompt" ? "promptId" : "ruleId";

  try {
    // Query existing relationships
    const queryResult = await dynamoClient.send(
      new QueryCommand({
        TableName: tableName,
        KeyConditionExpression: `${keyAttribute} = :itemId`,
        ExpressionAttributeValues: {
          ":itemId": itemId,
        },
      }),
    );

    if (!queryResult.Items || queryResult.Items.length === 0) {
      logger.debug("No existing tag relationships found", { itemId, itemType });
      return;
    }

    // Delete relationships in batches of 25 (DynamoDB batch write limit)
    const batchSize = 25;
    const items = queryResult.Items;

    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);

      const deleteRequests = batch.map((item) => ({
        DeleteRequest: {
          Key: {
            [keyAttribute]: item[keyAttribute],
            tagName: item.tagName,
          },
        },
      }));

      await dynamoClient.send(
        new BatchWriteCommand({
          RequestItems: {
            [tableName]: deleteRequests,
          },
        }),
      );

      logger.debug("Removed tag relationships batch", {
        itemId,
        itemType,
        batchSize: batch.length,
      });
    }

    logger.info("Removed all tag relationships", {
      itemId,
      itemType,
      removedCount: items.length,
    });
  } catch (error) {
    logger.error("Failed to remove tag relationships", {
      itemId,
      itemType,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

/**
 * Creates new tag relationships for an item
 */
async function createTagRelationships(
  itemId: string,
  tags: string[],
  itemType: "prompt" | "projectRule",
): Promise<void> {
  if (tags.length === 0) {
    logger.debug("No tags to create relationships for", { itemId, itemType });
    return;
  }

  const tableName = getJoinTableName(itemType);

  try {
    // Create relationships in batches of 25 (DynamoDB batch write limit)
    const batchSize = 25;
    for (let i = 0; i < tags.length; i += batchSize) {
      const batch = tags.slice(i, i + batchSize);

      const putRequests = batch.map((tagName) => ({
        PutRequest: {
          Item: {
            [itemType === "prompt" ? "promptId" : "ruleId"]: itemId,
            tagName: tagName,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        },
      }));

      await dynamoClient.send(
        new BatchWriteCommand({
          RequestItems: {
            [tableName]: putRequests,
          },
        }),
      );

      logger.debug("Created tag relationships batch", {
        itemId,
        itemType,
        batchSize: batch.length,
        tags: batch,
      });
    }

    logger.info("Created tag relationships", {
      itemId,
      itemType,
      tagCount: tags.length,
      tags,
    });
  } catch (error) {
    logger.error("Failed to create tag relationships", {
      itemId,
      itemType,
      tags,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

/**
 * Overwrites tag relationships by removing all existing ones and creating new ones
 */
async function overwriteTagRelationships(
  itemId: string,
  tags: string[],
  itemType: "prompt" | "projectRule",
): Promise<void> {
  logger.info("Overwriting tag relationships", {
    itemId,
    itemType,
    newTags: tags,
  });

  // First remove all existing relationships
  await removeAllTagRelationships(itemId, itemType);

  // Then create new relationships
  await createTagRelationships(itemId, tags, itemType);
}

/**
 * Processes a single DynamoDB stream record
 */
const recordHandler = async (record: DynamoDBRecord): Promise<void> => {
  try {
    const eventName = record.eventName;
    const eventSourceArn = record.eventSourceARN || "";
    const itemType = getItemType(eventSourceArn);

    if (!itemType) {
      logger.warn("Unknown item type from event source", { eventSourceArn });
      return;
    }

    logger.debug("Processing record", {
      eventName,
      itemType,
      eventSourceArn,
    });

    switch (eventName) {
      case "INSERT": {
        const newImage = record.dynamodb?.NewImage;
        if (!newImage?.id?.S) {
          logger.warn("INSERT record missing item ID");
          return;
        }

        const itemId = newImage.id.S;
        const tags = extractTags(newImage);

        logger.info("Processing INSERT event", { itemId, itemType, tags });

        // For INSERT, just create the relationships
        await createTagRelationships(itemId, tags, itemType);
        break;
      }

      case "MODIFY": {
        const newImage = record.dynamodb?.NewImage;
        if (!newImage?.id?.S) {
          logger.warn("MODIFY record missing item ID");
          return;
        }

        const itemId = newImage.id.S;
        const newTags = extractTags(newImage);

        logger.info("Processing MODIFY event", { itemId, itemType, newTags });

        // For MODIFY, overwrite all relationships with new tags
        await overwriteTagRelationships(itemId, newTags, itemType);
        break;
      }

      case "REMOVE": {
        const oldImage = record.dynamodb?.OldImage;
        if (!oldImage?.id?.S) {
          logger.warn("REMOVE record missing item ID");
          return;
        }

        const itemId = oldImage.id.S;

        logger.info("Processing REMOVE event", { itemId, itemType });

        // For REMOVE, delete all relationships
        await removeAllTagRelationships(itemId, itemType);
        break;
      }

      default:
        logger.warn("Unknown event type", { eventName });
        return;
    }

    logger.info("Successfully processed record", {
      eventName,
      itemType,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    logger.error("Failed to process record", {
      error: errorMessage,
      eventName: record.eventName,
      eventSourceARN: record.eventSourceARN,
    });

    // Re-throw to trigger batch processor retry logic
    throw error;
  }
};

/**
 * Main Lambda handler with middleware
 */
export const handler: DynamoDBStreamHandler = async (event, context) => {
  logger.info("Processing DynamoDB stream batch", {
    recordCount: event.Records.length,
    eventSourceARN: event.Records[0]?.eventSourceARN,
  });

  return processPartialResponse(event, recordHandler, processor, {
    context,
    throwOnFullBatchFailure: false, // Don't fail the entire batch if some records fail
  });
};
