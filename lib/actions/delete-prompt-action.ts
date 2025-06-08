"use server";
import { cookies } from "next/headers";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";
import { type Schema } from "../../amplify/data/resource";
import outputs from "../../amplify_outputs.json";

const appsync = generateServerClientUsingCookies<Schema>({
  config: outputs,
  cookies,
});

export async function deletePrompt(
  id: string,
): Promise<{ success: boolean; message: string }> {
  try {
    // // Delete the prompt
    await appsync.mutations.deletePrompt(
      { id },
      {
        authMode: "userPool",
      },
    );
    return {
      success: true,
      message: `Prompt deleted ${id}`,
    };
  } catch (error) {
    return {
      success: false,
      message: `Error deleting prompt: ${error}`,
    };
  }
}
