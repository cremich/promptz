import Author from "@/app/ui/common/author";
import Tags from "@/app/ui/common/tags";
import { HelpCircle, Terminal } from "lucide-react";
import PromptInstruction from "@/app/ui/prompts/prompt-instruction";
import CopyClipBoardButton from "@/app/ui/common/copy-clipboard";
import EditPromptButton from "@/app/ui/prompts/edit-prompt-button";
import { fetchCurrentAuthUser } from "@/app/lib/actions/cognito-server";
import { Badge } from "@/components/ui/badge";
import StarPromptButton from "@/app/ui/prompts/star-prompt";
import { isStarredByUser } from "@/app/lib/actions/stars";
import { SourceURL } from "@/app/ui/common/source-url";
import { Prompt } from "@/app/lib/definitions";
import HowTo from "@/app/ui/prompts/howto";

interface PromptProps {
  prompt: Prompt;
}

export default async function PromptDetail(props: PromptProps) {
  const user = await fetchCurrentAuthUser();

  const starredByUser =
    user.guest === false
      ? await isStarredByUser(props.prompt.id!, user.id)
      : false;

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
          {props.prompt.id && (
            <StarPromptButton
              prompt={props.prompt}
              user={user}
              starred={starredByUser}
            />
          )}
          {props.prompt.slug && props.prompt.authorId === user.id && (
            <EditPromptButton slug={props.prompt.slug} />
          )}
          {props.prompt.instruction && (
            <CopyClipBoardButton text={props.prompt.instruction} />
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
              icon={Terminal}
              text={props.prompt.instruction!}
            />
          </div>
        )}
        {props.prompt.howto && (
          <div className="lg:col-span-1">
            <HowTo
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
