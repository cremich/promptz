"use server";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";
import { type Schema } from "@/amplify/data/resource";
import outputs from "@/amplify_outputs.json";
import { promptFormSchema } from "@/app/lib/definitions";
import { redirect } from "next/navigation";
import { fetchCurrentAuthUser } from "@/app/lib/actions/cognito-server";
import { revalidatePath } from "next/cache";

export type FormState = {
  errors?: {
    id?: string[];
    title?: string[];
    description?: string[];
    howto?: string[];
    instruction?: string[];
    tags?: string[];
    api?: string[];
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
    title: data.get("title") as string,
    description: data.get("description") as string,
    howto: data.get("howto") as string,
    instruction: data.get("instruction") as string,
    tags: data.getAll("tags"),
    public: data.get("public") === "true" ? true : false,
  };

  const mode = formData.id ? "update" : "create";
  formData.id = formData.id || uuidv4();

  const parsed = promptFormSchema.safeParse(formData);
  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: "Invalid form data",
      success: parsed.success,
    };
  }

  const payload = {
    id: parsed.data.id!,
    name: parsed.data.title,
    description: parsed.data.description,
    howto: parsed.data.howto,
    instruction: parsed.data.instruction,
    tags: parsed.data.tags,
    public: parsed.data.public,
  };

  let response;
  if (mode === "create") {
    const user = await fetchCurrentAuthUser();
    const createPayload = { ...payload, owner_username: user.displayName };
    response = await appsync.models.prompt.create(createPayload, {
      authMode: "userPool",
    });
  } else {
    response = await appsync.models.prompt.update(payload, {
      authMode: "userPool",
    });
  }

  if (response.errors) {
    return {
      errors: {
        api: response.errors.map((e) => e.message),
      },
      message: "Error saving prompt.",
      success: false,
    };
  }

  revalidatePath(`/prompt/${payload.id}`);
  redirect(`/prompt/${payload.id}`);
}

export async function deletePrompt(
  id: string,
): Promise<{ success: boolean; message: string }> {
  try {
    // Delete the prompt
    await appsync.models.prompt.delete(
      { id },
      {
        authMode: "userPool",
      },
    );
    return {
      success: true,
      message: `Prompt deleted`,
    };
  } catch (error) {
    return {
      success: false,
      message: `Error deleting prompt: ${error}`,
    };
  }
}
