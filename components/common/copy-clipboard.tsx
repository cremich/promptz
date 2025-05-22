"use client";
import { Schema } from "../../amplify/data/resource";
import { ModelType } from "@/lib/forms/schema-definitions";
import { Button } from "@/components/ui/button";
import { generateClient } from "aws-amplify/api";
import { Copy } from "lucide-react";
import { toast } from "sonner";

const api = generateClient<Schema>();

export default function CopyClipBoardButton({
  id,
  text,
  type,
  showButtonText = false,
}: {
  id: string;
  text: string;
  type: ModelType;
  showButtonText?: boolean;
}) {
  const copyToClipboard = async () => {
    try {
      const clipboardPromise = navigator.clipboard.writeText(text);
      let apiPromise;
      if (type === ModelType.PROMPT) {
        apiPromise = api.mutations.copyPrompt({
          id,
        });
      } else if (type === ModelType.RULE) {
        apiPromise = api.mutations.copyProjectRule({
          id,
        });
      }
      Promise.allSettled([clipboardPromise, apiPromise]);
      toast("Copied.", {
        description: "Now, go build.",
      });
    } catch {
      toast("Failed to copy", {
        description: "Please try again",
      });
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="border-gray-800 bg-transparent text-white hover:bg-violet-700"
      onClick={copyToClipboard}
    >
      <Copy className="h-4 w-4" />
      {showButtonText && <span>Copy {type}</span>}
    </Button>
  );
}
