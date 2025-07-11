import { MetadataRoute } from "next";
import { cookies } from "next/headers";
import outputs from "../amplify_outputs.json";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";
import { Schema } from "../amplify/data/resource";
import { getAllTags } from "@/lib/actions/fetch-tags-action";

const appsync = generateServerClientUsingCookies<Schema>({
  config: outputs,
  cookies,
});

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://promptz.dev";

  const prompts = [];
  const projectRules = [];
  let cursor: string | undefined | null;
  let hasMorePages: boolean = true;
  do {
    const { data: searchResults } = await appsync.queries.searchPrompts({
      nextToken: cursor,
    });
    if (searchResults?.results) {
      prompts.push(...searchResults?.results);
    }

    if (searchResults?.nextToken) {
      cursor = searchResults.nextToken;
    } else {
      hasMorePages = false;
    }
  } while (hasMorePages);

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

  const tags = await getAllTags();

  // Generate sitemap entries for static pages changing on a weekly bases
  const routes = ["", "/prompts"].map((route) => ({
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
    ...tagRoutes,
    ...monthlyRoutes,
  ];
}
