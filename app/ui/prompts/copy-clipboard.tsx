"use client";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

export default function CopyClipBoardButton({ text }: { text: string }) {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast("Prompt copied.", {
        description:
          "Now, go build. And paste the prompt into your Amazon Q Developer client.",
      });
    } catch (err) {
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
      <Copy className="mr-2 h-4 w-4" />
      Copy
    </Button>
  );
}
