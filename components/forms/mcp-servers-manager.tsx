"use client";

import { useState } from "react";
import {
  Plus,
  Trash2,
  Settings,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { McpServerConfig } from "@/lib/models/agent-model";

interface McpServersManagerProps {
  value: Record<string, McpServerConfig>;
  onChange: (value: Record<string, McpServerConfig>) => void;
  className?: string;
}

export function McpServersManager({
  value = {},
  onChange,
  className,
}: McpServersManagerProps) {
  const [expandedServers, setExpandedServers] = useState<Set<string>>(
    new Set(),
  );
  const [newServerName, setNewServerName] = useState("");

  const servers = Object.entries(value);

  const toggleExpanded = (serverName: string) => {
    const newExpanded = new Set(expandedServers);
    if (newExpanded.has(serverName)) {
      newExpanded.delete(serverName);
    } else {
      newExpanded.add(serverName);
    }
    setExpandedServers(newExpanded);
  };

  const handleAddServer = () => {
    if (newServerName.trim() && !value[newServerName.trim()]) {
      const newServer: McpServerConfig = {
        command: "",
        args: [],
        env: {},
        timeout: undefined,
        disabled: false,
      };
      onChange({
        ...value,
        [newServerName.trim()]: newServer,
      });
      setExpandedServers(new Set([...expandedServers, newServerName.trim()]));
      setNewServerName("");
    }
  };

  const handleRemoveServer = (serverName: string) => {
    const newValue = { ...value };
    delete newValue[serverName];
    onChange(newValue);

    const newExpanded = new Set(expandedServers);
    newExpanded.delete(serverName);
    setExpandedServers(newExpanded);
  };

  const handleUpdateServer = (
    serverName: string,
    updates: Partial<McpServerConfig>,
  ) => {
    onChange({
      ...value,
      [serverName]: {
        ...value[serverName],
        ...updates,
      },
    });
  };

  const handleUpdateArgs = (serverName: string, args: string[]) => {
    handleUpdateServer(serverName, { args });
  };

  const handleUpdateEnv = (serverName: string, env: Record<string, string>) => {
    handleUpdateServer(serverName, { env });
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddServer();
    }
  };

  return (
    <div className={className}>
      <div className="space-y-4">
        {/* Existing servers */}
        {servers.length > 0 && (
          <div className="space-y-3">
            {servers.map(([serverName, config]) => (
              <Card key={serverName} className="border-gray-700">
                <Collapsible
                  open={expandedServers.has(serverName)}
                  onOpenChange={() => toggleExpanded(serverName)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CollapsibleTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-0 h-auto"
                          >
                            {expandedServers.has(serverName) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                        </CollapsibleTrigger>
                        <Settings className="h-4 w-4 text-gray-400" />
                        <CardTitle className="text-sm font-medium">
                          {serverName}
                        </CardTitle>
                        {config.disabled && (
                          <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
                            Disabled
                          </span>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveServer(serverName)}
                        className="shrink-0 border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardDescription className="text-xs">
                      Command: {config.command || "Not configured"}
                    </CardDescription>
                  </CardHeader>

                  <CollapsibleContent>
                    <CardContent className="pt-0 space-y-4">
                      {/* Command field */}
                      <div className="space-y-2">
                        <Label
                          htmlFor={`${serverName}-command`}
                          className="text-sm"
                        >
                          Command *
                        </Label>
                        <Input
                          id={`${serverName}-command`}
                          placeholder="e.g., npx @modelcontextprotocol/server-filesystem"
                          value={config.command}
                          onChange={(e) =>
                            handleUpdateServer(serverName, {
                              command: e.target.value,
                            })
                          }
                          className="bg-black text-white placeholder-white placeholder-opacity-50"
                        />
                      </div>

                      {/* Arguments */}
                      <div className="space-y-2">
                        <Label className="text-sm">Arguments</Label>
                        <ArgumentsManager
                          value={config.args || []}
                          onChange={(args) =>
                            handleUpdateArgs(serverName, args)
                          }
                        />
                      </div>

                      {/* Environment Variables */}
                      <div className="space-y-2">
                        <Label className="text-sm">Environment Variables</Label>
                        <EnvironmentManager
                          value={config.env || {}}
                          onChange={(env) => handleUpdateEnv(serverName, env)}
                        />
                      </div>

                      {/* Timeout and Disabled */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor={`${serverName}-timeout`}
                            className="text-sm"
                          >
                            Timeout (seconds)
                          </Label>
                          <Input
                            id={`${serverName}-timeout`}
                            type="number"
                            min="1"
                            placeholder="30"
                            value={config.timeout || ""}
                            onChange={(e) =>
                              handleUpdateServer(serverName, {
                                timeout: e.target.value
                                  ? parseInt(e.target.value)
                                  : undefined,
                              })
                            }
                            className="bg-black text-white placeholder-white placeholder-opacity-50"
                          />
                        </div>

                        <div className="flex items-center space-x-2 pt-6">
                          <Switch
                            id={`${serverName}-disabled`}
                            checked={config.disabled || false}
                            onCheckedChange={(disabled) =>
                              handleUpdateServer(serverName, { disabled })
                            }
                          />
                          <Label
                            htmlFor={`${serverName}-disabled`}
                            className="text-sm"
                          >
                            Disabled
                          </Label>
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))}
          </div>
        )}

        {/* Add new server */}
        <Card className="border-dashed border-gray-600">
          <CardContent className="pt-6">
            <div className="flex gap-2 items-center">
              <Input
                placeholder="Server name (e.g., 'filesystem', 'git')"
                value={newServerName}
                onChange={(e) => setNewServerName(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-black text-white placeholder-white placeholder-opacity-50"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddServer}
                disabled={
                  !newServerName.trim() || !!value[newServerName.trim()]
                }
                className="shrink-0 border-green-600 text-green-400 hover:bg-green-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {servers.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <Settings className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No MCP servers configured</p>
            <p className="text-xs mt-1">
              Add MCP servers to extend your agent's capabilities
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Arguments Manager Component
interface ArgumentsManagerProps {
  value: string[];
  onChange: (value: string[]) => void;
}

function ArgumentsManager({ value, onChange }: ArgumentsManagerProps) {
  const [newArg, setNewArg] = useState("");

  const handleAdd = () => {
    if (newArg.trim()) {
      onChange([...value, newArg.trim()]);
      setNewArg("");
    }
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleUpdate = (index: number, newValue: string) => {
    const updated = [...value];
    updated[index] = newValue;
    onChange(updated);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="space-y-2">
      {/* Existing arguments */}
      {value.map((arg, index) => (
        <div key={index} className="flex gap-2 items-center">
          <Input
            value={arg}
            onChange={(e) => handleUpdate(index, e.target.value)}
            placeholder="Argument value"
            className="flex-1 bg-black text-white placeholder-white placeholder-opacity-50"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleRemove(index)}
            className="shrink-0 border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}

      {/* Add new argument */}
      <div className="flex gap-2 items-center">
        <Input
          placeholder="Add argument (e.g., '--port', '3000')"
          value={newArg}
          onChange={(e) => setNewArg(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-black text-white placeholder-white placeholder-opacity-50"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAdd}
          disabled={!newArg.trim()}
          className="shrink-0 border-green-600 text-green-400 hover:bg-green-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {value.length === 0 && (
        <p className="text-xs text-gray-500 italic">
          No arguments configured. Arguments will be passed to the command in
          order.
        </p>
      )}
    </div>
  );
}

// Environment Variables Manager Component
interface EnvironmentManagerProps {
  value: Record<string, string>;
  onChange: (value: Record<string, string>) => void;
}

function EnvironmentManager({ value, onChange }: EnvironmentManagerProps) {
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");

  const entries = Object.entries(value);

  const handleAdd = () => {
    if (newKey.trim() && newValue.trim() && !value[newKey.trim()]) {
      onChange({
        ...value,
        [newKey.trim()]: newValue.trim(),
      });
      setNewKey("");
      setNewValue("");
    }
  };

  const handleRemove = (key: string) => {
    const newEnv = { ...value };
    delete newEnv[key];
    onChange(newEnv);
  };

  const handleUpdate = (oldKey: string, newKey: string, newValue: string) => {
    if (newKey.trim() && newValue.trim()) {
      const newEnv = { ...value };
      if (oldKey !== newKey.trim()) {
        delete newEnv[oldKey];
      }
      newEnv[newKey.trim()] = newValue.trim();
      onChange(newEnv);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="space-y-2">
      {/* Existing environment variables */}
      {entries.map(([key, val]) => (
        <div key={key} className="flex gap-2 items-center">
          <Input
            placeholder="Variable name"
            defaultValue={key}
            onBlur={(e) => handleUpdate(key, e.target.value, val)}
            className="flex-1 bg-black text-white placeholder-white placeholder-opacity-50"
          />
          <span className="text-gray-400 px-1">=</span>
          <Input
            placeholder="Variable value"
            defaultValue={val}
            onBlur={(e) => handleUpdate(key, key, e.target.value)}
            className="flex-1 bg-black text-white placeholder-white placeholder-opacity-50"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleRemove(key)}
            className="shrink-0 border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}

      {/* Add new environment variable */}
      <div className="flex gap-2 items-center">
        <Input
          placeholder="Variable name (e.g., 'API_KEY')"
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-black text-white placeholder-white placeholder-opacity-50"
        />
        <span className="text-gray-400 px-1">=</span>
        <Input
          placeholder="Variable value"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-black text-white placeholder-white placeholder-opacity-50"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAdd}
          disabled={
            !newKey.trim() || !newValue.trim() || !!value[newKey.trim()]
          }
          className="shrink-0 border-green-600 text-green-400 hover:bg-green-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {entries.length === 0 && (
        <p className="text-xs text-gray-500 italic">
          No environment variables configured. These will be available to the
          MCP server process.
        </p>
      )}
    </div>
  );
}
