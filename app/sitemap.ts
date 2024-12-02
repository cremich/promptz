import { ServerSideAppsyncRepository } from "@/repositories/ServerSideAppsyncRepository";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://promptz.dev";
  const repository = new ServerSideAppsyncRepository();

  const prompts = [];
  let nextToken = undefined;
  do {
    const result = await repository.listPrompts(100, undefined, nextToken);
    prompts.push(...result.prompts);
    nextToken = result.nextToken;
  } while (nextToken);

  // Generate sitemap entries for static pages
  const routes = ["", "/browse"].map((route) => ({
    url: `${baseUrl}${route}`,
    changeFrequency: "monthly" as const,
    priority: 1,
  }));

  // Add entries for each prompt
  const promptRoutes = prompts.map((prompt) => ({
    url: `${baseUrl}/prompt/${prompt.id}`,
    lastModified: prompt.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...routes, ...promptRoutes];
}
