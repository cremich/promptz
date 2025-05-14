"use server";
import { cookies } from "next/headers";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";

import { type Schema } from "@/amplify/data/resource";
import outputs from "@/amplify_outputs.json";
import { Prompt } from "../prompt-model";

const appsync = generateServerClientUsingCookies<Schema>({
  config: outputs,
  cookies,
});

export async function fetchMyPrompts(userId: string): Promise<Prompt[]> {
  const { data: data, errors } = await appsync.models.user.get(
    {
      id: userId,
    },
    {
      selectionSet: ["prompts.*"],
      authMode: "userPool",
    },
  );

  if (errors && errors.length > 0) {
    const errorMessages = errors.map((error) => error.message).join(", ");
    throw new Error(errorMessages);
  }

  if (!data) {
    return [];
  }

  return (data.prompts as Schema["prompt"]["type"][]).map((p) => {
    return {
      id: p.id,
      title: p.name,
      description: p.description,
      author: p.owner_username,
      authorId: p.owner || "",
      tags: (p.tags || []).filter((tag): tag is string => tag !== null),
      slug: p.slug || "",
      instruction: p.instruction,
      howto: p.howto || "",
      public: p.public || false,
      createdAt: p.createdAt || "",
      updatedAt: p.updatedAt || "",
    };
  });
}

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

  return prompts?.stars
    .filter((p) => p.prompt != null)
    .map((p) => {
      return {
        id: p.prompt.id,
        title: p.prompt.name,
        description: p.prompt.description,
        author: p.prompt.owner_username,
        authorId: p.prompt.owner || "",
        tags: (p.prompt.tags || []).filter(
          (tag): tag is string => tag !== null,
        ),
        slug: p.prompt.slug || "",
        instruction: p.prompt.instruction,
        howto: p.prompt.howto || "",
        public: p.prompt.public || false,
        createdAt: p.prompt.createdAt || "",
        updatedAt: p.prompt.updatedAt || "",
      };
    });
}
