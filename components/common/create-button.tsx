import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

interface CreateButtonProps {
  href: string;
  name: string;
}

export default function CreateButton(props: CreateButtonProps) {
  return (
    <Button asChild className="bg-violet-500 hover:bg-violet-600">
      <Link href={props.href}>
        <Plus className="mr-2 h-4 w-4" />
        {props.name}
      </Link>
    </Button>
  );
}
