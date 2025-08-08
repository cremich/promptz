import { util } from "@aws-appsync/utils";

/**
 * Custom AppSync resolver for the searchPrompts query
 * This resolver implements text search and tag filtering for prompts
 *
 * @param {import('@aws-appsync/utils').Context} ctx - The AppSync context
 * @returns {Object} - The search results containing prompts array and nextToken
 */
export function request(ctx) {
  // Extract query parameters from arguments
  const { query, tags, nextToken } = ctx.args;

  // Initialize filter conditions
  const filter = {
    public: { eq: true }, // Only return public prompts
  };

  // Add text search filter if query is provided
  if (query) {
    filter.or = [
      { name: { contains: query } },
      { description: { contains: query } },
      { name: { contains: query.toLowerCase() } },
      { description: { contains: query.toLowerCase() } },
    ];
  }

  // Add tag filter if tags are provided
  if (tags && tags.length > 0) {
    // Create individual tag filters - each tag must be present
    const tagFilters = tags.map((tag) => ({
      tags: { contains: tag },
    }));

    // If we already have a query filter, we need to combine them properly
    if (filter.or) {
      // Text search with OR, but tags with AND
      filter.and = [
        { or: filter.or },
        ...tagFilters, // Spread tag filters directly into AND array
      ];
      delete filter.or;
    } else {
      // Just tags with AND
      filter.and = tagFilters;
    }
  }

  // Prepare DynamoDB query
  const queryParams = {
    operation: "Scan",
    filter: JSON.parse(util.transform.toDynamoDBFilterExpression(filter)),
    limit: 1000,
    nextToken: nextToken,
  };

  return queryParams;
}

/**
 * Process the DynamoDB response and format it according to the schema
 *
 * @param {import('@aws-appsync/utils').Context} ctx - The AppSync context
 * @returns {Object} - The formatted search results
 */
export function response(ctx) {
  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type, ctx.result);
  }

  // Format the response according to the promptSearchResponse type
  return {
    results: ctx.result.items || [],
    nextToken: ctx.result.nextToken,
  };
}
