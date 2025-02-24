"use server";
import { cookies } from "next/headers";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";

import { type Schema } from "@/amplify/data/resource";
import outputs from "@/amplify_outputs.json";
import { Prompt, promptFormSchema } from "@/app/lib/definitions";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type PromptFormState = {
  errors?: {
    id?: string[];
    title?: string[];
  };
  message?: string | null;
};

const appsync = generateServerClientUsingCookies<Schema>({
  config: outputs,
  cookies,
});

export async function fetchFeaturedPrompts(): Promise<Prompt[]> {
  const { data: prompts, errors } = await appsync.models.prompt.list({
    limit: 3,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  const promptList = prompts.map((p) => {
    const mappedTags = Object.entries({
      category: p.category,
      sdlc_phase: p.sdlc_phase,
      interface: p.interface,
    })
      .map(([_, value]) => value)
      .filter(Boolean);

    return {
      id: p.id,
      title: p.name,
      description: p.description,
      tags: p.tags || mappedTags,
      author: p.owner_username,
    } as Prompt;
  });
  return promptList;
}

export async function fetchPrompt(id: string) {
  const { data: prompt, errors } = await appsync.models.prompt.get({
    id,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!prompt) {
    throw new Error("Prompt not found");
  }

  const mappedTags = Object.entries({
    category: prompt.category,
    sdlc_phase: prompt.sdlc_phase,
    interface: prompt.interface,
  })
    .map(([_, value]) => value)
    .filter(Boolean);

  return {
    id: prompt.id,
    title: prompt.name,
    description: prompt.description,
    tags: prompt.tags || mappedTags,
    author: prompt.owner_username,
    authorId: prompt.owner,
    instruction: prompt.instruction,
    howto: prompt.howto,
  } as Prompt;
}

export async function updatePrompt(
  prevState: PromptFormState,
  data: FormData,
): Promise<PromptFormState> {
  const formData = {
    id: data.get("id") as string,
    title: data.get("title") as string,
    description: data.get("description") as string,
    howto: data.get("howto") as string,
    instruction: data.get("instruction") as string,
    tags: data.getAll("tags"),
  };

  const parsed = promptFormSchema.safeParse(formData);
  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: "Invalid form data",
    };
  }

  const prompt = parsed.data;
  appsync.models.prompt.update({
    id: prompt.id,
    name: prompt.title,
    description: prompt.description,
    howto: prompt.howto,
    instruction: prompt.instruction,
    tags: prompt.tags,
  });

  revalidatePath(`/prompt/${parsed.data.id}`);
  redirect(`/prompt/${parsed.data.id}`);
}
