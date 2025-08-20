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
import SubmittedDate from "@/components/common/submitted-date";

interface AgentProps {
  agent: Agent;
  isOwner: boolean;
}

export default function AgentDetail(props: AgentProps) {
  return (
    <div className="flex flex-col space-y-6 mx-auto">
      {/* Header section with title, description, and actions */}
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">
            {props.agent.name}
          </h1>

          <div className="flex items-center gap-2">
            {/* Show edit button only if the user is the owner */}
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

        {/* Description */}
        <p className="text-muted-foreground">{props.agent.description}</p>

        {/* Tags */}
        {props.agent.tags && props.agent.tags.length > 0 && (
          <Tags tags={props.agent.tags} />
        )}

        {/* Metadata - Author, visibility, and date */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div className="flex items-center">
            {props.agent.author && <Author name={props.agent.author} />}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <Badge
              key="visibility"
              variant="secondary"
              className="border-dashed border-violet-500 hover:bg-neutral-600"
            >
              {props.agent.scope === "PUBLIC" ? "Public" : "Private"}
            </Badge>
            <SubmittedDate
              createdAt={props.agent.createdAt}
              updatedAt={props.agent.updatedAt}
            />
          </div>
        </div>
      </div>

      {/* Agent content sections */}
      {props.agent.prompt && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="overflow-hidden gap-4 lg:col-span-3">
            <PromptInstruction
              title="System Prompt"
              promptId={props.agent.id!}
              icon={Terminal}
              text={props.agent.prompt!}
            />
          </div>
        </div>
      )}

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
