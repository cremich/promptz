import { UserViewModel } from "@/models/UserViewModel";
import { generateClient } from "aws-amplify/api";
import type { Schema } from "../amplify/data/resource";
import { PromptViewModel } from "@/models/PromptViewModel";
import { PromptViewModelCollection } from "@/models/PromptViewModelCollection";

export interface UserRepository {
  getUser(id: string): Promise<UserViewModel>;
}

export class UserGraphQLRepository implements UserRepository {
  private client;

  constructor() {
    this.client = generateClient<Schema>();
  }

  async getUser(id: string): Promise<UserViewModel> {
    const { data: userData, errors } = await this.client.models.user.get(
      {
        id,
      },
      {
        authMode: "userPool",
      },
    );
    if (errors && errors.length > 0) {
      throw new Error(errors[0].message);
    }

    return UserViewModel.fromSchema(userData!);
  }

  async getFavoritePrompts(id: string): Promise<PromptViewModelCollection> {
    const { data: prompts, errors } = await this.client.models.user.get(
      {
        id,
      },
      {
        selectionSet: ["stars.prompt.*"],
        authMode: "userPool",
      },
    );
    if (errors && errors.length > 0) {
      throw new Error(errors[0].message);
    }

    const promptViewModelList = prompts?.stars.map((p) =>
      PromptViewModel.fromSchema(p.prompt as Schema["prompt"]["type"]),
    );

    return new PromptViewModelCollection(promptViewModelList || []);
  }
}
