import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { createServerRunner } from "@aws-amplify/adapter-nextjs";
import { fetchAuthSession, fetchUserAttributes } from "aws-amplify/auth/server";

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

export async function checkUserIsAuthenticated(
  request: NextRequest,
  response: NextResponse,
) {
  const authenticated = await runWithAmplifyServerContext({
    nextServerContext: { request, response },
    operation: async (contextSpec) => {
      try {
        const session = await fetchAuthSession(contextSpec, {});
        return session.tokens !== undefined;
      } catch {
        return false;
      }
    },
  });
  return authenticated;
}
