import { MetadataRoute } from "next";
import { cookies } from "next/headers";
import outputs from "../amplify_outputs.json";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";
import { Schema } from "../amplify/data/resource";
import { getAllTags } from "@/lib/actions/fetch-tags-action";
import promptIndex from "@/data/prompt-index.json";

const appsync = generateServerClientUsingCookies<Schema>({
  config: outputs,
  cookies,
});

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://promptz.dev";

  // Get prompts from markdown index
  const prompts = promptIndex.prompts;
  const projectRules = [];
  const agents = [];
  let cursor: string | undefined | null;
  let hasMorePages: boolean = true;

  // Fetch all project rules
  cursor = undefined;
  hasMorePages = true;

  // Fetch all project rules
  do {
    const { data: rulesResults } = await appsync.queries.searchProjectRules({
      nextToken: cursor,
    });
    if (rulesResults?.results) {
      projectRules.push(...rulesResults?.results);
    }

    if (rulesResults?.nextToken) {
      cursor = rulesResults.nextToken;
    } else {
      hasMorePages = false;
    }
  } while (hasMorePages);

  // Fetch all agents
  cursor = undefined;
  hasMorePages = true;

  // Fetch all agents
  do {
    const { data: agentsResults } = await appsync.queries.searchAgents({
      nextToken: cursor,
    });
    if (agentsResults?.results) {
      agents.push(...agentsResults?.results);
    }

    if (agentsResults?.nextToken) {
      cursor = agentsResults.nextToken;
    } else {
      hasMorePages = false;
    }
  } while (hasMorePages);

  const tags = await getAllTags();

  // Generate sitemap entries for static pages changing on a weekly bases
  const routes = ["", "/prompts", "/agents"].map((route) => ({
    url: `${baseUrl}${route}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Add entries for each prompt
  const promptRoutes = prompts
    .filter((p) => p != null)
    .map((prompt) => ({
      url: `${baseUrl}/prompts/prompt/${prompt.slug}`,
      lastModified: prompt.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 1,
    }));

  const rulesRoutes = projectRules
    .filter((p) => p != null)
    .map((rule) => ({
      url: `${baseUrl}/rules/rule/${rule.slug}`,
      lastModified: rule.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 1,
    }));

  // Add entries for each agent
  const agentRoutes = agents
    .filter((a) => a != null)
    .map((agent) => ({
      url: `${baseUrl}/agents/agent/${agent.slug}`,
      lastModified: agent.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 1,
    }));

  //Add entries for each tag
  const tagRoutes = tags.map((t) => ({
    url: `${baseUrl}/tag/${t}`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Generate sitemap entries for static pages changing on a monthly bases
  const monthlyRoutes = ["/mcp"].map((route) => ({
    url: `${baseUrl}${route}`,
    changeFrequency: "monthly" as const,
    priority: 0.3,
  }));

  return [
    ...routes,
    ...promptRoutes,
    ...rulesRoutes,
    ...agentRoutes,
    ...tagRoutes,
    ...monthlyRoutes,
  ];
}
