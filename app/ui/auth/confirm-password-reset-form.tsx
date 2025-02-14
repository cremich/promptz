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
import { Mail } from "lucide-react";
import {
  ConfirmPasswordResetState,
  handlePasswordReset,
} from "@/app/lib/actions/cognito";
import { ErrorMessage } from "@/app/ui/error-message";
import { useActionState } from "react";

export function ConfirmPasswordResetForm() {
  const initialState: ConfirmPasswordResetState = {
    message: null,
    errors: {},
  };
  const [state, formAction] = useActionState(handlePasswordReset, initialState);

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <Mail className="mr-2" />
            You've got mail
          </CardTitle>
          <CardDescription>
            Your code is on the way. To reset your password, enter the code we
            emailed you, and set a new password. The mail may take a minute to
            arrive.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="code">Confirmation Code</Label>
                </div>
                <Input
                  id="code"
                  name="code"
                  type="text"
                  required
                  placeholder="123456"
                  maxLength={6}
                />
                {state.errors?.code && (
                  <ErrorMessage description={state.errors.code.join(" ")} />
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input id="password" type="password" name="password" required />
              </div>
              {state.errors?.password && (
                <ErrorMessage description={state.errors.password.join(".")} />
              )}
              {state.message && <ErrorMessage description={state.message} />}
              <Button type="submit" variant="default" className="w-full">
                Reset Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
