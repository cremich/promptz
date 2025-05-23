import { z } from "zod";
import { signUp, confirmSignUp } from "@aws-amplify/auth";
import { redirect } from "next/navigation";

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
