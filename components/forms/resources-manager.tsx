"use client";

import { useState } from "react";
import { Plus, Trash2, File, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ResourcesManagerProps {
  value: string[];
  onChange: (resources: string[]) => void;
}

export function ResourcesManager({ value, onChange }: ResourcesManagerProps) {
  const [newResource, setNewResource] = useState("");

  const addResource = () => {
    if (newResource.trim() && !value.includes(newResource.trim())) {
      const updatedResources = [...value, newResource.trim()];
      onChange(updatedResources);
      setNewResource("");
    }
  };

  const removeResource = (index: number) => {
    const updatedResources = value.filter((_, i) => i !== index);
    onChange(updatedResources);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addResource();
    }
  };

  const getResourceIcon = (resource: string) => {
    if (
      resource.includes("/") ||
      resource.startsWith("./") ||
      resource.startsWith("~/")
    ) {
      return <FolderOpen className="w-4 h-4 text-blue-400" />;
    }
    return <File className="w-4 h-4 text-green-400" />;
  };

  const getResourceType = (resource: string) => {
    if (resource.startsWith("/")) return "Absolute path";
    if (resource.startsWith("./")) return "Relative path";
    if (resource.startsWith("~/")) return "Home directory";
    if (resource.includes("/")) return "Directory path";
    return "File name";
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            placeholder="Enter file path (e.g., ./src/components, ~/documents/config.json)"
            value={newResource}
            onChange={(e) => setNewResource(e.target.value)}
            onKeyDown={handleKeyPress}
            className="text-white placeholder-white placeholder-opacity-50"
          />
        </div>
        <Button
          type="button"
          onClick={addResource}
          disabled={!newResource.trim() || value.includes(newResource.trim())}
          className="shrink-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Resource
        </Button>
      </div>

      {value.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Configured Resources ({value.length})
          </Label>
          <div className="space-y-2">
            {value.map((resource, index) => (
              <Card key={index} className="border-gray-700">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {getResourceIcon(resource)}
                      <div className="flex-1 min-w-0">
                        <div className="font-mono text-sm text-white truncate">
                          {resource}
                        </div>
                        <div className="text-xs text-gray-400">
                          {getResourceType(resource)}
                        </div>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeResource(index)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20 shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {value.length === 0 && (
        <Card className="border-dashed border-gray-600">
          <CardContent className="p-6 text-center">
            <File className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-400">
              No resources configured yet. Add file paths that your agent should
              have access to.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="text-xs text-gray-400 space-y-1">
        <p>
          <strong>Supported formats:</strong>
        </p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>
            <code>/absolute/path/to/file</code> - Absolute file paths
          </li>
          <li>
            <code>./relative/path</code> - Relative to agent directory
          </li>
          <li>
            <code>~/home/directory</code> - Home directory paths
          </li>
          <li>
            <code>filename.ext</code> - Files in current directory
          </li>
        </ul>
      </div>
    </div>
  );
}
