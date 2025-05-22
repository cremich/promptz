"use server";
import { cookies } from "next/headers";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";
import { type Schema } from "../../amplify/data/resource";
import outputs from "../..//amplify_outputs.json";
import { z } from "zod";
import { normalizeTags } from "../utils";
import {
  ProjectRule,
  projectRuleSearchParamsSchema,
} from "@/lib/models/project-rule-model";

interface FetchProjectRulesResult {
  projectRules: ProjectRule[];
  nextToken?: string | null;
}

type SearchSchema = z.output<typeof projectRuleSearchParamsSchema>;

const appsync = generateServerClientUsingCookies<Schema>({
  config: outputs,
  cookies,
});

/**
 * Searches for project rules based on provided parameters
 * @param params Search parameters for filtering project rules
 * @returns Object containing project rules and next token for pagination
 */
export async function searchProjectRules(
  params: SearchSchema,
): Promise<FetchProjectRulesResult> {
  try {
    // Validate search params
    const validatedParams = projectRuleSearchParamsSchema.parse(params);

    const normalizedTags = normalizeTags(validatedParams.tags || []);

    const { data: searchResults, errors } =
      await appsync.queries.searchProjectRules({
        query: validatedParams.query,
        tags: normalizedTags,
      });

    if (errors && errors.length > 0) {
      throw new Error(errors[0].message);
    }

    if (!searchResults?.results) {
      return {
        projectRules: [],
        nextToken: undefined,
      };
    }

    // Map the project rules to our frontend model
    let projectRulesList = searchResults?.results
      ?.filter((p) => p != null)
      .map((p) => {
        return {
          id: p.id || "",
          title: p.name || "",
          description: p.description || "",
          tags: p.tags,
          slug: p.slug || "",
          createdAt: p.createdAt || "",
          updatedAt: p.updatedAt || "",
        } as ProjectRule;
      });

    const sortParam = validatedParams.sort || "created_at:desc";
    const [sortField, sortDirection] = sortParam.split(":");

    if (sortField === "created_at") {
      projectRulesList = projectRulesList.sort((a, b) => {
        const aDate = new Date(a.createdAt || "").getTime();
        const bDate = new Date(b.createdAt || "").getTime();
        return sortDirection === "asc" ? aDate - bDate : bDate - aDate;
      });
    }

    return {
      projectRules: projectRulesList,
      nextToken: searchResults.nextToken,
    };
  } catch (error) {
    console.error("Error fetching project rules:", error);
    throw error;
  }
}
