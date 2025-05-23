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
import { ErrorMessage } from "@/components/forms/error-message";
import { useActionState } from "react";
import { ConfirmState, handleConfirmSignIn } from "@/lib/actions/signin-action";

export function ConfirmSignInForm() {
  const initialState: ConfirmState = {
    message: null,
    errors: {},
  };
  const [state, formAction] = useActionState(handleConfirmSignIn, initialState);

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <Mail className="mr-2" />
            You&apos;ve got mail
          </CardTitle>
          <CardDescription>
            Your one-time password is on the way. To log in, enter the code we
            emailed you. It may take a minute to arrive.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="code">One-Time Password</Label>
                </div>
                <Input
                  id="code"
                  name="code"
                  type="text"
                  required
                  placeholder="12345678"
                  maxLength={8}
                />
                {state.errors?.code && (
                  <ErrorMessage description={state.errors.code.join(" ")} />
                )}
              </div>
              {state.message && <ErrorMessage description={state.message} />}
              <Button type="submit" variant="default" className="w-full">
                Confirm
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
