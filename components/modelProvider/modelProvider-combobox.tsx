"use client";

import { searchModelProviders } from "@/lib/actions/search-modelProviders-action";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { ModelProvider } from "@/lib/models/modelProvider-model";

interface ModelProviderComboboxProps {
  value?: string | null;
  onChange?: (value: string) => void;
  className?: string;
}

export default function ModelProviderCombobox({
  value,
  onChange,
  className,
}: ModelProviderComboboxProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [providers, setProviders] = useState<ModelProvider[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string>(value || "");

  // Fetch model providers when search value changes
  useEffect(() => {
    setIsLoading(true);

    const fetchModelProviders = async () => {
      try {
        const result = await searchModelProviders({ query: searchValue });
        setProviders(result.modelProviders || []);
      } catch (error) {
        console.error("Error searching model providers:", error);
        setProviders([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce the search to avoid too many requests
    const debounceTimer = setTimeout(() => {
      fetchModelProviders();
    }, 300);

    // Clean up the timer on component unmount or when searchValue changes
    return () => clearTimeout(debounceTimer);
  }, [searchValue]);

  // Initial load of providers
  useEffect(() => {
    const loadInitialProviders = async () => {
      setIsLoading(true);
      try {
        const result = await searchModelProviders({ query: "" });
        setProviders(result.modelProviders || []);
      } catch (error) {
        console.error("Error loading initial providers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialProviders();
  }, []);

  const handleSelect = (currentValue: string) => {
    // Find the provider by ID to get its full object
    const provider = providers.find((p) => p.id === currentValue);

    // Toggle selection if clicking the same item
    const newValue = currentValue === selectedProvider ? "" : currentValue;

    // Update internal state with ID
    setSelectedProvider(newValue);

    // Pass the ID to parent component
    console.log(`selected new value: ${newValue} (${selectedProvider})`);
    onChange?.(newValue);

    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between text-white placeholder-white/50 placeholder-opacity-50 hover:bg-black",
            className,
          )}
        >
          {selectedProvider
            ? providers.find((provider) => provider.id === selectedProvider)
                ?.name ||
              providers.find((provider) => provider.name === selectedProvider)
                ?.name ||
              selectedProvider
            : "Select provider..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder="Search providers..."
            className="h-9"
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandEmpty>
            {isLoading ? "Loading..." : "No provider found."}
          </CommandEmpty>
          <CommandGroup>
            {providers.map((provider) => (
              <CommandItem
                key={provider.id}
                value={provider.id}
                onSelect={handleSelect}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedProvider === provider.id
                      ? "opacity-100"
                      : "opacity-0",
                  )}
                />
                {provider.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
