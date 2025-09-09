import Tags from "@/components/common/tags";
import { HelpCircle, Terminal, Copy, Download } from "lucide-react";
import PromptInstruction from "@/components/prompt/prompt-instruction";
import CopyClipBoardButton from "@/components/common/copy-clipboard";
import { SourceURL } from "@/components/common/source-url";
import { ModelType } from "@/lib/forms/schema-definitions";
import PromptHowTo from "@/components/prompt/prompt-howto";
import EditButton from "@/components/common/edit-button";
import { Prompt } from "@/lib/models/prompt-model";
import Submission from "@/components/common/submission";
import { DownloadButton } from "@/components/common/download-button";

interface PromptProps {
  prompt: Prompt;
  isOwner: boolean;
}

export default async function PromptDetail(props: PromptProps) {
  return (
    <div className="flex flex-col space-y-8 mx-auto">
      {/* Modern Hero Section */}
      <div
        className="relative bg-gradient-to-br from-violet-900/20 via-purple-900/10 to-indigo-900/20 rounded-2xl p-8 border border-violet-500/20"
        data-testid="prompt-hero-section"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-purple-500/5 rounded-2xl" />
        <div className="relative z-10">
          {/* Header with title and actions */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-3">
                {props.prompt.name}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                {props.prompt.description}
              </p>
              {/* Tags positioned below description */}
              {props.prompt.tags && props.prompt.tags.length > 0 && (
                <Tags tags={props.prompt.tags} />
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Show edit button only if the user is the owner */}
              {props.prompt.slug && props.isOwner && (
                <EditButton
                  href={`/prompts/prompt/${props.prompt.slug}/edit`}
                  name="Edit Prompt"
                />
              )}
              {props.prompt.content && (
                <>
                  <CopyClipBoardButton
                    id={props.prompt.id!}
                    type={ModelType.PROMPT}
                    text={props.prompt.content}
                  />
                  <DownloadButton
                    id={props.prompt.id!}
                    content={props.prompt.content}
                    filename={`promptz-prompt-${props.prompt.slug}`}
                    label="Download"
                    modelType={ModelType.PROMPT}
                  />
                </>
              )}
            </div>
          </div>

          {/* Stats and metadata */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Prompt stats */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                <Copy className="h-4 w-4 text-violet-400" />
                <span className="text-sm font-medium">
                  <span data-testid="copy-count">
                    {props.prompt.copyCount || 0}
                  </span>{" "}
                  copies
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                <Download className="h-4 w-4 text-violet-400" />
                <span className="text-sm font-medium">
                  <span data-testid="download-count">
                    {props.prompt.downloadCount || 0}
                  </span>{" "}
                  downloads
                </span>
              </div>
            </div>

            {/* Tags and metadata */}
            <Submission
              createdAt={props.prompt.createdAt}
              updatedAt={props.prompt.updatedAt}
              author={props.prompt.author}
              scope={props.prompt.scope}
            />
          </div>
        </div>
      </div>

      {/* Prompt Content Section */}
      {props.prompt.content && (
        <div
          className="bg-gradient-to-r from-slate-900/50 to-gray-900/50 rounded-xl border border-slate-700/50"
          data-testid="prompt-content-section"
        >
          <PromptInstruction
            title="Prompt"
            icon={Terminal}
            text={props.prompt.content!}
          />
        </div>
      )}

      {/* How to Use Section */}
      {props.prompt.howto && (
        <div
          className="bg-gradient-to-r from-slate-900/50 to-gray-900/50 rounded-xl border border-slate-700/50"
          data-testid="prompt-howto-section"
        >
          <PromptHowTo
            title="How to Use"
            icon={HelpCircle}
            text={props.prompt.howto}
          />
        </div>
      )}

      {props.prompt.sourceURL && <SourceURL url={props.prompt.sourceURL} />}
    </div>
  );
}
