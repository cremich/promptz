"use server";
import { cookies } from "next/headers";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";

import { type Schema } from "../../amplify/data/resource";
import outputs from "../../amplify_outputs.json";
import { Model } from "@/lib/models/model-model";

const appsync = generateServerClientUsingCookies<Schema>({
  config: outputs,
  cookies,
});

export async function fetchMyModels(userId: string): Promise<Model[]> {
  const { data: data, errors } = await appsync.models.user.get(
    {
      id: userId,
    },
    {
      selectionSet: ["models.*", "displayName"],
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

  return (data.models as Schema["model"]["type"][]).map((p) => {
    return {
      id: p.id,
      name: p.name,
      description: p.description,
      author: data.displayName || "",
      authorId: p.owner || "",
      slug: p.slug || "",
      documentationURL: p.documentationURL || "",
      createdAt: p.createdAt || "",
      updatedAt: p.updatedAt || "",
    };
  });
}
