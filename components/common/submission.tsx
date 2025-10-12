import { cn } from "@/lib/utils";

interface SubmittedDateProps {
  createdAt?: string;
  updatedAt?: string;
  author?: string;
  className?: string;
}

/**
 * Component to display submission information
 * @param createdAt - The creation date string
 * @param updatedAt - The updated date string (takes priority over createdAt)
 * @param author - The author of the submission
 * @param className - Optional CSS classes to apply
 */
export default function Submission({
  createdAt,
  updatedAt,
  author,
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

  const authorText = author ? `by @${author}` : ``;

  return (
    <div className="flex items-center gap-3">
      <div className={cn("text-sm text-muted-foreground", className)}>
        Submitted on {formattedDate} {authorText}
      </div>
    </div>
  );
}
