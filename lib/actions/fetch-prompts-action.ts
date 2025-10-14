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

  return prompt as Prompt;
}
