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

export function ConfirmSignUpForm() {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <Mail className="mr-2" />
            You've got mail
          </CardTitle>
          <CardDescription>
            Your code is on the way. To log in, enter the code we emailed you.
            It may take a minute to arrive.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="code">Confirmation Code</Label>
                </div>
                <Input id="code" type="text" required placeholder="123456" />
              </div>
              <Button variant={"default"} className="w-full">
                Confirm
              </Button>
              <Button variant={"secondary"} className="w-full">
                Resend Code
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
