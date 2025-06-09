"use server";
import { cookies } from "next/headers";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";
import { type Schema } from "../../amplify/data/resource";
import outputs from "../../amplify_outputs.json";
import { z } from "zod";
import { Model, modelSearchParamsSchema } from "@/lib/models/model-model";

interface FetchModelResult {
  model: Model[];
  nextToken?: string | null;
}

type SearchSchema = z.output<typeof modelSearchParamsSchema>;

const appsync = generateServerClientUsingCookies<Schema>({
  config: outputs,
  cookies,
});

export async function searchModel(
  params: SearchSchema,
): Promise<FetchModelResult> {
  try {
    // Validate search params
    const validatedParams = modelSearchParamsSchema.parse(params);

    const { data: searchResults, errors } = await appsync.queries.searchModels({
      query: validatedParams.query,
    });

    if (errors && errors.length > 0) {
      throw new Error(errors[0].message);
    }

    if (!searchResults?.results) {
      return {
        model: [],
        nextToken: undefined,
      };
    }

    // Map the model to our frontend model
    let modelList = searchResults?.results
      ?.filter((p) => p != null)
      .map((p) => {
        return {
          id: p.id || "",
          name: p.name || "",
          description: p.description || "",
          slug: p.slug || "",
          createdAt: p.createdAt || "",
          updatedAt: p.updatedAt || "",
        } as Model;
      });

    const sortParam = validatedParams.sort || "created_at:desc";
    const [sortField, sortDirection] = sortParam.split(":");

    if (sortField === "created_at") {
      modelList = modelList.sort((a, b) => {
        const aDate = new Date(a.createdAt || "").getTime();
        const bDate = new Date(b.createdAt || "").getTime();
        return sortDirection === "asc" ? aDate - bDate : bDate - aDate;
      });
    }

    return {
      model: modelList,
      nextToken: searchResults.nextToken,
    };
  } catch (error) {
    console.error("Error fetching model:", error);
    throw error;
  }
}
