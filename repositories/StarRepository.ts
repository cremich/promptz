import { PromptViewModel } from "@/models/PromptViewModel";
import { generateClient } from "aws-amplify/api";
import type { Schema } from "../amplify/data/resource";
import { UserViewModel } from "@/models/UserViewModel";

export interface StarRepository {
  addStar(prompt: PromptViewModel, user: UserViewModel): void;
  removeStar(prompt: PromptViewModel, user: UserViewModel): void;
  starredByUser(prompt: PromptViewModel, user: UserViewModel): Promise<boolean>;
}

export class StarGraphQLRepository implements StarRepository {
  client;
  constructor() {
    this.client = generateClient<Schema>();
  }

  async addStar(prompt: PromptViewModel, user: UserViewModel) {
    try {
      await this.client.models.stars.create(
        {
          userId: user.id,
          promptId: prompt.id,
        },
        {
          authMode: "userPool",
        },
      );
    } catch (error) {
      console.error("Error starring prompt", error);
      throw error;
    }
  }

  async removeStar(prompt: PromptViewModel, user: UserViewModel) {
    try {
      await this.client.models.stars.delete(
        {
          userId: user.id,
          promptId: prompt.id,
        },
        {
          authMode: "userPool",
        },
      );
    } catch (error) {
      console.error("Error unstarring prompt", error);
      throw error;
    }
  }

  async starredByUser(prompt: PromptViewModel, user: UserViewModel) {
    const { data } = await this.client.models.stars.get(
      {
        userId: user.id,
        promptId: prompt.id,
      },
      {
        authMode: "userPool",
      },
    );

    return data?.promptId === prompt.id && data?.userId === user.id;
  }
}
