import { UserViewModel } from "@/models/UserViewModel";
import { generateClient } from "aws-amplify/api";
import type { Schema } from "../amplify/data/resource";

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
}
