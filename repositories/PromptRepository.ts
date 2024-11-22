import { PromptViewModel } from "@/models/PromptViewModel";
import { generateClient } from "aws-amplify/api";
import type { Schema } from "../amplify/data/resource";
import { PromptViewModelCollection } from "@/models/PromptViewModelCollection";

export type FacetType = "OWNER" | "CATEGORY" | "SDLC_PHASE" | "SEARCH";

export type Facets = {
  facet: FacetType;
  value: string;
};

export interface PromptRepository {
  getPrompt(id: string): Promise<PromptViewModel>;
  listPrompts(
    limit?: number,
    facets?: Array<Facets>,
  ): Promise<PromptViewModelCollection>;
  createPrompt(prompt: PromptViewModel): Promise<PromptViewModel>;
  updatePrompt(prompt: PromptViewModel): Promise<PromptViewModel>;
  deletePrompt(prompt: PromptViewModel): Promise<PromptViewModel>;
}

export class PromptGraphQLRepository implements PromptRepository {
  client;
  constructor() {
    this.client = generateClient<Schema>();
  }

  async updatePrompt(prompt: PromptViewModel): Promise<PromptViewModel> {
    const { data: createdPrompt, errors } =
      await this.client.models.prompt.update(
        {
          id: prompt.id,
          name: prompt.name,
          description: prompt.description,
          sdlc_phase: prompt.sdlcPhase,
          category: prompt.category,
          instruction: prompt.instruction,
          howto: prompt.howto,
        },
        {
          authMode: "userPool",
        },
      );
    if (errors && errors.length > 0) {
      throw new Error(errors[0].message);
    }
    return PromptViewModel.fromSchema(createdPrompt!);
  }

  async createPrompt(prompt: PromptViewModel): Promise<PromptViewModel> {
    const { data: createdPrompt, errors } =
      await this.client.models.prompt.create(
        {
          name: prompt.name,
          description: prompt.description,
          sdlc_phase: prompt.sdlcPhase,
          category: prompt.category,
          instruction: prompt.instruction,
          howto: prompt.howto,
          owner_username: prompt.ownerUsername,
        },
        {
          authMode: "userPool",
        },
      );
    if (errors && errors.length > 0) {
      throw new Error(errors[0].message);
    }
    return PromptViewModel.fromSchema(createdPrompt!);
  }

  async getPrompt(id: string) {
    const { data: prompt, errors } = await this.client.models.prompt.get({
      id: id,
    });

    if (errors && errors.length > 0) {
      throw new Error(errors[0].message);
    }
    if (prompt) {
      return PromptViewModel.fromSchema(prompt);
    } else {
      throw new Error("Prompt not found");
    }
  }

  async deletePrompt(prompt: PromptViewModel): Promise<PromptViewModel> {
    const { errors } = await this.client.models.prompt.delete(
      {
        id: prompt.id,
      },
      {
        authMode: "userPool",
      },
    );
    if (errors && errors.length > 0) {
      throw new Error(errors[0].message);
    }
    return prompt;
  }

  async listPrompts(
    limit?: number,
    facets?: Array<Facets>,
    pageToken?: string | null | undefined,
  ): Promise<PromptViewModelCollection> {
    const {
      data: prompts,
      errors,
      nextToken,
    } = await this.client.models.prompt.list({
      limit: limit ?? 0,
      nextToken: pageToken,
      filter: this.facetsToFilter(facets),
    });

    if (errors && errors.length > 0) {
      throw new Error(errors[0].message);
    }
    return this.parseResponse(prompts, nextToken || "");
  }

  private parseResponse(
    prompts: Array<Schema["prompt"]["type"]>,
    nextToken?: string,
  ) {
    if (prompts) {
      const promptViewModelList = prompts.map((p) =>
        PromptViewModel.fromSchema(p),
      );
      const promptList = nextToken
        ? new PromptViewModelCollection(promptViewModelList, nextToken)
        : new PromptViewModelCollection(promptViewModelList);

      return promptList;
    } else {
      throw new Error("No prompts found");
    }
  }

  facetsToFilter(facets?: Array<Facets>) {
    if (!facets || facets.length === 0) {
      return undefined;
    }

    const searchFacets = facets.filter((f) => f.facet === "SEARCH");
    const otherFacets = facets.filter((f) => f.facet !== "SEARCH");

    const conditions: unknown[] = [];

    // Handle search facets with OR condition
    if (searchFacets.length > 0) {
      const searchValue = searchFacets[0].value;
      const sentenceCase =
        searchValue.charAt(0).toUpperCase() +
        searchValue.slice(1).toLowerCase();
      conditions.push({
        or: [
          { name: { contains: searchValue.toLowerCase() } },
          { name: { contains: searchValue.toUpperCase() } },
          { name: { contains: sentenceCase } },
          { description: { contains: searchValue.toLowerCase() } },
          { description: { contains: searchValue.toUpperCase() } },
          { description: { contains: sentenceCase } },
        ],
      });
    }

    // Handle other facets with AND condition
    if (otherFacets.length > 0) {
      const otherConditions = otherFacets.map((f) => ({
        [f.facet.toLowerCase()]: {
          eq: f.value,
        },
      }));

      conditions.push(...otherConditions);
    }

    // If we have both search and other facets, or multiple other facets,
    // wrap everything in an AND condition
    return conditions.length > 1 ? { and: conditions } : conditions[0] || [];
  }
}
