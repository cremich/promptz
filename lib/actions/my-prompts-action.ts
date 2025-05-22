"use server";
import { cookies } from "next/headers";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";

import { type Schema } from "../../amplify/data/resource";
import outputs from "../../amplify_outputs.json";
import { Prompt } from "@/lib/models/prompt-model";

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
      selectionSet: ["prompts.*", "displayName"],
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
      author: data.displayName || "",
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
