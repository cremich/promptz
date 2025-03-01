"use server";
import { cookies } from "next/headers";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";

import { type Schema } from "@/amplify/data/resource";
import outputs from "@/amplify_outputs.json";
import { Prompt, searchParamsSchema } from "@/app/lib/definitions";
import { SearchParams } from "next/dist/server/request/search-params";
import console from "console";

const appsync = generateServerClientUsingCookies<Schema>({
  config: outputs,
  cookies,
});

export async function fetchFeaturedPrompts(): Promise<Prompt[]> {
  const { data: prompts, errors } = await appsync.models.prompt.list({
    limit: 3,
    filter: {
      public: { eq: true },
    },
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return mapToPrompts(prompts);
}

export async function fetchPrompt(id: string) {
  const { data: prompt, errors } = await appsync.models.prompt.get({
    id,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!prompt) {
    throw new Error("Prompt not found");
  }

  return mapToPrompt(prompt);
}

interface FetchPromptsResult {
  prompts: Prompt[];
  nextToken?: string | null;
}

export async function searchPrompts(
  params: SearchParams,
): Promise<FetchPromptsResult> {
  try {
    // Validate search params
    const validatedParams = searchParamsSchema.parse(params);
    // Build filter based on search params
    const filter: Record<string, any> = {
      public: { eq: true },
    };

    if (validatedParams.query) {
      const sentenceCase =
        validatedParams.query.charAt(0).toUpperCase() +
        validatedParams.query.slice(1).toLowerCase();
      filter.or = [
        { name: { contains: validatedParams.query.toLowerCase() } },
        { name: { contains: validatedParams.query.toUpperCase() } },
        { name: { contains: sentenceCase } },
        { description: { contains: validatedParams.query.toLowerCase() } },
        { description: { contains: validatedParams.query.toUpperCase() } },
        { description: { contains: sentenceCase } },
      ];
    }

    if (params.interface) {
      const interfaces = Array.isArray(params.interface)
        ? params.interface
        : [params.interface];
      interfaces.length > 0 &&
        (filter.and = interfaces.map((i) => {
          return {
            tags: {
              contains: i,
            },
          };
        }));
    }

    if (params.category) {
      const categories = Array.isArray(params.category)
        ? params.category
        : [params.category];

      categories.length > 0 &&
        (filter.and = categories.map((i) => {
          return {
            tags: {
              contains: i,
            },
          };
        }));
    }

    if (params.sdlc) {
      const sdlc = Array.isArray(params.sdlc) ? params.sdlc : [params.sdlc];
      sdlc.length > 0 &&
        (filter.and = sdlc.map((i) => {
          return {
            tags: {
              contains: i,
            },
          };
        }));
    }

    const {
      data: prompts,
      errors,
      nextToken,
    } = await appsync.models.prompt.list({
      filter,
      limit: 1000,
    });

    if (errors && errors.length > 0) {
      throw new Error(errors[0].message);
    }

    // Map the prompts to our frontend model
    let promptList = mapToPrompts(prompts);

    const sortParam = validatedParams.sort || "created_at:desc";
    const [sortField, sortDirection] = sortParam.split(":");
    console.log("sortField", sortParam);
    // Sort the results in-memory
    if (sortField === "created_at") {
      promptList = promptList.sort((a, b) => {
        const aDate = new Date(a.createdAt || "").getTime();
        const bDate = new Date(b.createdAt || "").getTime();
        return sortDirection === "asc" ? aDate - bDate : bDate - aDate;
      });
    }

    return {
      prompts: promptList,
      nextToken,
    };
  } catch (error) {
    console.error("Error fetching prompts:", error);
    throw error;
  }
}

function mapToPrompt(prompt: Schema["prompt"]["type"]): Prompt {
  // Create an array of potential tags
  const mappedTags: (string | null | undefined)[] = [
    prompt.category,
    prompt.sdlc_phase,
    prompt.interface,
  ];

  // Use the provided tags if they exist, otherwise use the mapped tags
  const finalTags: string[] = (prompt.tags || mappedTags).filter(
    (tag): tag is NonNullable<typeof tag> => tag != null,
  );

  return {
    id: prompt.id,
    title: prompt.name,
    description: prompt.description,
    tags: finalTags,
    author: prompt.owner_username,
    authorId: prompt.owner || "",
    instruction: prompt.instruction,
    howto: prompt.howto || "",
    public: prompt.public || false,
    createdAt: prompt.createdAt || "",
    updatedAt: prompt.updatedAt || "",
  };
}

function mapToPrompts(prompts: Schema["prompt"]["type"][]): Prompt[] {
  return prompts.map(mapToPrompt);
}
