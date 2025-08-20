"use client";

import { useState } from "react";
import { Plus, Trash2, Zap, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { HookCommand } from "@/lib/models/agent-model";

interface HooksManagerProps {
  value: Record<string, HookCommand>;
  onChange: (hooks: Record<string, HookCommand>) => void;
}

const HOOK_TYPES = [
  {
    value: "agentSpawn",
    label: "Agent Spawn",
    description: "Executed when the agent is first initialized",
  },
  {
    value: "userPromptSubmit",
    label: "User Prompt Submit",
    description: "Executed before processing each user prompt",
  },
] as const;

export function HooksManager({ value, onChange }: HooksManagerProps) {
  const [selectedHookType, setSelectedHookType] = useState<string>("");
  const [newCommand, setNewCommand] = useState("");
  const [expandedHooks, setExpandedHooks] = useState<Set<string>>(new Set());

  const addHook = () => {
    if (selectedHookType && newCommand.trim() && !value[selectedHookType]) {
      const updatedHooks = {
        ...value,
        [selectedHookType]: { command: newCommand.trim() },
      };
      onChange(updatedHooks);
      setSelectedHookType("");
      setNewCommand("");
    }
  };

  const removeHook = (hookType: string) => {
    const updatedHooks = { ...value };
    delete updatedHooks[hookType];
    onChange(updatedHooks);
    setExpandedHooks((prev) => {
      const newSet = new Set(prev);
      newSet.delete(hookType);
      return newSet;
    });
  };

  const updateHookCommand = (hookType: string, command: string) => {
    const updatedHooks = {
      ...value,
      [hookType]: { command },
    };
    onChange(updatedHooks);
  };

  const toggleExpanded = (hookType: string) => {
    setExpandedHooks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(hookType)) {
        newSet.delete(hookType);
      } else {
        newSet.add(hookType);
      }
      return newSet;
    });
  };

  const getHookTypeInfo = (hookType: string) => {
    return HOOK_TYPES.find((h) => h.value === hookType);
  };

  const availableHookTypes = HOOK_TYPES.filter(
    (hookType) => !value[hookType.value],
  );

  return (
    <div className="space-y-4">
      {/* Add new hook */}
      {availableHookTypes.length > 0 && (
        <Card className="border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Add Lifecycle Hook</CardTitle>
            <CardDescription className="text-xs">
              Configure commands to run at specific points in the agent
              lifecycle
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Hook Type</Label>
                <Select
                  value={selectedHookType}
                  onValueChange={setSelectedHookType}
                >
                  <SelectTrigger className="bg-black">
                    <SelectValue placeholder="Select hook type" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableHookTypes.map((hookType) => (
                      <SelectItem key={hookType.value} value={hookType.value}>
                        <div>
                          <div className="font-medium">{hookType.label}</div>
                          <div className="text-xs text-gray-400">
                            {hookType.description}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <Label className="text-xs">Command</Label>
                  <Input
                    placeholder="Enter command to execute"
                    value={newCommand}
                    onChange={(e) => setNewCommand(e.target.value)}
                    className="text-white placeholder-white placeholder-opacity-50"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addHook}
                  disabled={
                    !selectedHookType ||
                    !newCommand.trim() ||
                    !!value[selectedHookType]
                  }
                  size="sm"
                  className="shrink-0 border-green-600 text-green-400 hover:bg-green-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Configured hooks */}
      {Object.keys(value).length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Configured Hooks ({Object.keys(value).length})
          </Label>
          <div className="space-y-2">
            {Object.entries(value).map(([hookType, hookConfig]) => {
              const hookInfo = getHookTypeInfo(hookType);
              const isExpanded = expandedHooks.has(hookType);

              return (
                <Card key={hookType} className="border-gray-700">
                  <Collapsible
                    open={isExpanded}
                    onOpenChange={() => toggleExpanded(hookType)}
                  >
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer hover:bg-gray-800/50 transition-colors pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Zap className="w-4 h-4 text-yellow-400" />
                            <div>
                              <CardTitle className="text-sm">
                                {hookInfo?.label || hookType}
                              </CardTitle>
                              <CardDescription className="text-xs">
                                {hookInfo?.description ||
                                  "Custom lifecycle hook"}
                              </CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeHook(hookType);
                              }}
                              className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </div>
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          <div>
                            <Label className="text-xs">Command</Label>
                            <Textarea
                              value={hookConfig.command}
                              onChange={(e) =>
                                updateHookCommand(hookType, e.target.value)
                              }
                              placeholder="Enter command to execute"
                              className="text-white placeholder-white placeholder-opacity-50 font-mono text-sm"
                              rows={3}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {Object.keys(value).length === 0 && (
        <Card className="border-dashed border-gray-600">
          <CardContent className="p-6 text-center">
            <Zap className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-400">
              No lifecycle hooks configured yet. Add hooks to run commands at
              specific points in the agent lifecycle.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="text-xs text-gray-400 space-y-1">
        <p>
          <strong>Available Hook Types:</strong>
        </p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>
            <strong>agentSpawn:</strong> Runs when the agent is first
            initialized
          </li>
          <li>
            <strong>userPromptSubmit:</strong> Runs before processing each user
            prompt
          </li>
        </ul>
      </div>
    </div>
  );
}
