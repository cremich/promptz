/**
 * AppSync JavaScript resolver for saveModelProvider mutation
 * This resolver handles both creating and updating modelProviders
 */

import { util } from "@aws-appsync/utils";

/**
 * Slugify function that works with AppSync JavaScript resolver limitations
 * Converts a string to a URL-friendly slug by:
 * 1. Converting to lowercase
 * 2. Replacing non-alphanumeric characters with hyphens
 * 3. Removing consecutive hyphens
 * 4. Trimming hyphens from start and end
 *
 * @param {string} text - The text to convert to a slug
 * @returns {string} - The slugified text
 */
function slugify(text) {
  if (!text) return "";

  // Convert to lowercase
  let slug = text.toLowerCase();

  // Replace non-alphanumeric characters with hyphens
  // Using character-by-character replacement instead of regex (not fully supported)
  let result = "";
  let lastCharWasHyphen = false;

  for (const char of slug) {
    // Check if character is alphanumeric
    if ((char >= "a" && char <= "z") || (char >= "0" && char <= "9")) {
      result += char;
      lastCharWasHyphen = false;
    } else if (!lastCharWasHyphen) {
      // Replace with hyphen, but avoid consecutive hyphens
      result += "-";
      lastCharWasHyphen = true;
    }
  }

  // Trim hyphens from start and end
  if (result.startsWith("-")) {
    result = result.substring(1);
  }
  if (result.endsWith("-")) {
    result = result.substring(0, result.length - 1);
  }

  return result;
}
/**
 * Request handler for the saveModelProvider mutation
 * @param {Object} ctx - The AppSync context object
 * @returns {Object} - The DynamoDB operation to perform
 */
export function request(ctx) {
  // Extract arguments from the mutation
  const { id, name, description, website } = ctx.args;

  // Generate ID if not provided (create mode)
  const modelProviderId = id || util.autoId();

  // Create slug from name and ID
  const slug = `${slugify(name)}-${modelProviderId.split("-")[0]}`;

  // Get identity information from context
  const identity = ctx.identity;
  const username = identity?.username;
  const claims = identity?.claims || {};

  // Determine if this is a create or update operation
  const isCreate = !id;

  // Prepare the base payload
  const payload = {
    id: modelProviderId,
    name,
    slug,
    description,
    website,
  };

  // For create operations, add owner information
  if (isCreate) {
    payload.owner = username;

    // Add creation timestamp
    const now = util.time.nowISO8601();
    payload.createdAt = now;
    payload.updatedAt = now;
  } else {
    // For update operations, add updated timestamp
    payload.updatedAt = util.time.nowISO8601();
  }

  // Return the appropriate DynamoDB operation
  if (isCreate) {
    return {
      operation: "PutItem",
      key: util.dynamodb.toMapValues({ id: modelProviderId }),
      attributeValues: util.dynamodb.toMapValues(payload),
      condition: {
        expression: "attribute_not_exists(#id)",
        expressionNames: {
          "#id": "id",
        },
      },
    };
  } else {
    // For updates, ensure the user is the owner
    return {
      operation: "UpdateItem",
      key: util.dynamodb.toMapValues({ id: modelProviderId }),
      update: {
        expression:
          "SET #name = :name, #slug = :slug, #description = :description, #website = :website, #updatedAt = :updatedAt",
        expressionNames: {
          "#name": "name",
          "#slug": "slug",
          "#description": "description",
          "#website": "website",
          "#updatedAt": "updatedAt",
        },
        expressionValues: util.dynamodb.toMapValues({
          ":name": name,
          ":slug": slug,
          ":description": description,
          ":website": website,
          ":updatedAt": util.time.nowISO8601(),
        }),
      },
      condition: {
        // Ensure the user is the owner of the modelProvider
        expression: "#owner = :owner",
        expressionNames: {
          "#owner": "owner",
        },
        expressionValues: util.dynamodb.toMapValues({
          ":owner": username,
        }),
      },
    };
  }
}

/**
 * Response handler for the saveModelProvider mutation
 * @param {Object} ctx - The AppSync context object
 * @returns {Object} - The modelProvider object
 */
export function response(ctx) {
  // Return the modelProvider object from the DynamoDB response
  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type, null, ctx.error.stack);
  }

  return ctx.result;
}
