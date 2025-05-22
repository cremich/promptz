"use server";
import { cookies } from "next/headers";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";
import { type Schema } from "../../amplify/data/resource";
import outputs from "../../amplify_outputs.json";
import { z } from "zod";
import { normalizeTags } from "../utils";
import { Prompt, promptSearchParamsSchema } from "@/lib/models/prompt-model";

interface FetchPromptsResult {
  prompts: Prompt[];
  nextToken?: string | null;
}

type SearchSchema = z.output<typeof promptSearchParamsSchema>;

const appsync = generateServerClientUsingCookies<Schema>({
  config: outputs,
  cookies,
});

export async function searchPrompts(
  params: SearchSchema,
): Promise<FetchPromptsResult> {
  try {
    // Validate search params
    const validatedParams = promptSearchParamsSchema.parse(params);

    // Normalize tags to always be an array or undefined
    const normalizedTags = normalizeTags(validatedParams.tags || []);

    const { data: searchResults, errors } = await appsync.queries.searchPrompts(
      {
        query: validatedParams.query,
        tags: normalizedTags,
      },
    );

    if (errors && errors.length > 0) {
      throw new Error(errors[0].message);
    }

    if (!searchResults?.results) {
      return {
        prompts: [],
        nextToken: undefined,
      };
    }

    // Map the prompts to our frontend model
    let promptList = searchResults?.results
      ?.filter((p) => p != null)
      .map((p) => {
        return {
          id: p.id || "",
          title: p.name || "",
          description: p.description || "",
          slug: p.slug || "",
          tags: p.tags,
          createdAt: p.createdAt || "",
          updatedAt: p.updatedAt || "",
        } as Prompt;
      });

    const sortParam = validatedParams.sort || "created_at:desc";
    const [sortField, sortDirection] = sortParam.split(":");

    if (sortField === "created_at") {
      promptList = promptList.sort((a, b) => {
        const aDate = new Date(a.createdAt || "").getTime();
        const bDate = new Date(b.createdAt || "").getTime();
        return sortDirection === "asc" ? aDate - bDate : bDate - aDate;
      });
    }

    return {
      prompts: promptList,
      nextToken: searchResults.nextToken,
    };
  } catch (error) {
    console.error("Error fetching prompts:", error);
    throw error;
  }
}
