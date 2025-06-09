"use server";
import { cookies } from "next/headers";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";

import { type Schema } from "../../amplify/data/resource";
import outputs from "../../amplify_outputs.json";
import { ModelProvider } from "@/lib/models/modelProvider-model";

const appsync = generateServerClientUsingCookies<Schema>({
  config: outputs,
  cookies,
});

export async function fetchMyModelProviders(
  userId: string,
): Promise<ModelProvider[]> {
  const { data: data, errors } = await appsync.models.user.get(
    {
      id: userId,
    },
    {
      selectionSet: ["modelProviders.*", "displayName"],
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

  return (data.modelProviders as Schema["modelProvider"]["type"][]).map((p) => {
    return {
      id: p.id,
      name: p.name,
      description: p.description,
      author: data.displayName || "",
      authorId: p.owner || "",
      slug: p.slug || "",
      website: p.website || "",
      createdAt: p.createdAt || "",
      updatedAt: p.updatedAt || "",
    };
  });
}
