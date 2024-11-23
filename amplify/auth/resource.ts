import { defineAuth, secret } from "@aws-amplify/backend";
import { verificationEmailTemplate } from "./email-templates";

const getSenders = () => {
  return process.env["PROMPTZ_ENV"] === "sandbox"
    ? undefined
    : {
        email: {
          fromEmail: "noreply@promptz.dev",
        },
      };
};

const getExternalProviders = () => {
  return process.env["PROMPTZ_ENV"] === "sandbox"
    ? undefined
    : {
        google: {
          clientId: secret("GOOGLE_CLIENT_ID"),
          clientSecret: secret("GOOGLE_CLIENT_SECRET"),
          attributeMapping: {
            email: "email",
            emailVerified: "email_verified",
            preferredUsername: "name",
          },
          scopes: ["email", "openid", "profile"],
        },
        callbackUrls: [
          "https://promptz.dev/auth",
          "https://www.promptz.dev/auth",
        ],
        logoutUrls: ["https://promptz.dev/", "https://www.promptz.dev"],
      };
};

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: {
      verificationEmailStyle: "CODE",
      verificationEmailSubject: "Welcome to PROMPTZ!",
      verificationEmailBody: (createCode) =>
        verificationEmailTemplate(createCode),
    },
    externalProviders: getExternalProviders(),
  },
  senders: getSenders(),
  userAttributes: {
    preferredUsername: {
      required: true,
    },
  },
});
