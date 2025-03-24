"use client";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

export default function CopyClipBoardButton({
  text,
  showButtonText = false,
}: {
  text: string;
  showButtonText?: boolean;
}) {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
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
      {showButtonText && <span>Copy Prompt</span>}
    </Button>
  );
}
