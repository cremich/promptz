import Author from "@/app/ui/prompts/author";
import Tags from "@/app/ui/prompts/tags";
import { HelpCircle, Terminal } from "lucide-react";
import AttributeCard from "@/app/ui/prompts/attribute-card";
import AttributeCardCopy from "@/app/ui/prompts/attribute-card-copy";
import CopyClipBoardButton from "@/app/ui/prompts/copy-clipboard";
import EditPromptButton from "@/app/ui/prompts/edit-prompt-button";
import { fetchCurrentAuthUser } from "@/app/lib/actions/cognito-server";
import { Badge } from "@/components/ui/badge";
import StarPromptButton from "@/app/ui/prompts/star-prompt";
import { isStarredByUser } from "@/app/lib/actions/stars";
import { PromptSource } from "@/app/ui/prompts/prompt-source";
import { Prompt } from "@/app/lib/definitions";

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
      {props.prompt.howto && (
        <AttributeCard
          title="How to Use"
          icon={HelpCircle}
          text={props.prompt.howto}
        />
      )}

      {props.prompt.instruction && (
        <AttributeCardCopy
          title="Prompt"
          icon={Terminal}
          text={props.prompt.instruction}
        />
      )}

      {props.prompt.sourceURL && <PromptSource url={props.prompt.sourceURL} />}
    </div>
  );
}
