"use server";
import { Prompt } from "@/lib/models/prompt-model";
import promptIndex from "@/data/prompt-index.json";

export async function fetchPromptBySlug(
  slug: string,
): Promise<Prompt | undefined> {
  const prompt = promptIndex.prompts.find((p: Prompt) => p.slug === slug);

  if (!prompt) {
    return undefined;
  }

  return {
    id: prompt.id,
    name: prompt.name,
    slug: prompt.slug,
    description: prompt.description,
    tags: prompt.tags,
    content: prompt.content,
    sourceURL: prompt.sourceURL,
    howto: prompt.howto,
    scope: prompt.scope,
    copyCount: prompt.copyCount,
    downloadCount: prompt.downloadCount,
    author: prompt.author,
    authorId: undefined, // Not available in markdown prompts
    createdAt: prompt.createdAt,
    updatedAt: prompt.updatedAt,
    starCount: prompt.starCount,
    popularityScore: prompt.popularityScore,
  } as Prompt;
}
