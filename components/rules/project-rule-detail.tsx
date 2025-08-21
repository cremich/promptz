import { ModelType } from "@/lib/forms/schema-definitions";
import { ProjectRule } from "@/lib/models/project-rule-model";
import Tags from "@/components/common/tags";
import { SourceURL } from "@/components/common/source-url";
import CopyClipBoardButton from "@/components/common/copy-clipboard";
import { DownloadButton } from "@/components/common/download-button";
import { ScrollArea } from "@/components/ui/scroll-area";
import EditButton from "@/components/common/edit-button";
import Submission from "@/components/common/submission";
import { Copy, Download, FileText } from "lucide-react";

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
  return (
    <div className="flex flex-col space-y-8 mx-auto">
      {/* Modern Hero Section */}
      <div
        className="relative bg-gradient-to-br from-violet-900/20 via-purple-900/10 to-indigo-900/20 rounded-2xl p-8 border border-violet-500/20"
        data-testid="project-rule-hero-section"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-purple-500/5 rounded-2xl" />
        <div className="relative z-10">
          {/* Header with title and actions */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-3">
                {projectRule.name}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                {projectRule.description}
              </p>
              {/* Tags positioned below description */}
              {projectRule.tags && projectRule.tags.length > 0 && (
                <Tags tags={projectRule.tags} />
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Show edit button only if the user is the owner */}
              {isOwner && projectRule.slug && (
                <EditButton
                  href={`/rules/rule/${projectRule.slug}/edit`}
                  name="Edit Rule"
                />
              )}
              {projectRule.content && (
                <>
                  <CopyClipBoardButton
                    id={projectRule.id!}
                    type={ModelType.RULE}
                    text={projectRule.content}
                  />
                  <DownloadButton
                    id={projectRule.id!}
                    content={projectRule.content}
                    filename={`promptz-rule-${projectRule.slug}.md`}
                    label="Download"
                    modelType={ModelType.RULE}
                  />
                </>
              )}
            </div>
          </div>

          {/* Stats and metadata */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Project rule stats */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                <Copy className="h-4 w-4 text-violet-400" />
                <span className="text-sm font-medium">
                  <span data-testid="copy-count">
                    {projectRule.copyCount || 0}
                  </span>{" "}
                  copies
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                <Download className="h-4 w-4 text-violet-400" />
                <span className="text-sm font-medium">
                  <span data-testid="download-count">
                    {projectRule.downloadCount || 0}
                  </span>{" "}
                  downloads
                </span>
              </div>
            </div>

            {/* Metadata */}
            <Submission
              createdAt={projectRule.createdAt}
              updatedAt={projectRule.updatedAt}
              author={projectRule.author}
              scope={projectRule.scope}
            />
          </div>
        </div>
      </div>

      {/* Rule Content Section */}
      {projectRule.content && (
        <div
          className="bg-gradient-to-r from-slate-900/50 to-gray-900/50 rounded-xl border border-slate-700/50"
          data-testid="project-rule-content-section"
        >
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="h-5 w-5 text-violet-400" />
              <h2 className="text-xl font-semibold">Project Rule</h2>
            </div>
            <ScrollArea className="h-96">
              <pre className="whitespace-pre-wrap text-sm text-gray-300">
                {projectRule.content}
              </pre>
            </ScrollArea>
          </div>
        </div>
      )}

      {projectRule.sourceURL && <SourceURL url={projectRule.sourceURL} />}
    </div>
  );
}
