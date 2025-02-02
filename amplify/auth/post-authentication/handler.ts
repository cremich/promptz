import type { PostConfirmationTriggerHandler } from "aws-lambda";
import { type Schema } from "../../data/resource";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import { getAmplifyDataClientConfig } from "@aws-amplify/backend/function/runtime";
import { env } from "$amplify/env/post-authentication";

const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig({
  ...env,
});

Amplify.configure(resourceConfig, libraryOptions);

const client = generateClient<Schema>();

export const handler: PostConfirmationTriggerHandler = async (event) => {
  await client.models.user.create({
    id: event.request.userAttributes.sub,
    username: event.userName,
    email: event.request.userAttributes.email,
    displayName: event.request.userAttributes.preferred_username,
    owner: `${event.request.userAttributes.sub}::${event.userName}`,
  });
  return event;
};
