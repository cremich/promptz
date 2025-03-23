"use server";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";
import { type Schema } from "@/amplify/data/resource";
import outputs from "@/amplify_outputs.json";
import { projectRuleFormSchema } from "@/app/lib/definitions";
import { redirect } from "next/navigation";
import { fetchCurrentAuthUser } from "@/app/lib/actions/cognito-server";
import { revalidatePath } from "next/cache";
import { slugify } from "@/app/lib/formatter";

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

  // Determine if we're creating or updating
  const mode = formData.id ? "update" : "create";
  formData.id = formData.id || uuidv4();

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
    id: parsed.data.id!,
    name: parsed.data.title,
    slug: `${slugify(parsed.data.title)}-${parsed.data.id!.split("-")[0]}`,
    description: parsed.data.description,
    content: parsed.data.content,
    tags: parsed.data.tags,
    public: parsed.data.public,
    sourceURL: parsed.data.sourceURL,
  };

  let response;
  if (mode === "create") {
    // For new project rules, get the current user and add their username
    const user = await fetchCurrentAuthUser();
    const createPayload = { ...payload, owner_username: user.displayName };
    response = await appsync.models.projectRule.create(createPayload, {
      authMode: "userPool",
    });
  } else {
    // For updates, just update the existing project rule
    response = await appsync.models.projectRule.update(payload, {
      authMode: "userPool",
    });
  }

  // Handle any errors from the API
  if (response.errors) {
    return {
      errors: {
        api: response.errors.map((e) => e.message),
      },
      message: "Error saving project rule.",
      success: false,
    };
  }

  // Revalidate the path and redirect to the project rule page
  revalidatePath(`/rules/rule/${payload.slug}`);
  redirect(`/rules/rule/${payload.slug}`);
}

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
