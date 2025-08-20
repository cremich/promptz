import Tags from "@/components/common/tags";
import {
  Terminal,
  Settings,
  Copy,
  Download,
  Wrench,
  Server,
  FileText,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { SourceURL } from "@/components/common/source-url";
import { ModelType } from "@/lib/forms/schema-definitions";
import EditButton from "@/components/common/edit-button";
import { Agent } from "@/lib/models/agent-model";
import { DownloadButton } from "@/components/common/download-button";
import PromptInstruction from "@/components/prompt/prompt-instruction";
import Submission from "@/components/common/submission";

interface AgentProps {
  agent: Agent;
  isOwner: boolean;
}

export default function AgentDetail(props: AgentProps) {
  return (
    <div className="flex flex-col space-y-8 mx-auto">
      {/* Modern Hero Section */}
      <div
        className="relative bg-gradient-to-br from-violet-900/20 via-purple-900/10 to-indigo-900/20 rounded-2xl p-8 border border-violet-500/20"
        data-testid="agent-hero-section"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-purple-500/5 rounded-2xl" />
        <div className="relative z-10">
          {/* Header with title and actions */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-3">
                {props.agent.name}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                {props.agent.description}
              </p>
              {/* Tags positioned below description */}
              {props.agent.tags && props.agent.tags.length > 0 && (
                <Tags tags={props.agent.tags} />
              )}
            </div>

            <div className="flex items-center gap-3">
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

          {/* Stats and metadata */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Agent stats */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                <Copy className="h-4 w-4 text-violet-400" />
                <span className="text-sm font-medium">
                  <span data-testid="copy-count">
                    {props.agent.copyCount || 0}
                  </span>{" "}
                  copies
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                <Download className="h-4 w-4 text-violet-400" />
                <span className="text-sm font-medium">
                  <span data-testid="download-count">
                    {props.agent.downloadCount || 0}
                  </span>{" "}
                  downloads
                </span>
              </div>
            </div>

            {/* Tags and metadata */}
            <Submission
              createdAt={props.agent.createdAt}
              updatedAt={props.agent.updatedAt}
              author={props.agent.author}
              scope={props.agent.scope}
            />
          </div>
        </div>
      </div>

      {/* System Prompt Section */}
      {props.agent.prompt && (
        <div
          className="bg-gradient-to-r from-slate-900/50 to-gray-900/50 rounded-xl border border-slate-700/50"
          data-testid="system-prompt-section"
        >
          <PromptInstruction
            title="System Prompt"
            promptId={props.agent.id!}
            icon={Terminal}
            text={props.agent.prompt!}
          />
        </div>
      )}

      {/* Enhanced Configuration Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <Settings className="h-6 w-6 text-violet-400" />
          Agent Configuration
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tools Configuration */}
          {((props.agent.tools && props.agent.tools.length > 0) ||
            (props.agent.allowedTools &&
              props.agent.allowedTools.length > 0)) && (
            <Card
              className="bg-gradient-to-br from-blue-900/10 to-cyan-900/10 border-blue-500/20"
              data-testid="tools-card"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-blue-400" />
                  <h3 className="text-lg font-semibold">Tools</h3>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {props.agent.tools && props.agent.tools.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">
                      Available Tools
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {props.agent.tools.map((tool, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="border-blue-400/30 text-blue-300"
                        >
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {props.agent.allowedTools &&
                  props.agent.allowedTools.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">
                        Allowed Tools
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {props.agent.allowedTools.map((tool, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="border-green-400/30 text-green-300"
                          >
                            {tool}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
              </CardContent>
            </Card>
          )}

          {/* Resources Configuration */}
          {props.agent.resources && props.agent.resources.length > 0 && (
            <Card
              className="bg-gradient-to-br from-green-900/10 to-emerald-900/10 border-green-500/20"
              data-testid="resources-card"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-400" />
                  <h3 className="text-lg font-semibold">Resources</h3>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {props.agent.resources.map((resource, index) => (
                    <div
                      key={index}
                      className="text-sm font-mono bg-black/20 rounded px-3 py-2 border border-green-500/20"
                    >
                      {resource}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* MCP Servers Configuration */}
          {props.agent.mcpServers &&
            Object.keys(props.agent.mcpServers).length > 0 && (
              <Card
                className="bg-gradient-to-br from-purple-900/10 to-pink-900/10 border-purple-500/20"
                data-testid="mcp-servers-card"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Server className="h-5 w-5 text-purple-400" />
                    <h3 className="text-lg font-semibold">MCP Servers</h3>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-black/30 rounded-lg p-4 border border-purple-500/20">
                    <pre className="text-sm text-gray-300 overflow-x-auto">
                      {JSON.stringify(props.agent.mcpServers, null, 2)}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            )}

          {/* Hooks Configuration */}
          {props.agent.hooks && Object.keys(props.agent.hooks).length > 0 && (
            <Card className="bg-gradient-to-br from-orange-900/10 to-red-900/10 border-orange-500/20">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-orange-400" />
                  <h3 className="text-lg font-semibold">Hooks</h3>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-black/30 rounded-lg p-4 border border-orange-500/20">
                  <pre className="text-sm text-gray-300 overflow-x-auto">
                    {JSON.stringify(props.agent.hooks, null, 2)}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tool Settings */}
          {props.agent.toolsSettings &&
            Object.keys(props.agent.toolsSettings).length > 0 && (
              <Card className="bg-gradient-to-br from-indigo-900/10 to-blue-900/10 border-indigo-500/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-indigo-400" />
                    <h3 className="text-lg font-semibold">Tool Settings</h3>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-black/30 rounded-lg p-4 border border-indigo-500/20">
                    <pre className="text-sm text-gray-300 overflow-x-auto">
                      {JSON.stringify(props.agent.toolsSettings, null, 2)}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            )}

          {/* Tool Aliases */}
          {props.agent.toolAliases &&
            Object.keys(props.agent.toolAliases).length > 0 && (
              <Card className="bg-gradient-to-br from-teal-900/10 to-cyan-900/10 border-teal-500/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-5 w-5 text-teal-400" />
                    <h3 className="text-lg font-semibold">Tool Aliases</h3>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-black/30 rounded-lg p-4 border border-teal-500/20">
                    <pre className="text-sm text-gray-300 overflow-x-auto">
                      {JSON.stringify(props.agent.toolAliases, null, 2)}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            )}

          {/* Configuration Options */}
          {props.agent.useLegacyMcpJson !== undefined && (
            <Card className="bg-gradient-to-br from-gray-900/10 to-slate-900/10 border-gray-500/20">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-gray-400" />
                  <h3 className="text-lg font-semibold">
                    Configuration Options
                  </h3>
                </div>
              </CardHeader>
              <CardContent>
                <Badge variant="outline" className="border-gray-400/30">
                  Legacy MCP JSON:{" "}
                  {props.agent.useLegacyMcpJson ? "Enabled" : "Disabled"}
                </Badge>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {props.agent.sourceURL && <SourceURL url={props.agent.sourceURL} />}
    </div>
  );
}
