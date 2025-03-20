import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function CreatePromptButton() {
  return (
    <Button asChild className="bg-violet-500 hover:bg-violet-600">
      <Link href="/prompts/create" className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Create Prompt
      </Link>
    </Button>
  );
}
