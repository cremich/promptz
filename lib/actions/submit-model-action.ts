"use server";
import { cookies } from "next/headers";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";
import { type Schema } from "../../amplify/data/resource";
import outputs from "../../amplify_outputs.json";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { modelFormSchema } from "@/lib/models/model-model";

export type FormState = {
  errors?: {
    id?: string[];
    name?: string[];
    description?: string[];
    documentationURL?: string[];
    providerId?: string[];
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
    name: data.get("name") as string,
    description: data.get("description") as string,
    documentationURL: data.get("documentationURL") as string,
    providerId: data.get("providerId") as string,
  };

  const parsed = modelFormSchema.safeParse(formData);
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
    documentationURL: parsed.data.documentationURL,
    providerId: parsed.data.providerId,
  };

  let response;
  try {
    response = await appsync.mutations.saveModel(payload, {
      authMode: "userPool",
    });

    if (response.errors) {
      return {
        errors: {
          api: response.errors.map((e) => e.message),
        },
        message: "Error saving model.",
        success: false,
      };
    }
  } catch (error) {
    return {
      errors: {
        api: [`Error creating model: ${error}`],
      },
      message: "Error creating model.",
      success: false,
    };
  }

  revalidatePath(`/models/model/${response.data!.slug}`);
  redirect(`/models/model/${response.data!.slug}`);
}
