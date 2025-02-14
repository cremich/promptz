"use server";
import { cookies } from "next/headers";
import { createServerRunner } from "@aws-amplify/adapter-nextjs";
import { fetchUserAttributes } from "aws-amplify/auth/server";

import outputs from "@/amplify_outputs.json";
import { User } from "@/app/lib/definitions";

const { runWithAmplifyServerContext } = createServerRunner({
  config: outputs,
});

export async function fetchCurrentAuthUser(): Promise<User> {
  try {
    const currentUser = await runWithAmplifyServerContext({
      nextServerContext: { cookies },
      operation: (contextSpec) => fetchUserAttributes(contextSpec),
    });
    return { displayName: currentUser.preferred_username!, guest: false };
  } catch (error) {
    return { displayName: "", guest: true };
  }
}
