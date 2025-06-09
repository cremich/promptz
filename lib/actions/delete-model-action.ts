"use server";
import { cookies } from "next/headers";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";
import { type Schema } from "../../amplify/data/resource";
import outputs from "../../amplify_outputs.json";

const appsync = generateServerClientUsingCookies<Schema>({
  config: outputs,
  cookies,
});

export async function deleteModel(
  id: string,
): Promise<{ success: boolean; message: string }> {
  try {
    // Delete the model
    await appsync.models.model.delete(
      { id },
      {
        authMode: "userPool",
      },
    );
    return {
      success: true,
      message: `Model Provider deleted`,
    };
  } catch (error) {
    return {
      success: false,
      message: `Error deleting model provider: ${error}`,
    };
  }
}
