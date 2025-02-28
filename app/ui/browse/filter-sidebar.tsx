"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import {
  PromptCategory,
  QInterface,
  SdlcActivity,
} from "@/app/lib/definitions";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

interface FilterSidebarProps {
  selectedInterface?: string[];
}

export function FilterSidebar({ selectedInterface }: FilterSidebarProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const interfaceOptions = Object.values(QInterface);
  const categoryOptions = Object.values(PromptCategory);
  const sdlcOptions = Object.values(SdlcActivity);

  function handleSelectedInterfaceChange(interfaceValue: string) {
    const params = new URLSearchParams(searchParams);

    // Remove all existing interface values
    params.delete("interface[]");
    const selectedInterfaces = searchParams.getAll("interface[]");

    if (selectedInterfaces.includes(interfaceValue)) {
      // Add back all values except the one that was unchecked
      selectedInterfaces
        .filter((value) => value !== interfaceValue)
        .forEach((value) => params.append("interface[]", value));
    } else {
      // Add back all existing values plus the new one
      [...selectedInterfaces, interfaceValue].forEach((value) =>
        params.append("interface[]", value),
      );
    }

    // Update the URL with new parameters
    replace(`${pathname}?${params.toString()}`);
  }
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-3">Interface</h3>
        <div className="space-y-2">
          {interfaceOptions.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={`type-${option.toLowerCase()}`}
                checked={selectedInterface?.includes(option)}
                onCheckedChange={() => handleSelectedInterfaceChange(option)}
              />
              <label
                htmlFor={`type-${option.toLowerCase()}`}
                className="text-sm cursor-pointer"
              >
                {option}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <Collapsible>
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <h3 className="font-medium">Categories</h3>
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 space-y-2">
          {categoryOptions.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox id={`category-${category.toLowerCase()}`} />
              <label
                htmlFor={`category-${category.toLowerCase()}`}
                className="text-sm cursor-pointer"
              >
                {category}
              </label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      <Separator />

      <Collapsible>
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <h3 className="font-medium">SDLC Activity</h3>
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 space-y-2">
          {sdlcOptions.map((sdlc) => (
            <div key={sdlc} className="flex items-center space-x-2">
              <Checkbox id={`sdlc-${sdlc.toLowerCase()}`} />
              <label
                htmlFor={`sdlc-${sdlc.toLowerCase()}`}
                className="text-sm cursor-pointer"
              >
                {sdlc}
              </label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">Popularity</h3>
          <span className="text-xs text-muted-foreground">3+ stars</span>
        </div>
        <Slider defaultValue={[3]} max={5} step={1} />
      </div> */}
    </div>
  );
}
