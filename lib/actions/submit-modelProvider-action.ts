"use server";
import { cookies } from "next/headers";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";
import { type Schema } from "../../amplify/data/resource";
import outputs from "../../amplify_outputs.json";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { modelProviderFormSchema } from "@/lib/models/modelProvider-model";

export type FormState = {
  errors?: {
    id?: string[];
    name?: string[];
    description?: string[];
    website?: string[];
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
    website: data.get("website") as string,
  };

  const parsed = modelProviderFormSchema.safeParse(formData);
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
    website: parsed.data.website,
  };

  let response;
  try {
    response = await appsync.mutations.saveModelProvider(payload, {
      authMode: "userPool",
    });

    if (response.errors) {
      return {
        errors: {
          api: response.errors.map((e) => e.message),
        },
        message: "Error saving modelProvider.",
        success: false,
      };
    }
  } catch (error) {
    return {
      errors: {
        api: [`Error creating modelProvider: ${error}`],
      },
      message: "Error creating modelProvider.",
      success: false,
    };
  }

  revalidatePath(`/modelProviders/modelProvider/${response.data!.slug}`);
  redirect(`/modelProviders/modelProvider/${response.data!.slug}`);
}
