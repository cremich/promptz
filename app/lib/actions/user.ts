"use server";
import { cookies } from "next/headers";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";

import { type Schema } from "@/amplify/data/resource";
import outputs from "@/amplify_outputs.json";
import { Prompt } from "@/app/lib/definitions";

const appsync = generateServerClientUsingCookies<Schema>({
  config: outputs,
  cookies,
});

export async function fetchFavoritePrompts(userId: string): Promise<Prompt[]> {
  const { data: prompts, errors } = await appsync.models.user.get(
    {
      id: userId,
    },
    {
      selectionSet: ["stars.prompt.*"],
      authMode: "userPool",
    },
  );
  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!prompts) {
    return [];
  }

  // @ts-expect-error - type of tags inferred incorrectly by typescript
  return prompts?.stars
    .filter((p) => p.prompt != null)
    .map((p) => {
      return {
        id: p.prompt.id,
        title: p.prompt.name,
        description: p.prompt.description,
        author: p.prompt.owner_username,
        authorId: p.prompt.owner || "",
        tags: p.prompt.tags || [],
        instruction: p.prompt.instruction,
        howto: p.prompt.howto || "",
        public: p.prompt.public || false,
        createdAt: p.prompt.createdAt || "",
        updatedAt: p.prompt.updatedAt || "",
      };
    });
}
