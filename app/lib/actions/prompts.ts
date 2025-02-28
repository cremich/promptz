"use server";
import { cookies } from "next/headers";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";

import { type Schema } from "@/amplify/data/resource";
import outputs from "@/amplify_outputs.json";
import { Prompt, promptFormSchema } from "@/app/lib/definitions";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { error } from "console";

const appsync = generateServerClientUsingCookies<Schema>({
  config: outputs,
  cookies,
});

export async function fetchFeaturedPrompts(): Promise<Prompt[]> {
  console.log(appsync.models.prompt);
  const { data: prompts, errors } = await appsync.models.prompt.list({
    limit: 3,
    filter: {
      public: { eq: true },
    },
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
    public: prompt.public,
  } as Prompt;
}
