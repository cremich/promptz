"use server";
import { z } from "zod";
import { Prompt, promptSearchParamsSchema } from "@/lib/models/prompt-model";
import promptIndex from "@/data/prompt-index.json";

interface FetchPromptsResult {
  prompts: Prompt[];
  nextToken?: string | null;
}

type SearchSchema = z.output<typeof promptSearchParamsSchema>;

export async function searchPrompts(
  params: SearchSchema,
): Promise<FetchPromptsResult> {
  try {
    // Validate search params
    const validatedParams = promptSearchParamsSchema.parse(params);

    let filteredPrompts = promptIndex.prompts as Prompt[];

    // Filter by query (search in title, description, content)
    if (validatedParams.query) {
      const query = validatedParams.query.toLowerCase();
      filteredPrompts = filteredPrompts.filter(
        (prompt) =>
          prompt.name?.toLowerCase().includes(query) ||
          prompt.description?.toLowerCase().includes(query) ||
          prompt.content?.toLowerCase().includes(query),
      );
    }

    // Filter by tags
    if (validatedParams.tags && validatedParams.tags.length > 0) {
      const normalizedTags = Array.isArray(validatedParams.tags)
        ? validatedParams.tags
        : [validatedParams.tags];

      filteredPrompts = filteredPrompts.filter((prompt) =>
        normalizedTags.some((tag) =>
          prompt.tags?.some(
            (promptTag) => promptTag.toLowerCase() === tag.toLowerCase(),
          ),
        ),
      );
    }

    // Sort results
    const sortParam = validatedParams.sort || "created_at:desc";
    const [sortField, sortDirection] = sortParam.split(":");

    if (sortField === "created_at") {
      filteredPrompts = filteredPrompts.sort((a, b) => {
        const aDate = new Date(a.createdAt || "").getTime();
        const bDate = new Date(b.createdAt || "").getTime();
        return sortDirection === "asc" ? aDate - bDate : bDate - aDate;
      });
    }

    if (sortField === "trending") {
      filteredPrompts = filteredPrompts.sort((a, b) => {
        const aCount = a.copyCount || 0;
        const bCount = b.copyCount || 0;
        return bCount - aCount;
      });
    }

    return {
      prompts: filteredPrompts,
      nextToken: undefined, // No pagination for markdown-based prompts
    };
  } catch (error) {
    console.error("Error searching prompts:", error);
    throw error;
  }
}
