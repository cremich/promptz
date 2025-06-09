"use server";
import { cookies } from "next/headers";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";
import { type Schema } from "../../amplify/data/resource";
import outputs from "../../amplify_outputs.json";
import { z } from "zod";
import {
  ModelProvider,
  modelProviderSearchParamsSchema,
} from "@/lib/models/modelProvider-model";

interface FetchModelProvidersResult {
  modelProviders: ModelProvider[];
  nextToken?: string | null;
}

type SearchSchema = z.output<typeof modelProviderSearchParamsSchema>;

const appsync = generateServerClientUsingCookies<Schema>({
  config: outputs,
  cookies,
});

export async function searchModelProviders(
  params: SearchSchema,
): Promise<FetchModelProvidersResult> {
  try {
    // Validate search params
    const validatedParams = modelProviderSearchParamsSchema.parse(params);

    const { data: searchResults, errors } =
      await appsync.queries.searchModelProviders({
        query: validatedParams.query,
      });

    if (errors && errors.length > 0) {
      throw new Error(errors[0].message);
    }

    if (!searchResults?.results) {
      return {
        modelProviders: [],
        nextToken: undefined,
      };
    }

    // Map the modelProviders to our frontend model
    let modelProviderList = searchResults?.results
      ?.filter((p) => p != null)
      .map((p) => {
        return {
          id: p.id || "",
          name: p.name || "",
          description: p.description || "",
          slug: p.slug || "",
          createdAt: p.createdAt || "",
          updatedAt: p.updatedAt || "",
        } as ModelProvider;
      });

    const sortParam = validatedParams.sort || "created_at:desc";
    const [sortField, sortDirection] = sortParam.split(":");

    if (sortField === "created_at") {
      modelProviderList = modelProviderList.sort((a, b) => {
        const aDate = new Date(a.createdAt || "").getTime();
        const bDate = new Date(b.createdAt || "").getTime();
        return sortDirection === "asc" ? aDate - bDate : bDate - aDate;
      });
    }

    return {
      modelProviders: modelProviderList,
      nextToken: searchResults.nextToken,
    };
  } catch (error) {
    console.error("Error fetching modelProviders:", error);
    throw error;
  }
}
