"use server";
import { cookies } from "next/headers";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";

import { type Schema } from "../../amplify/data/resource";
import outputs from "../../amplify_outputs.json";
import { ProjectRule } from "@/lib/models/project-rule-model";

const appsync = generateServerClientUsingCookies<Schema>({
  config: outputs,
  cookies,
});

export async function fetchMyRules(userId: string): Promise<ProjectRule[]> {
  const { data: data, errors } = await appsync.models.user.get(
    {
      id: userId,
    },
    {
      selectionSet: ["projectRules.*", "displayName"],
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

  return (data.projectRules as Schema["projectRule"]["type"][]).map((p) => {
    return {
      id: p.id,
      title: p.name,
      description: p.description || "",
      author: data.displayName || "",
      authorId: p.owner || "",
      tags: (p.tags || []).filter((tag): tag is string => tag !== null),
      slug: p.slug || "",
      instruction: p.content,
      public: p.public || false,
      createdAt: p.createdAt || "",
      updatedAt: p.updatedAt || "",
    };
  });
}
