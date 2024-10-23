import { PromptViewModel } from "@/models/PromptViewModel";
import { generateClient } from "aws-amplify/api";
import type { Schema } from "../amplify/data/resource";
import { UserViewModel } from "@/models/UserViewModel";
import { PromptViewModelCollection } from "@/models/PromptViewModelCollection";

export interface PromptRepository {
  getPrompt(id: string): Promise<PromptViewModel>;
  listPrompts(limit?: number): Promise<PromptViewModelCollection>;
  createPrompt(prompt: PromptViewModel, owner: UserViewModel): Promise<PromptViewModel>;
  updatePrompt(prompt: PromptViewModel): Promise<PromptViewModel>;
}

export class PromptGraphQLRepository implements PromptRepository {
  client;
  constructor() {
    this.client = generateClient<Schema>();
  }

  async updatePrompt(prompt: PromptViewModel): Promise<PromptViewModel> {
    const { data: createdPrompt, errors } = await this.client.models.prompt.update(
      {
        id: prompt.id,
        name: prompt.name,
        description: prompt.description,
        sdlc_phase: prompt.sdlcPhase,
        category: prompt.category,
        instruction: prompt.instruction,
      },
      {
        authMode: "userPool",
      }
    );
    if (errors && errors.length > 0) {
      throw new Error(errors[0].message);
    }
    return PromptViewModel.fromSchema(createdPrompt!);
  }

  async createPrompt(prompt: PromptViewModel, owner: UserViewModel): Promise<PromptViewModel> {
    const { data: createdPrompt, errors } = await this.client.models.prompt.create(
      {
        name: prompt.name,
        description: prompt.description,
        sdlc_phase: prompt.sdlcPhase,
        category: prompt.category,
        instruction: prompt.instruction,
        owner_username: owner.userName,
      },
      {
        authMode: "userPool",
      }
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

  async listPrompts(limit?: number, pageToken?: string | null | undefined): Promise<PromptViewModelCollection> {
    const {
      data: prompts,
      errors,
      nextToken,
    } = await this.client.models.prompt.list({
      limit: limit ?? 0,
      nextToken: pageToken,
    });

    if (errors && errors.length > 0) {
      throw new Error(errors[0].message);
    }
    if (prompts) {
      const promptViewModelList = prompts.map((p) => PromptViewModel.fromSchema(p)); //PromptViewModel.fromSchema(prompt);
      const promptList = nextToken
        ? new PromptViewModelCollection(promptViewModelList, nextToken)
        : new PromptViewModelCollection(promptViewModelList);

      return promptList;
    } else {
      throw new Error("No prompts found");
    }
  }
}
