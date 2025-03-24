import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function CreateProjectRuleButton() {
  return (
    <Button asChild className="bg-violet-500 hover:bg-violet-600">
      <Link href="/rules/create">
        <Plus className="mr-2 h-4 w-4" />
        Create Rule
      </Link>
    </Button>
  );
}
