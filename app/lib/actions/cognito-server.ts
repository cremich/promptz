"use server";
import { cookies } from "next/headers";
import { createServerRunner, NextServer } from "@aws-amplify/adapter-nextjs";
import {
  fetchAuthSession,
  fetchUserAttributes,
  getCurrentUser,
} from "aws-amplify/auth/server";

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
    return {
      id: currentUser.sub!,
      displayName: currentUser.preferred_username!,
      guest: false,
    };
  } catch (error) {
    return { id: "", displayName: "", guest: true };
  }
}

export async function fetchCurrentAuthUserFromRequestContext(
  context: NextServer.Context,
) {
  return await runWithAmplifyServerContext({
    nextServerContext: context,
    operation: async (contextSpec) => {
      try {
        const session = await fetchAuthSession(contextSpec);
        if (!session.tokens) {
          return;
        }
        const user = {
          ...(await getCurrentUser(contextSpec)),
          isAdmin: false,
        };
        const groups = session.tokens.accessToken.payload["cognito:groups"];
        // @ts-ignore
        user.isAdmin = Boolean(groups && groups.includes("Admins"));

        return user;
      } catch (error) {
        console.log(error);
      }
    },
  });
}
