import { ProjectRule } from "@/app/lib/definitions";
import { Button } from "@/components/ui/button";
import { Edit, ExternalLink } from "lucide-react";
import Link from "next/link";
import Tags from "@/app/ui/common/tags";
import Author from "@/app/ui/common/author";
import { ScrollArea } from "@radix-ui/react-scroll-area";

// Define the props for the component
interface ProjectRuleDetailProps {
  projectRule: ProjectRule;
  isOwner: boolean;
}

/**
 * Component to display the details of a project rule
 * @param projectRule - The project rule to display
 * @param isOwner - Whether the current user is the owner of the project rule
 */
export default function ProjectRuleDetail({
  projectRule,
  isOwner,
}: ProjectRuleDetailProps) {
  // Format the creation date
  const formattedDate = projectRule.createdAt
    ? new Date(projectRule.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown date";

  return (
    <div className="flex flex-col space-y-6  mx-auto">
      {/* Header section with title, description, and actions */}
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">
            {projectRule.title}
          </h1>

          <div className="flex items-center gap-2">
            {/* Show edit button only if the user is the owner */}
            {isOwner && (
              <Button asChild variant="outline">
                <Link href={`/rules/edit/${projectRule.id}`}>
                  <Edit className="h-4 w-4" />
                  Edit
                </Link>
              </Button>
            )}

            {/* External source link if available */}
            {projectRule.sourceURL && (
              <Button asChild variant="ghost">
                <a
                  href={projectRule.sourceURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View source"
                >
                  <ExternalLink className="h-4 w-4" />
                  Source
                </a>
              </Button>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-muted-foreground">{projectRule.description}</p>

        {/* Tags */}
        {projectRule.tags && projectRule.tags.length > 0 && (
          <Tags tags={projectRule.tags} />
        )}

        {/* Metadata - Author and date */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div className="flex items-center">
            {projectRule.author && <Author name={projectRule.author} />}
          </div>
          <div className="text-sm text-muted-foreground">
            Created on {formattedDate}
          </div>
        </div>
      </div>

      {/* Rule content */}
      <div className="mt-6">
        <div className="bg-muted rounded-md p-4 overflow-auto">
          <ScrollArea className="h-96">
            <pre className="whitespace-pre-wrap text-sm">
              {projectRule.content}
            </pre>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
