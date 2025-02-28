import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

export type ErrorMessageProps = {
  title?: string;
  description: string;
};

export function ErrorMessage(props: ErrorMessageProps) {
  return (
    <Alert className="bg-rose-500">
      <Terminal className="h-4 w-4" />
      <AlertTitle>Heads up! {props.title}</AlertTitle>
      <AlertDescription>{props.description}</AlertDescription>
    </Alert>
  );
}
