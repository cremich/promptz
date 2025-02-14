import { z } from "zod";
import { signUp } from "@aws-amplify/auth";
import { redirect } from "next/navigation";

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

export type State = {
  errors?: {
    email?: string[];
    password?: string[];
    username?: string[];
  };
  message?: string | null;
};

export async function handleSignUp(
  prevState: State,
  formData: FormData,
): Promise<State> {
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
  } catch (error) {
    return {
      message: "Failed to create user.",
    };
  }

  redirect("/signup/confirm");
}
