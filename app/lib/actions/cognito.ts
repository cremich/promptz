import { z } from "zod";
import {
  signUp,
  confirmSignUp,
  getCurrentUser,
  fetchUserAttributes,
  signIn,
  confirmSignIn,
} from "@aws-amplify/auth";
import { redirect } from "next/navigation";
import { User } from "@/app/lib/definitions";

const SignUpFormSchema = z.object({
  email: z.string().email({
    message: "Invalid email address",
  }),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(20, "Username must be at most 20 characters long")
    .regex(
      /^[a-zA-Z0-9_\-]+$/,
      "Username must only contain letters, numbers, underscores and hyphens",
    ),
});

const ConfirmSignUpSchema = z.object({
  code: z.string().length(6, "Confirmation code must be 6 digits"),
});

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

export async function handleSignUp(
  prevState: SignUpState,
  formData: FormData,
): Promise<SignUpState> {
  const validatedFields = SignUpFormSchema.safeParse({
    email: formData.get("email"),
    username: formData.get("username"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to create user.",
    };
  }
  const { email, username } = validatedFields.data;

  try {
    await signUp({
      username: email,
      options: {
        userAttributes: {
          preferred_username: username,
        },
      },
    });
    sessionStorage.setItem("signupEmail", email);
  } catch (error) {
    console.log(error);
    return {
      message: "Failed to create user.",
    };
  }

  redirect("/signup/confirm");
}

export async function handleConfirmSignUp(
  prevState: ConfirmState,
  formData: FormData,
): Promise<ConfirmState> {
  const validatedFields = ConfirmSignUpSchema.safeParse({
    code: formData.get("code"),
  });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    // Get email from sessionStorage
    const email = sessionStorage.getItem("signupEmail");

    if (!email) {
      return {
        message: "Session not found. Please try signing up again.",
      };
    }

    await confirmSignUp({
      username: email,
      confirmationCode: validatedFields.data.code,
    });

    sessionStorage.removeItem("signupEmail");
  } catch (error) {
    console.log(error);
    return {
      message: "An error occurred during confirmation",
    };
  }

  redirect("/");
}

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
