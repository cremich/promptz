import Tags from "@/components/common/tags";
import { HelpCircle, Terminal } from "lucide-react";
import PromptInstruction from "@/components/prompt/prompt-instruction";
import CopyClipBoardButton from "@/components/common/copy-clipboard";
import { SourceURL } from "@/components/common/source-url";
import PromptHowTo from "@/components/prompt/prompt-howto";
import { Prompt } from "@/lib/models/prompt-model";
import Submission from "@/components/common/submission";

interface PromptProps {
  prompt: Prompt;
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
              {props.prompt.content && (
                <>
                  <CopyClipBoardButton text={props.prompt.content} />
                </>
              )}
            </div>
          </div>

          {/* Stats and metadata */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Tags and metadata */}
            <Submission
              createdAt={props.prompt.createdAt}
              updatedAt={props.prompt.updatedAt}
              author={props.prompt.author}
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
