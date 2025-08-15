"use client";

import { useState, useRef } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import {
  AMAZON_Q_CLI_TOOLS,
  TOOL_CATEGORIES,
} from "@/lib/constants/amazon-q-tools";

interface ToolsMultiSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function ToolsMultiSelect({
  value = [],
  onChange,
  placeholder = "Select tools...",
  className,
}: ToolsMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSelect = (tool: string) => {
    if (value.includes(tool)) {
      onChange(value.filter((t) => t !== tool));
    } else {
      onChange([...value, tool]);
    }
  };

  const handleRemove = (tool: string) => {
    onChange(value.filter((t) => t !== tool));
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Backspace" && inputValue === "" && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  // Filter tools based on input
  const filteredTools = AMAZON_Q_CLI_TOOLS.filter((tool) =>
    tool.toLowerCase().includes(inputValue.toLowerCase()),
  );

  // Group filtered tools by category
  const groupedTools = Object.entries(TOOL_CATEGORIES).reduce(
    (acc, [category, tools]) => {
      const categoryTools = tools.filter((tool) =>
        filteredTools.includes(tool),
      );
      if (categoryTools.length > 0) {
        acc[category] = categoryTools;
      }
      return acc;
    },
    {} as Record<string, string[]>,
  );

  return (
    <div className={cn("w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between min-h-[2.5rem] h-auto bg-black border-gray-700 hover:bg-gray-900"
          >
            <div className="flex flex-wrap gap-1 flex-1">
              {value.length === 0 ? (
                <span className="text-gray-400">{placeholder}</span>
              ) : (
                value.map((tool) => (
                  <Badge
                    key={tool}
                    variant="secondary"
                    className="bg-gray-800 text-white hover:bg-gray-700"
                  >
                    {tool}
                    <button
                      className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleRemove(tool);
                        }
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onClick={() => handleRemove(tool)}
                    >
                      <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                    </button>
                  </Badge>
                ))
              )}
            </div>
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-full p-0 bg-black border-gray-700"
          align="start"
        >
          <Command className="bg-black">
            <CommandInput
              ref={inputRef}
              placeholder="Search tools..."
              value={inputValue}
              onValueChange={setInputValue}
              onKeyDown={handleKeyDown}
              className="bg-black text-white"
            />
            <CommandList className="max-h-64">
              <CommandEmpty>No tools found.</CommandEmpty>
              {Object.entries(groupedTools).map(([category, tools]) => (
                <CommandGroup
                  key={category}
                  heading={category}
                  className="text-gray-300"
                >
                  {tools.map((tool) => (
                    <CommandItem
                      key={tool}
                      value={tool}
                      onSelect={() => handleSelect(tool)}
                      className="text-white hover:bg-gray-800 cursor-pointer"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value.includes(tool) ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {tool}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
