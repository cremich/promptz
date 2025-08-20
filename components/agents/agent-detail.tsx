import Author from "@/components/common/author";
import Tags from "@/components/common/tags";
import { Terminal, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SourceURL } from "@/components/common/source-url";
import { ModelType } from "@/lib/forms/schema-definitions";
import EditButton from "@/components/common/edit-button";
import { Agent } from "@/lib/models/agent-model";
import AgentConfiguration from "@/components/agents/agent-configuration";
import { DownloadButton } from "@/components/common/download-button";
import PromptInstruction from "@/components/prompt/prompt-instruction";

interface AgentProps {
  agent: Agent;
  isOwner: boolean;
}

export default function AgentDetail(props: AgentProps) {
  // Format the creation date
  const formattedDate = props.agent.createdAt
    ? new Date(
        props.agent.updatedAt || props.agent.createdAt,
      ).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown date";

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {props.agent.name}
          </h1>
          <p className="text-muted-foreground">{props.agent.description}</p>
        </div>
        <div className="flex gap-2">
          {props.agent.slug && props.isOwner && (
            <EditButton
              href={`/agents/agent/${props.agent.slug}/edit`}
              name="Edit Agent"
            />
          )}
          {props.agent.id && props.agent.name && (
            <DownloadButton
              content={props.agent}
              modelType={ModelType.AGENT}
              id={props.agent.id}
              filename={props.agent.name}
            />
          )}
        </div>
      </div>
      <div className="flex items-start justify-between mb-8">
        <div className="mt-4 flex items-center gap-4">
          {props.agent.author && <Author name={props.agent.author} />}
          {props.agent.tags && <Tags tags={props.agent.tags} />}
        </div>
        <div className="mt-4 flex flex-col items-end gap-2">
          <Badge
            key="visibility"
            variant="secondary"
            className=" border-dashed border-violet-500 hover:bg-neutral-600"
          >
            {props.agent.scope === "PUBLIC" ? "Public" : "Private"}
          </Badge>
          <div className="text-sm text-muted-foreground">
            Submitted on {formattedDate}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {props.agent.prompt && (
          <div className={`overflow-hidden gap-4 lg:col-span-3}`}>
            <PromptInstruction
              title="System Prompt"
              promptId={props.agent.id!}
              icon={Terminal}
              text={props.agent.prompt!}
            />
          </div>
        )}
      </div>

      {/* Agent Configuration Section */}
      <div className="mt-8">
        <AgentConfiguration
          title="Agent Configuration"
          agent={props.agent}
          icon={Settings}
        />
      </div>

      {props.agent.sourceURL && <SourceURL url={props.agent.sourceURL} />}
    </div>
  );
}
