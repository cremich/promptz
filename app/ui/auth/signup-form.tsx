"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState, useState } from "react";
import { handleSignUp, SignUpState } from "@/app/lib/actions/cognito";
import Link from "next/link";
import { ErrorMessage } from "@/app/ui/error-message";

export function SignUpForm() {
  const initialState: SignUpState = {
    message: null,
    errors: {},
  };
  const [email, setEmail] = useState("");
  const [state, formAction] = useActionState(handleSignUp, initialState);

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create Your Account</CardTitle>
          <CardDescription>
            Enter your email, and preferred username below to create a new
            account for Promptz.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-3">
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {state.errors?.email &&
                state.errors.email.map((error: string, index: number) => (
                  <ErrorMessage description={error} key={index} />
                ))}
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="username">Username</Label>
                </div>
                <Input id="username" type="text" name="username" required />
              </div>
              {state.errors?.username &&
                state.errors.username.map((error: string, index: number) => (
                  <ErrorMessage description={error} key={index} />
                ))}
              <Button type="submit" className="w-full">
                Create Account
              </Button>
              {state.message && <ErrorMessage description={state.message} />}
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link
                key="log-in"
                href="/login"
                className="underline underline-offset-4"
              >
                Log In
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
