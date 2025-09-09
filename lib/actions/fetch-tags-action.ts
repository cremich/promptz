"use server";
import { cookies } from "next/headers";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";
import { type Schema } from "../../amplify/data/resource";
import outputs from "../../amplify_outputs.json";
import { Tag } from "@/lib/models/tags-model";
import { GraphQLResult } from "aws-amplify/api";
import { Prompt } from "@/lib/models/prompt-model";
import { ProjectRule } from "@/lib/models/project-rule-model";
import { Agent } from "@/lib/models/agent-model";

interface TagsByCategoryResponse {
  listTagsByCategory: {
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
    agents: {
      items: [
        {
          agentId: string;
        },
      ];
    };
  };
}

interface TagWithRelationsResponse {
  getTag: {
    name?: string;
    description?: string;
    category?: string;
    prompts: {
      items: [
        {
          prompt: {
            name: string;
            scope: string;
            description: string;
            tags: string[];
            id: string;
            createdAt: string;
            updatedAt: string;
            copyCount: number;
            downloadCount: number;
            slug: string;
            sourceURL: string;
          };
        },
      ];
    };
    rules: {
      items: [
        {
          rule: {
            name: string;
            scope: string;
            description: string;
            tags: string[];
            id: string;
            createdAt: string;
            updatedAt: string;
            copyCount: number;
            downloadCount: number;
            slug: string;
            sourceURL: string;
          };
        },
      ];
    };
    agents: {
      items: [
        {
          agent: {
            name: string;
            scope: string;
            description: string;
            tags: string[];
            id: string;
            createdAt: string;
            updatedAt: string;
            copyCount: number;
            downloadCount: number;
            slug: string;
            sourceURL: string;
            tools: string[];
            author: {
              id?: string;
              displayName?: string;
            };
          };
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
    listTagsByCategory(category: $category) {
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

  return response.data.listTagsByCategory.items.map((d) => {
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
      agents {
        items {
          agentId
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
    const agentCount = tag.agents?.items?.length || 0;

    return {
      name: tag.name,
      category: tag.category,
      description: tag.description,
      promptCount,
      ruleCount,
      agentCount,
    } as Tag;
  } catch (error) {
    console.error("Error fetching tag with counts:", error);
    throw error;
  }
}

/**
 * Fetches prompts, rules, and agents associated with a specific tag
 * @param tagName - Name of the tag to filter by
 * @returns Promise containing prompts, rules, agents and tags
 */
export async function getPromptsRulesAndAgentsByTag(tagName: string): Promise<{
  prompts: Prompt[];
  rules: ProjectRule[];
  agents: Agent[];
  tag?: Tag;
}> {
  const GET_TAG_WITH_RELATIONS = `
  query GetTagWithRelations($name: String!) {
    getTag(name: $name) {
      category
      description
      name
      prompts {
        items {
          prompt {
            name
            scope
            description
            tags
            id
            createdAt
            updatedAt
            copyCount
            downloadCount
            slug
            sourceURL
          }
        }
      }
      rules {
        items {
           rule {
            name
            scope
            description
            tags
            id
            createdAt
            updatedAt
            copyCount
            downloadCount
            slug
            sourceURL
          }
        }
      }
      agents {
        items {
          agent {
            name
            scope
            description
            tags
            id
            createdAt
            updatedAt
            copyCount
            downloadCount
            slug
            sourceURL
            tools
            author {
              id
              displayName
            }
          }
        }
      }
    }
  }
`;

  try {
    const result = (await appsync.graphql({
      query: GET_TAG_WITH_RELATIONS,
      variables: {
        name: tagName,
      },
    })) as GraphQLResult<TagWithRelationsResponse>;

    if (result.errors && result.errors.length > 0) {
      throw new Error(result.errors[0].message);
    }

    if (!result.data) {
      return {
        prompts: [],
        rules: [],
        agents: [],
        tag: undefined,
      };
    }

    const tag = result.data.getTag;

    const prompts = tag.prompts.items
      .filter((p) => p.prompt.scope === "PUBLIC")
      .map((p) => {
        return {
          name: p.prompt.name,
          scope: p.prompt.scope,
          description: p.prompt.description,
          tags: p.prompt.tags,
          id: p.prompt.id,
          createdAt: p.prompt.createdAt,
          updatedAt: p.prompt.updatedAt,
          copyCount: p.prompt.copyCount || 0,
          downloadCount: p.prompt.downloadCount || 0,
          slug: p.prompt.slug,
          sourceURL: p.prompt.sourceURL,
        } as Prompt;
      });

    const rules = tag.rules.items
      .filter((r) => r.rule.scope === "PUBLIC")
      .map((r) => {
        return {
          name: r.rule.name,
          scope: r.rule.scope,
          description: r.rule.description,
          tags: r.rule.tags,
          id: r.rule.id,
          createdAt: r.rule.createdAt,
          updatedAt: r.rule.updatedAt,
          copyCount: r.rule.copyCount || 0,
          downloadCount: r.rule.downloadCount || 0,
          slug: r.rule.slug,
          sourceURL: r.rule.sourceURL,
        } as ProjectRule;
      });

    const agents = tag.agents.items
      .filter((a) => a.agent.scope === "PUBLIC")
      .map((a) => {
        return {
          name: a.agent.name,
          scope: a.agent.scope,
          description: a.agent.description,
          tags: a.agent.tags,
          id: a.agent.id,
          createdAt: a.agent.createdAt,
          updatedAt: a.agent.updatedAt,
          copyCount: a.agent.copyCount || 0,
          downloadCount: a.agent.downloadCount || 0,
          slug: a.agent.slug,
          sourceURL: a.agent.sourceURL,
          tools: a.agent.tools,
          author: a.agent.author ? a.agent.author.displayName : "",
          authorId: a.agent.author ? a.agent.author.id : "",
        } as Agent;
      });

    return {
      tag: {
        name: tag.name || "",
        description: tag.description || "",
      },
      prompts: prompts,
      rules: rules,
      agents: agents,
    };
  } catch (error) {
    console.error("Error fetching content by tag:", error);
    throw error;
  }
}

/**
 * Fetches prompts and rules associated with a specific tag (backward compatibility)
 * @param tagName - Name of the tag to filter by
 * @returns Promise containing prompts, rules and tags
 */
export async function getPromptsAndRulesByTag(tagName: string): Promise<{
  prompts: Prompt[];
  rules: ProjectRule[];
  tag?: Tag;
}> {
  const result = await getPromptsRulesAndAgentsByTag(tagName);
  return {
    prompts: result.prompts,
    rules: result.rules,
    tag: result.tag,
  };
}

/**
 * Fetches all available tags for sitemap generation
 * @returns Promise<string[]> - Array of all tag names
 */
export async function getAllTags(): Promise<string[]> {
  const categories = [
    "SDLC",
    "Interface",
    "Language",
    "Agent",
    "Framework",
    "IaC",
    "Misc",
  ];
  const allTags: string[] = [];

  try {
    for (const category of categories) {
      const tags = await fetchTagsByCategory(category);
      allTags.push(...tags.map((tag) => tag.name).filter(Boolean));
    }

    // Remove duplicates and return sorted array
    return allTags;
  } catch (error) {
    console.error("Error fetching all tags:", error);
    return [];
  }
}
