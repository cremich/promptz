"use server";
import { cookies } from "next/headers";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";
import { type Schema } from "../../amplify/data/resource";
import outputs from "../../amplify_outputs.json";
import { z } from "zod";
import { normalizeTags } from "../utils";
import { Agent, agentSearchParamsSchema } from "@/lib/models/agent-model";

interface FetchAgentsResult {
  agents: Agent[];
  nextToken?: string | null;
}

type SearchSchema = z.output<typeof agentSearchParamsSchema>;

const appsync = generateServerClientUsingCookies<Schema>({
  config: outputs,
  cookies,
});

export async function searchAgents(
  params: SearchSchema,
): Promise<FetchAgentsResult> {
  try {
    // Validate search params
    const validatedParams = agentSearchParamsSchema.parse(params);

    // Normalize tags to always be an array or undefined
    const normalizedTags = normalizeTags(validatedParams.tags || []);

    const { data: searchResults, errors } = await appsync.queries.searchAgents({
      query: validatedParams.query,
      tags: normalizedTags,
    });

    if (errors && errors.length > 0) {
      throw new Error(errors[0].message);
    }

    if (!searchResults?.results) {
      return {
        agents: [],
        nextToken: undefined,
      };
    }

    // Map the agents to our frontend model
    let agentList = searchResults?.results
      ?.filter((a) => a != null)
      .map((a) => {
        return {
          id: a.id || "",
          name: a.name || "",
          description: a.description || "",
          slug: a.slug || "",
          tags: a.tags,
          createdAt: a.createdAt || "",
          updatedAt: a.updatedAt || "",
          copyCount: a.copyCount || 0,
          downloadCount: a.downloadCount || 0,
        } as Agent;
      });

    const sortParam = validatedParams.sort || "created_at:desc";
    const [sortField, sortDirection] = sortParam.split(":");

    if (sortField === "created_at") {
      agentList = agentList.sort((a, b) => {
        const aDate = new Date(a.createdAt || "").getTime();
        const bDate = new Date(b.createdAt || "").getTime();
        return sortDirection === "asc" ? aDate - bDate : bDate - aDate;
      });
    }

    if (sortField === "trending") {
      agentList = agentList.sort((a, b) => {
        const aCount = (a.copyCount || 0) + (a.downloadCount || 0);
        const bCount = (b.copyCount || 0) + (b.downloadCount || 0);
        return bCount - aCount;
      });
    }

    return {
      agents: agentList,
      nextToken: searchResults.nextToken,
    };
  } catch (error) {
    console.error("Error fetching agents:", error);
    throw error;
  }
}
