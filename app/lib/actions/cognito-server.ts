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
    const user = await runWithAmplifyServerContext({
      nextServerContext: { cookies },
      operation: (contextSpec) => {
        return Promise.all([
          fetchUserAttributes(contextSpec),
          getCurrentUser(contextSpec),
        ]);
      },
    });
    return {
      id: user[0].sub!,
      username: user[1].username,
      displayName: user[0].preferred_username!,
      guest: false,
    };
  } catch {
    return { id: "", displayName: "", username: "", guest: true };
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
        // @ts-expect-error - groups array may be undefined from cognito token payload
        user.isAdmin = Boolean(groups && groups.includes("Admins"));

        return user;
      } catch (error) {
        console.log(error);
      }
    },
  });
}
