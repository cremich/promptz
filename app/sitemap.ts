import { MetadataRoute } from "next";
import { cookies } from "next/headers";
import outputs from "@/amplify_outputs.json";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";
import { Schema } from "@/amplify/data/resource";

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
    const { data: p, nextToken } = await appsync.models.prompt.list({
      limit: 1000,
      filter: {
        public: { eq: true },
      },
      nextToken: cursor,
    });
    prompts.push(...p);

    if (nextToken) {
      cursor = nextToken;
    } else {
      hasMorePages = false;
    }
  } while (hasMorePages);

  // Generate sitemap entries for static pages
  const routes = ["", "/prompts"].map((route) => ({
    url: `${baseUrl}${route}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Add entries for each prompt
  const promptRoutes = prompts.map((prompt) => ({
    url: `${baseUrl}/prompts/prompt/${prompt.slug}`,
    lastModified: prompt.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 1,
  }));

  return [...routes, ...promptRoutes];
}
