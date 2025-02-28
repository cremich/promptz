import { fetchPrompt } from "@/app/lib/actions/prompts";
import Author from "@/app/ui/prompts/author";
import Tags from "@/app/ui/prompts/tags";
import { FileText, HelpCircle, Terminal } from "lucide-react";
import AttributeCard from "@/app/ui/prompts/attribute-card";
import AttributeCardCopy from "@/app/ui/prompts/attribute-card-copy";
import CopyClipBoardButton from "@/app/ui/prompts/copy-clipboard";
import EditPromptButton from "@/app/ui/prompts/edit-prompt-button";
import { fetchCurrentAuthUser } from "@/app/lib/actions/cognito-server";
import { Badge } from "@/components/ui/badge";

interface PromptProps {
  promptId: string;
}

export default async function Prompt(props: PromptProps) {
  const promisePrompt = await fetchPrompt(props.promptId);
  const promiseUser = await fetchCurrentAuthUser();
  const [prompt, user] = await Promise.all([promisePrompt, promiseUser]);

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{prompt.title}</h1>
        </div>
        <div className="flex gap-2">
          {prompt.id && prompt.authorId === user.id && (
            <EditPromptButton id={prompt.id} />
          )}
          {prompt.instruction && (
            <CopyClipBoardButton text={prompt.instruction} />
          )}
        </div>
      </div>
      <div className="flex items-start justify-between mb-8">
        <div className="mt-4 flex items-center gap-4">
          {prompt.author && <Author name={prompt.author} />}
          {prompt.tags && <Tags tags={prompt.tags} />}
        </div>
        <div className="mt-4">
          <Badge
            key="visibility"
            variant="secondary"
            className=" border-dashed border-violet-500 hover:bg-neutral-600"
          >
            {prompt.public === true ? "Public" : "Private"}
          </Badge>
        </div>
      </div>
      {prompt.description && (
        <AttributeCard
          title="Description"
          icon={FileText}
          text={prompt.description}
        />
      )}
      {prompt.howto && (
        <AttributeCard
          title="How to Use"
          icon={HelpCircle}
          text={prompt.howto}
        />
      )}

      {prompt.instruction && (
        <AttributeCardCopy
          title="Prompt"
          icon={Terminal}
          text={prompt.instruction}
        />
      )}
    </div>
  );
}
