import { defineAuth, secret } from "@aws-amplify/backend";
import { verificationEmailTemplate } from "./email-templates";
import { postAuthenticationFunction } from "./post-authentication/resource";

const getSenders = () => {
  return process.env["APH_ENV"] === "sandbox"
    ? undefined
    : {
        email: {
          fromEmail: "noreply@akkodis.com",
        },
      };
};

const getExternalProviders = () => {
  return process.env["APH_ENV"] === "sandbox"
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
          "https://prompthub.aws.akkodis.com/auth",
          "https://www.prompthub.aws.akkodis.com/auth",
        ],
        logoutUrls: [
          "https://prompthub.aws.akkodis.com/",
          "https://www.prompthub.aws.akkodis.com",
        ],
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
      verificationEmailSubject: "Welcome to the Akkodis Prompt Hub!",
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
  triggers: {
    postAuthentication: postAuthenticationFunction,
  },
});
