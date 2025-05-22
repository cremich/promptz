import Author from "@/components/common/author";
import Tags from "@/components/common/tags";
import { HelpCircle, Terminal } from "lucide-react";
import PromptInstruction from "@/components/prompt/prompt-instruction";
import CopyClipBoardButton from "@/components/common/copy-clipboard";
import { Badge } from "@/components/ui/badge";
import { SourceURL } from "@/components/common/source-url";
import { ModelType } from "@/lib/forms/schema-definitions";
import PromptHowTo from "@/components/prompt/prompt-howto";
import EditButton from "@/components/common/edit-button";
import { Prompt } from "@/lib/models/prompt-model";

interface PromptProps {
  prompt: Prompt;
  isOwner: boolean;
}

export default async function PromptDetail(props: PromptProps) {
  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {props.prompt.title}
          </h1>
          <p className="text-muted-foreground">{props.prompt.description}</p>
        </div>
        <div className="flex gap-2">
          {props.prompt.slug && props.isOwner && (
            <EditButton
              href={`/prompts/prompt/${props.prompt.slug}/edit`}
              name="Edit Prompt"
            />
          )}
          {props.prompt.instruction && (
            <CopyClipBoardButton
              id={props.prompt.id!}
              type={ModelType.PROMPT}
              text={props.prompt.instruction}
            />
          )}
        </div>
      </div>
      <div className="flex items-start justify-between mb-8">
        <div className="mt-4 flex items-center gap-4">
          {props.prompt.author && <Author name={props.prompt.author} />}
          {props.prompt.tags && <Tags tags={props.prompt.tags} />}
        </div>
        <div className="mt-4">
          <Badge
            key="visibility"
            variant="secondary"
            className=" border-dashed border-violet-500 hover:bg-neutral-600"
          >
            {props.prompt.public === true ? "Public" : "Private"}
          </Badge>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {props.prompt.instruction && (
          <div
            className={`overflow-hidden gap-4 ${props.prompt.howto ? "lg:col-span-2" : "lg:col-span-3"}`}
          >
            <PromptInstruction
              title="Prompt"
              promptId={props.prompt.id!}
              icon={Terminal}
              text={props.prompt.instruction!}
            />
          </div>
        )}
        {props.prompt.howto && (
          <div className="lg:col-span-1">
            <PromptHowTo
              title="How to Use"
              icon={HelpCircle}
              text={props.prompt.howto}
            />
          </div>
        )}
      </div>

      {props.prompt.sourceURL && <SourceURL url={props.prompt.sourceURL} />}
    </div>
  );
}
