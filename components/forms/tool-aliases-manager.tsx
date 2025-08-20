"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ToolAliasesManagerProps {
  value: Record<string, string>;
  onChange: (value: Record<string, string>) => void;
  className?: string;
}

export function ToolAliasesManager({
  value = {},
  onChange,
  className,
}: ToolAliasesManagerProps) {
  const [newAlias, setNewAlias] = useState("");
  const [newTool, setNewTool] = useState("");

  const aliases = Object.entries(value);

  const handleAdd = () => {
    if (newAlias.trim() && newTool.trim() && !value[newAlias.trim()]) {
      onChange({
        ...value,
        [newAlias.trim()]: newTool.trim(),
      });
      setNewAlias("");
      setNewTool("");
    }
  };

  const handleRemove = (alias: string) => {
    const newValue = { ...value };
    delete newValue[alias];
    onChange(newValue);
  };

  const handleUpdate = (
    oldAlias: string,
    newAlias: string,
    newTool: string,
  ) => {
    if (newAlias.trim() && newTool.trim()) {
      const newValue = { ...value };
      if (oldAlias !== newAlias.trim()) {
        delete newValue[oldAlias];
      }
      newValue[newAlias.trim()] = newTool.trim();
      onChange(newValue);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className={className}>
      <div className="space-y-4">
        {/* Existing aliases */}
        {aliases.length > 0 && (
          <div className="space-y-2">
            {aliases.map(([alias, tool]) => (
              <div key={alias} className="flex gap-2 items-center">
                <Input
                  placeholder="Alias name"
                  defaultValue={alias}
                  onBlur={(e) => handleUpdate(alias, e.target.value, tool)}
                  className="flex-1 bg-black text-white placeholder-white placeholder-opacity-50"
                />
                <span className="text-gray-400 px-2">→</span>
                <Input
                  placeholder="Tool name"
                  defaultValue={tool}
                  onBlur={(e) => handleUpdate(alias, alias, e.target.value)}
                  className="flex-1 bg-black text-white placeholder-white placeholder-opacity-50"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemove(alias)}
                  className="shrink-0 border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Add new alias */}
        <div className="flex gap-2 items-center">
          <Input
            placeholder="Alias name (e.g., 'read')"
            value={newAlias}
            onChange={(e) => setNewAlias(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-black text-white placeholder-white placeholder-opacity-50"
          />
          <span className="text-gray-400 px-2">→</span>
          <Input
            placeholder="Tool name (e.g., 'fs_read')"
            value={newTool}
            onChange={(e) => setNewTool(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-black text-white placeholder-white placeholder-opacity-50"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAdd}
            disabled={
              !newAlias.trim() || !newTool.trim() || !!value[newAlias.trim()]
            }
            className="shrink-0 border-green-600 text-green-400 hover:bg-green-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {aliases.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <p className="text-sm">No tool aliases configured</p>
            <p className="text-xs mt-1">
              Add aliases to create shortcuts for commonly used tools
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
