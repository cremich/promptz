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
import {
  handleRequestPassword,
  RequestPasswordState,
} from "@/app/lib/actions/cognito";
import { useState, useActionState } from "react";
import { ErrorMessage } from "@/app/ui/error-message";

export function RequestPasswordForm() {
  const initialState: RequestPasswordState = {
    message: null,
    errors: {},
  };
  const [email, setEmail] = useState("");
  const [state, formAction] = useActionState(
    handleRequestPassword,
    initialState,
  );
  return (
    <div className={"flex flex-col gap-6"}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Forgot Your Password</CardTitle>
          <CardDescription>
            Enter your email below to reset your password.
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
                state.errors.email.map((error: string) => (
                  <ErrorMessage description={error} />
                ))}
              <Button type="submit" className="w-full">
                Request Password Reset
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Remember your password?{" "}
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
