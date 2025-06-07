import { MetadataRoute } from "next";
import { cookies } from "next/headers";
import outputs from "../amplify_outputs.json";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";
import { Schema } from "../amplify/data/resource";

const appsync = generateServerClientUsingCookies<Schema>({
  config: outputs,
  cookies,
});

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://promptz.dev";

  const prompts = [];
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

  // Generate sitemap entries for static pages changing on a monthly bases
  const monthlyRoutes = ["/mcp"].map((route) => ({
    url: `${baseUrl}${route}`,
    changeFrequency: "monthly" as const,
    priority: 0.3,
  }));

  return [...routes, ...promptRoutes, ...monthlyRoutes];
}
