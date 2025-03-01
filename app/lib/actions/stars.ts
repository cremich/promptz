"use server";
import { cookies } from "next/headers";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";

import { type Schema } from "@/amplify/data/resource";
import outputs from "@/amplify_outputs.json";

const appsync = generateServerClientUsingCookies<Schema>({
  config: outputs,
  cookies,
});

export async function isStarredByUser(
  promptId: string,
  userId: string,
): Promise<boolean> {
  const { data } = await appsync.models.stars.get(
    {
      userId: userId,
      promptId: promptId,
    },
    {
      authMode: "userPool",
    },
  );
  return data?.promptId === promptId && data?.userId === userId;
}
