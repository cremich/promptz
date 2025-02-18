import { Edit } from "lucide-react";
import Link from "next/link";

export default function EditPromptButton({
  id,
  showButtonText = false,
}: {
  id: string;
  showButtonText?: boolean;
}) {
  return (
    <Link
      href={`/prompt/${id}/edit`}
      className="py-2 px-3 rounded border-gray-800 border hover:bg-violet-700"
    >
      <Edit className="h-4 w-4" />
      {showButtonText && <span>Edit prompt</span>}
    </Link>
  );
}
