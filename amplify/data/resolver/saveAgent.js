/**
 * AppSync JavaScript resolver for saveAgent mutation
 * This resolver handles both creating and updating agents
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
 * Request handler for the saveAgent mutation
 * @param {Object} ctx - The AppSync context object
 * @returns {Object} - The DynamoDB operation to perform
 */
export function request(ctx) {
  // Extract arguments from the mutation
  const {
    id,
    name,
    description,
    prompt,
    tools,
    mcpServers,
    resources,
    hooks,
    toolsSettings,
    toolAliases,
    allowedTools,
    useLegacyMcpJson,
    tags,
    scope,
    sourceURL,
  } = ctx.args;

  // Generate ID if not provided (create mode)
  const itemId = id || util.autoId();

  // Create slug from name and ID
  const slug = `${slugify(name)}-${itemId.split("-")[0]}`;

  // Get identity information from context
  const identity = ctx.identity;
  const username = identity?.username;

  // Determine if this is a create or update operation
  const isCreate = !id;

  // Return the appropriate DynamoDB operation
  if (isCreate) {
    const payload = {
      id: itemId,
      name,
      slug,
      description,
      prompt: prompt || null,
      tools: tools || [],
      mcpServers: mcpServers || null,
      resources: resources || [],
      hooks: hooks || null,
      toolsSettings: toolsSettings || null,
      toolAliases: toolAliases || null,
      allowedTools: allowedTools || [],
      useLegacyMcpJson: useLegacyMcpJson || false,
      tags: tags || [],
      scope,
      sourceURL: sourceURL || null,
      owner: username,
      copyCount: 0,
      downloadCount: 0,
      createdAt: util.time.nowISO8601(),
      updatedAt: util.time.nowISO8601(),
    };

    return {
      operation: "PutItem",
      key: util.dynamodb.toMapValues({
        id: payload.id,
      }),
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
      key: util.dynamodb.toMapValues({ id: itemId }),
      update: {
        expression:
          "SET #name = :name, #slug = :slug, #description = :description, #prompt = :prompt, #tools = :tools, #mcpServers = :mcpServers, #resources = :resources, #hooks = :hooks, #toolsSettings = :toolsSettings, #toolAliases = :toolAliases, #allowedTools = :allowedTools, #useLegacyMcpJson = :useLegacyMcpJson, #tags = :tags, #scope = :scope, #sourceURL = :sourceURL, #updatedAt = :updatedAt",
        expressionNames: {
          "#name": "name",
          "#slug": "slug",
          "#description": "description",
          "#prompt": "prompt",
          "#tools": "tools",
          "#mcpServers": "mcpServers",
          "#resources": "resources",
          "#hooks": "hooks",
          "#toolsSettings": "toolsSettings",
          "#toolAliases": "toolAliases",
          "#allowedTools": "allowedTools",
          "#useLegacyMcpJson": "useLegacyMcpJson",
          "#tags": "tags",
          "#scope": "scope",
          "#sourceURL": "sourceURL",
          "#updatedAt": "updatedAt",
        },
        expressionValues: util.dynamodb.toMapValues({
          ":name": name,
          ":slug": slug,
          ":description": description,
          ":prompt": prompt || null,
          ":tools": tools || [],
          ":mcpServers": mcpServers || null,
          ":resources": resources || [],
          ":hooks": hooks || null,
          ":toolsSettings": toolsSettings || null,
          ":toolAliases": toolAliases || null,
          ":allowedTools": allowedTools || [],
          ":useLegacyMcpJson": useLegacyMcpJson || false,
          ":tags": tags || [],
          ":scope": scope,
          ":sourceURL": sourceURL || null,
          ":updatedAt": util.time.nowISO8601(),
        }),
      },
      condition: {
        // Ensure the user is the owner of the agent
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
 * Response handler for the saveAgent mutation
 * @param {Object} ctx - The AppSync context object
 * @returns {Object} - The agent object
 */
export function response(ctx) {
  // Return the agent object from the DynamoDB response
  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type, null, ctx.error.stack);
  }

  // Set event details for EventBridge publishing
  const detailType = "agent.saved";
  ctx.stash.event = { detailType, detail: ctx.result };

  return ctx.result;
}
