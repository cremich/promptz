import { z } from "zod";
import {
  signUp,
  confirmSignUp,
  autoSignIn,
  fetchUserAttributes,
} from "@aws-amplify/auth";
import { redirect } from "next/navigation";
import { User } from "@/app/lib/definitions";

const SignUpFormSchema = z.object({
  email: z.string().email({
    message: "Invalid email address",
  }),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character",
    ),
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

export type SignUpState = {
  errors?: {
    email?: string[];
    password?: string[];
    username?: string[];
  };
  message?: string | null;
};

export type ConfirmSignUpState = {
  errors?: {
    code?: string[];
  };
  message?: string | null;
};

export async function handleSignUp(
  prevState: SignUpState,
  formData: FormData,
): Promise<SignUpState> {
  const validatedFields = SignUpFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    username: formData.get("username"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to create user.",
    };
  }
  const { email, password, username } = validatedFields.data;

  try {
    await signUp({
      username: email,
      password: password,
      options: {
        userAttributes: {
          preferred_username: username,
        },
        autoSignIn: true,
      },
    });
    sessionStorage.setItem("signupEmail", email);
  } catch (error) {
    return {
      message: "Failed to create user.",
    };
  }

  redirect("/signup/confirm");
}

export async function handleConfirmSignUp(
  prevState: ConfirmSignUpState,
  formData: FormData,
): Promise<ConfirmSignUpState> {
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

    const { nextStep: confirmSignUpNextStep } = await confirmSignUp({
      username: email,
      confirmationCode: validatedFields.data.code,
    });

    if (confirmSignUpNextStep.signUpStep === "COMPLETE_AUTO_SIGN_IN") {
      // Call `autoSignIn` API to complete the flow
      await autoSignIn();
    }

    sessionStorage.removeItem("signupEmail");
  } catch (error: any) {
    console.log(error);
    return {
      message: error.message || "An error occurred during confirmation",
    };
  }

  redirect("/");
}

export async function fetchCurrentUser(): Promise<User> {
  try {
    const currentUser = await fetchUserAttributes();
    return { displayName: currentUser.preferred_username!, guest: false };
  } catch (error) {
    return { displayName: "", guest: true };
  }
}
