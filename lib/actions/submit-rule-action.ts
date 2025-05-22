"use server";
import { cookies } from "next/headers";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";
import { type Schema } from "../../amplify/data/resource";
import outputs from "../../amplify_outputs.json";
import { projectRuleFormSchema } from "../models/project-rule-model";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export type FormState = {
  errors?: {
    id?: string[];
    title?: string[];
    description?: string[];
    content?: string[];
    tags?: string[];
    api?: string[];
    sourceURL?: string[];
  };
  message?: string;
  success?: boolean;
};

const appsync = generateServerClientUsingCookies<Schema>({
  config: outputs,
  cookies,
});

/**
 * Creates or updates a project rule based on form data
 * @param prevState Previous form state
 * @param data Form data containing project rule information
 * @returns Updated form state with success/error information
 */
export async function onSubmitAction(
  prevState: FormState,
  data: FormData,
): Promise<FormState> {
  const formData = {
    id: data.get("id") as string,
    title: data.get("title") as string,
    description: data.get("description") as string,
    content: data.get("content") as string,
    tags: data.getAll("tags"),
    public: data.get("public") === "true" ? true : false,
    sourceURL: data.get("sourceURL") as string,
  };

  // Validate the form data
  const parsed = projectRuleFormSchema.safeParse(formData);
  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: "Invalid form data",
      success: parsed.success,
    };
  }

  // Prepare the payload for the API
  const payload = {
    id: parsed.data.id,
    name: parsed.data.title,
    description: parsed.data.description,
    content: parsed.data.content,
    tags: parsed.data.tags,
    public: parsed.data.public,
    sourceURL: parsed.data.sourceURL,
  };

  let response;
  try {
    response = await appsync.mutations.saveProjectRule(payload, {
      authMode: "userPool",
    });

    if (response.errors) {
      return {
        errors: {
          api: response.errors.map((e) => e.message),
        },
        message: "Error saving project rule.",
        success: false,
      };
    }
  } catch (error) {
    return {
      errors: {
        api: [`Error creating project rule: ${error}`],
      },
      message: "Error creating project rule.",
      success: false,
    };
  }

  // Revalidate the path and redirect to the project rule page
  revalidatePath(`/rules/rule/${response.data!.slug}`);
  redirect(`/rules/rule/${response.data!.slug}`);
}
