import { z } from "zod";
import {
  getCurrentUser,
  fetchUserAttributes,
  signIn,
  confirmSignIn,
} from "@aws-amplify/auth";
import { redirect } from "next/navigation";
import { User } from "@/lib/models/user-model";

const ConfirmSignInSchema = z.object({
  code: z.string().length(8, "Confirmation code must be 8 digits"),
});

const LoginFormSchema = z.object({
  email: z.string().email({
    message: "Invalid email address",
  }),
});

export type SignUpState = {
  errors?: {
    email?: string[];
    username?: string[];
  };
  message?: string | null;
};

export type ConfirmState = {
  errors?: {
    code?: string[];
  };
  message?: string | null;
};

export type LoginState = {
  errors?: {
    email?: string[];
  };
  message?: string | null;
};

export async function fetchCurrentUser(): Promise<User> {
  try {
    const userAttributes = await fetchUserAttributes();
    const currentUser = await getCurrentUser();
    return {
      displayName: userAttributes.preferred_username!,
      username: currentUser.username,
      id: currentUser.userId,
      guest: false,
    };
  } catch (error) {
    console.log(error);
    return { displayName: "", username: "", id: "", guest: true };
  }
}

export async function handleSignIn(
  prevState: SignUpState,
  formData: FormData,
): Promise<LoginState> {
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
  });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  const { email } = validatedFields.data;
  let redirectLink = "/";

  try {
    const { nextStep: signInNextStep } = await signIn({
      username: email,
      options: {
        authFlowType: "USER_AUTH",
        preferredChallenge: "EMAIL_OTP",
      },
    });
    if (signInNextStep.signInStep === "CONFIRM_SIGN_IN_WITH_EMAIL_CODE") {
      redirectLink = "/login/confirm";
    }
  } catch (error) {
    console.log(error);
    return {
      message: "Failed to create user.",
    };
  }

  redirect(redirectLink);
}

export async function handleConfirmSignIn(
  prevState: ConfirmState,
  formData: FormData,
): Promise<ConfirmState> {
  const validatedFields = ConfirmSignInSchema.safeParse({
    code: formData.get("code"),
  });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await confirmSignIn({
      challengeResponse: validatedFields.data.code,
    });
  } catch (error) {
    console.log(error);
    return {
      message: "An error occurred during confirmation",
    };
  }

  redirect("/");
}
