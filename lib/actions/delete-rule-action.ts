"use server";
import { cookies } from "next/headers";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";
import { type Schema } from "../../amplify/data/resource";
import outputs from "../../amplify_outputs.json";

const appsync = generateServerClientUsingCookies<Schema>({
  config: outputs,
  cookies,
});

/**
 * Deletes a project rule by ID
 * @param id ID of the project rule to delete
 * @returns Object indicating success/failure and a message
 */
export async function deleteProjectRule(
  id: string,
): Promise<{ success: boolean; message: string }> {
  try {
    // Delete the project rule
    await appsync.models.projectRule.delete(
      { id },
      {
        authMode: "userPool",
      },
    );
    return {
      success: true,
      message: `Project rule deleted`,
    };
  } catch (error) {
    return {
      success: false,
      message: `Error deleting project rule: ${error}`,
    };
  }
}
