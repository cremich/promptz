import { defineFunction } from "@aws-amplify/backend";

export const postAuthenticationFunction = defineFunction({
  name: "post-authentication",
  architecture: "arm64",
  memoryMB: 1024,
  timeoutSeconds: 30,
});
