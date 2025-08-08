"use server";
import { cookies } from "next/headers";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";
import { type Schema } from "../../amplify/data/resource";
import outputs from "../../amplify_outputs.json";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { promptFormSchema } from "@/lib/models/prompt-model";

export type FormState = {
  errors?: {
    id?: string[];
    name?: string[];
    description?: string[];
    howto?: string[];
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

export async function onSubmitAction(
  prevState: FormState,
  data: FormData,
): Promise<FormState> {
  const formData = {
    id: data.get("id") as string,
    name: data.get("name") as string,
    description: data.get("description") as string,
    howto: data.get("howto") as string,
    content: data.get("content") as string,
    tags: data.getAll("tags"),
    scope: data.get("scope"),
    sourceURL: data.get("sourceURL") as string,
  };

  console.log(formData);

  const parsed = promptFormSchema.safeParse(formData);
  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: "Invalid form data",
      success: parsed.success,
    };
  }

  const payload = {
    id: parsed.data.id,
    name: parsed.data.name,
    description: parsed.data.description,
    howto: parsed.data.howto,
    content: parsed.data.content,
    tags: parsed.data.tags,
    scope: parsed.data.scope,
    sourceURL: parsed.data.sourceURL,
  };

  let response;
  try {
    response = await appsync.mutations.savePrompt(payload, {
      authMode: "userPool",
    });

    if (response.errors) {
      return {
        errors: {
          api: response.errors.map((e) => e.message),
        },
        message: "Error saving prompt.",
        success: false,
      };
    }
  } catch (error) {
    return {
      errors: {
        api: [`Error creating prompt: ${error}`],
      },
      message: "Error creating prompt.",
      success: false,
    };
  }

  revalidatePath(`/prompts/prompt/${response.data!.slug}`);
  redirect(`/prompts/prompt/${response.data!.slug}`);
}
