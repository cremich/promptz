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
import Link from "next/link";
import { useState, useActionState } from "react";
import { ErrorMessage } from "@/components/forms/error-message";
import { handleSignIn, LoginState } from "@/lib/actions/signin-action";

export function LoginForm() {
  const initialState: LoginState = {
    message: null,
    errors: {},
  };
  const [email, setEmail] = useState("");
  const [state, formAction] = useActionState(handleSignIn, initialState);

  return (
    <div className={"flex flex-col gap-6"}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to request a one-time password to login to
            your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
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
              <Button type="submit" className="w-full">
                Send One-Time Password
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link
                key="log-in"
                href="/signup"
                className="underline underline-offset-4"
              >
                Create an account
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
