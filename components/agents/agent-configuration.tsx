import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";
import { Agent } from "@/lib/models/agent-model";

interface AgentConfigurationProps {
  title: string;
  agent: Agent;
  icon: LucideIcon;
}

export default function AgentConfiguration({
  title,
  agent,
  icon: Icon,
}: AgentConfigurationProps) {
  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-center gap-2">
        <Icon className="h-6 w-6 text-violet-400" />
        <h2 className="text-xl font-semibold">{title}</h2>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tools Section */}
        {agent.tools && agent.tools.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-3">Tools</h3>
            <div className="flex flex-wrap gap-2">
              {agent.tools.map((tool, index) => (
                <Badge key={index} variant="secondary">
                  {tool}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Allowed Tools Section */}
        {agent.allowedTools && agent.allowedTools.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-3">Allowed Tools</h3>
            <div className="flex flex-wrap gap-2">
              {agent.allowedTools.map((tool, index) => (
                <Badge key={index} variant="outline">
                  {tool}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Resources Section */}
        {agent.resources && agent.resources.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-3">Resources</h3>
            <div className="space-y-2">
              {agent.resources.map((resource, index) => (
                <div key={index} className="text-sm text-gray-400 font-mono">
                  {resource}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MCP Servers Section */}
        {agent.mcpServers && Object.keys(agent.mcpServers).length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-3">MCP Servers</h3>
            <div className="bg-gray-900 rounded-lg p-4">
              <pre className="text-sm text-gray-300 overflow-x-auto">
                {JSON.stringify(agent.mcpServers, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Hooks Section */}
        {agent.hooks && Object.keys(agent.hooks).length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-3">Hooks</h3>
            <div className="bg-gray-900 rounded-lg p-4">
              <pre className="text-sm text-gray-300 overflow-x-auto">
                {JSON.stringify(agent.hooks, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Tool Settings Section */}
        {agent.toolsSettings && Object.keys(agent.toolsSettings).length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-3">Tool Settings</h3>
            <div className="bg-gray-900 rounded-lg p-4">
              <pre className="text-sm text-gray-300 overflow-x-auto">
                {JSON.stringify(agent.toolsSettings, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Tool Aliases Section */}
        {agent.toolAliases && Object.keys(agent.toolAliases).length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-3">Tool Aliases</h3>
            <div className="bg-gray-900 rounded-lg p-4">
              <pre className="text-sm text-gray-300 overflow-x-auto">
                {JSON.stringify(agent.toolAliases, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Legacy MCP JSON Flag */}
        {agent.useLegacyMcpJson !== undefined && (
          <div>
            <h3 className="text-lg font-medium mb-3">Configuration Options</h3>
            <div className="flex items-center gap-2">
              <Badge variant={agent.useLegacyMcpJson ? "default" : "secondary"}>
                Legacy MCP JSON:{" "}
                {agent.useLegacyMcpJson ? "Enabled" : "Disabled"}
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
