/**
 * AppSync JavaScript resolver to delete an entity by its id
 */

import { util } from "@aws-appsync/utils";

/**
 * Request handler for the delete mutation
 * @param {Object} ctx - The AppSync context object
 * @returns {Object} - The DynamoDB operation to perform
 */
export function request(ctx) {
  // Extract arguments from the mutation
  const { id } = ctx.args;

  // Get identity information from context
  const identity = ctx.identity;
  const username = identity?.username;

  // For deletes, ensure the user is the owner and the item exists
  return {
    operation: "DeleteItem",
    key: util.dynamodb.toMapValues({ id: id, version: "LATEST" }),
    condition: {
      // Ensure the user is the owner of the prompt
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

/**
 * Response handler for the delete mutation
 * @param {Object} ctx - The AppSync context object
 * @returns {Object} - The prompt object
 */
export function response(ctx) {
  // Return the prompt object from the DynamoDB response
  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type, null, ctx.error.stack);
  }

  const detailType =
    ctx.info.fieldName === "deletePrompt"
      ? "prompt.deleted"
      : "projectrule.deleted";

  ctx.stash.event = { detailType, detail: ctx.result };

  return ctx.result;
}
