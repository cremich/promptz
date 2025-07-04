"use server";
import { cookies } from "next/headers";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";
import { type Schema } from "../../amplify/data/resource";
import outputs from "../../amplify_outputs.json";
import { Tag } from "@/lib/models/tags-model";
import { GraphQLResult } from "aws-amplify/api";

interface TagsByCategoryResponse {
  listByCategory: {
    items: {
      name?: string;
      description?: string;
      category?: string;
    }[];
    nextToken?: string;
  };
}

interface TagWithCountResponse {
  getTag: {
    name?: string;
    description?: string;
    category?: string;
    prompts: {
      items: [
        {
          promptId: string;
        },
      ];
    };
    rules: {
      items: [
        {
          ruleId: string;
        },
      ];
    };
  };
}

// Initialize AppSync client
const appsync = generateServerClientUsingCookies<Schema>({
  config: outputs,
  cookies,
});

/**
 * Fetches tags by category with their counts
 * @param category - Category to filter by (e.g., "SDLC", "Interface", "Technology")
 * @returns Promise<Tag> - Array of tags in the specified category
 */
export async function fetchTagsByCategory(category: string): Promise<Tag[]> {
  const GET_TAG_BY_CATEGORY = `
  query ListTag($category: String!) {
    listByCategory(category: $category) {
      items {
        name
        description
        category
      }
    }
  }
`;

  // we have to use the raw graphql client as the type generation for
  // queries with secondary indexes is buggy and results in an error of invalid
  // type matching of filters.
  const response = (await appsync.graphql<TagsByCategoryResponse>({
    query: GET_TAG_BY_CATEGORY,
    variables: { category },
  })) as GraphQLResult<TagsByCategoryResponse>;

  if (response.errors && response.errors.length > 0) {
    throw new Error(response.errors[0].message);
  }

  // Check if data exists
  if (!response.data) {
    throw new Error("No data returned from query");
  }

  return response.data.listByCategory.items.map((d) => {
    return {
      name: d.name,
      description: d.description,
      category: d.category,
    } as Tag;
  });
}

export async function getTag(name: string): Promise<Tag | undefined> {
  const GET_TAG_WITH_COUNTS = `
  query GetTagWithCounts($name: String!) {
    getTag(name: $name) {
      category
      description
      name
      prompts {
        items {
          promptId
        }
      }
      rules {
        items {
          ruleId
        }
      }
    }
  }
`;

  try {
    // Execute raw GraphQL query
    const result = (await appsync.graphql({
      query: GET_TAG_WITH_COUNTS,
      variables: {
        name: name,
      },
    })) as GraphQLResult<TagWithCountResponse>;

    const tag = result.data.getTag;

    if (!tag) {
      return;
    }

    // Calculate counts from the response
    const promptCount = tag.prompts?.items?.length || 0;
    const ruleCount = tag.rules?.items.length || 0;

    return {
      name: tag.name,
      category: tag.category,
      description: tag.description,
      promptCount,
      ruleCount,
    } as Tag;
  } catch (error) {
    console.error("Error fetching tag with counts:", error);
    throw error;
  }
}
