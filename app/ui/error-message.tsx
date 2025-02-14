import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

export type ErrorMessageProps = {
  description: string;
};

export function ErrorMessage(props: ErrorMessageProps) {
  return (
    <Alert className="bg-rose-500">
      <Terminal className="h-4 w-4" />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>{props.description}</AlertDescription>
    </Alert>
  );
}
