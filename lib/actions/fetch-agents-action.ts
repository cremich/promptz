"use server";
import { cookies } from "next/headers";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";

import { type Schema } from "../../amplify/data/resource";
import outputs from "../../amplify_outputs.json";
import { GraphQLResult } from "aws-amplify/api";
import { Agent } from "@/lib/models/agent-model";

interface AgentBySlugResponse {
  listAgentBySlug: {
    items: {
      id?: string;
      name?: string;
      slug?: string;
      description?: string;
      tags?: string[];
      prompt?: string;
      tools?: string[];
      mcpServers?: any;
      resources?: string[];
      hooks?: any;
      toolsSettings?: any;
      toolAliases?: any;
      allowedTools?: string[];
      useLegacyMcpJson?: boolean;
      sourceURL?: string;
      howto?: string;
      scope?: string;
      author: {
        id?: string;
        displayName?: string;
      };
      createdAt?: string;
      updatedAt?: string;
      copyCount?: number;
      downloadCount?: number;
    }[];
    nextToken?: string;
  };
}

const appsync = generateServerClientUsingCookies<Schema>({
  config: outputs,
  cookies,
});

export async function fetchAgentBySlug(slug: string) {
  const GET_AGENT_BY_SLUG = `
  query ListAgents($slug: String!) {
    listAgentBySlug(slug: $slug) {
      items {
        id
        name
        slug
        description
        tags
        prompt
        tools
        mcpServers
        resources
        hooks
        toolsSettings
        toolAliases
        allowedTools
        useLegacyMcpJson
        sourceURL
        howto
        scope
        author {
          id
          displayName
        }
        createdAt
        updatedAt
        copyCount
        downloadCount
      }
    }
  }
`;

  // we have to use the raw graphql client as the type generation for
  // queries with secondary indexes is buggy and results in an error of invalid
  // type matching of filters.
  const response = (await appsync.graphql<AgentBySlugResponse>({
    query: GET_AGENT_BY_SLUG,
    variables: { slug: slug },
  })) as GraphQLResult<AgentBySlugResponse>;

  // Check if data exists
  if (!response.data) {
    throw new Error("No data returned from query");
  }

  const agent = response.data.listAgentBySlug.items[0];

  if (!agent) {
    return;
  }

  return {
    id: agent.id,
    name: agent.name,
    slug: agent.slug,
    description: agent.description,
    tags: agent.tags,
    prompt: agent.prompt,
    tools: agent.tools,
    mcpServers: agent.mcpServers ? JSON.parse(agent.mcpServers) : {},
    resources: agent.resources,
    hooks: agent.hooks ? JSON.parse(agent.hooks) : {},
    toolsSettings: agent.toolsSettings ? JSON.parse(agent.toolsSettings) : {},
    toolAliases: agent.toolAliases ? JSON.parse(agent.toolAliases) : {},
    allowedTools: agent.allowedTools,
    useLegacyMcpJson: agent.useLegacyMcpJson,
    sourceURL: agent.sourceURL,
    howto: agent.howto,
    scope: agent.scope,
    author: agent.author ? agent.author.displayName : "",
    authorId: agent.author ? agent.author.id : "",
    createdAt: agent.createdAt,
    updatedAt: agent.updatedAt,
    copyCount: agent.copyCount || 0,
    downloadCount: agent.downloadCount || 0,
  } as Agent;
}
