import { z } from "zod";
import {
  signUp,
  confirmSignUp,
  autoSignIn,
  fetchUserAttributes,
  signIn,
  resendSignUpCode,
  resetPassword,
  confirmResetPassword,
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

const LoginFormSchema = z.object({
  email: z.string().email({
    message: "Invalid email address",
  }),
  password: z.string(),
});

const RequestPasswordFormSchema = z.object({
  email: z.string().email({
    message: "Invalid email address",
  }),
});

const ConfirmPasswordResetFormSchema = z.object({
  code: z.string().length(6, "Confirmation code must be 6 digits"),
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

export type LoginState = {
  errors?: {
    email?: string[];
  };
  message?: string | null;
};

export type RequestPasswordState = {
  errors?: {
    email?: string[];
  };
  message?: string | null;
};

export type ConfirmPasswordResetState = {
  errors?: {
    code?: string[];
    password?: string[];
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

export async function handleSignIn(
  prevState: SignUpState,
  formData: FormData,
): Promise<LoginState> {
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  const { email, password } = validatedFields.data;
  let redirectLink = "/";

  try {
    const { nextStep } = await signIn({
      username: email,
      password: password,
    });
    if (nextStep.signInStep === "CONFIRM_SIGN_UP") {
      await resendSignUpCode({
        username: email,
      });
      redirectLink = "/signup/confirm";
    }
  } catch (error) {
    return {
      message: "Failed to create user.",
    };
  }

  redirect(redirectLink);
}

export async function handleRequestPassword(
  prevState: SignUpState,
  formData: FormData,
): Promise<RequestPasswordState> {
  const validatedFields = RequestPasswordFormSchema.safeParse({
    email: formData.get("email"),
  });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  const { email } = validatedFields.data;
  let redirectLink = "/reset-password/confirm";

  try {
    await resetPassword({
      username: email,
    });
    sessionStorage.setItem("resetPasswordEmail", email);
  } catch (error) {
    return {
      message: "Failed to create user.",
    };
  }

  redirect(redirectLink);
}

export async function handlePasswordReset(
  prevState: SignUpState,
  formData: FormData,
): Promise<ConfirmPasswordResetState> {
  const validatedFields = ConfirmPasswordResetFormSchema.safeParse({
    code: formData.get("code"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Get email from sessionStorage
  const email = sessionStorage.getItem("resetPasswordEmail");

  if (!email) {
    return {
      message: "Session not found. Please try gain.",
    };
  }

  const { code, password } = validatedFields.data;
  try {
    await confirmResetPassword({
      username: email,
      confirmationCode: code,
      newPassword: password,
    });
    sessionStorage.removeItem("resetPasswordEmail");
  } catch (error) {
    return {
      message: "Failed to create user.",
    };
  }

  redirect("/login");
}
