import { cn } from "@/lib/utils";

interface SubmittedDateProps {
  createdAt?: string;
  updatedAt?: string;
  className?: string;
}

/**
 * Component to display a formatted submission date
 * @param createdAt - The creation date string
 * @param updatedAt - The updated date string (takes priority over createdAt)
 * @param className - Optional CSS classes to apply
 */
export default function SubmittedDate({
  createdAt,
  updatedAt,
  className,
}: SubmittedDateProps) {
  // Format the date - prioritize updatedAt over createdAt
  const formattedDate = createdAt
    ? new Date(updatedAt || createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown date";

  return (
    <div className={cn("text-sm text-muted-foreground", className)}>
      Submitted on {formattedDate}
    </div>
  );
}
