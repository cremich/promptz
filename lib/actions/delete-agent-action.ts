"use server";
import { cookies } from "next/headers";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";
import { type Schema } from "../../amplify/data/resource";
import outputs from "../../amplify_outputs.json";

const appsync = generateServerClientUsingCookies<Schema>({
  config: outputs,
  cookies,
});

export async function deleteAgent(id: string) {
  try {
    const response = await appsync.mutations.deleteAgent(
      { id },
      { authMode: "userPool" },
    );

    if (response.errors) {
      return {
        success: false,
        message: "Error deleting agent.",
      };
    }

    return {
      success: true,
      message: "Agent deleted successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message: `Error deleting agent: ${error}`,
    };
  }
}
