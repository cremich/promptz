import { Edit } from "lucide-react";
import Link from "next/link";

export default function EditButton({
  showButtonText = false,
  href,
  name,
}: {
  href: string;
  name: string;
  showButtonText?: boolean;
}) {
  return (
    <Link
      data-testid="edit-button"
      href={href}
      className="py-2 px-3 rounded border-gray-800 border hover:bg-violet-700"
    >
      <Edit className="h-4 w-4" />
      {showButtonText && <span>{name}</span>}
    </Link>
  );
}
