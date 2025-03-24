"use client";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@radix-ui/react-collapsible";
import { ChevronDown } from "lucide-react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

type FilterKey = "interface" | "category" | "sdlc" | "tags";

interface FilterSectionProps {
  title: string;
  filterKey: FilterKey;
  options: string[];
  collapsible?: boolean;
}

export function FilterSection({
  title,
  filterKey,
  options,
  collapsible = false,
}: FilterSectionProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const getSelectedValues = (filterKey: FilterKey): string[] => {
    return searchParams.getAll(`${filterKey}[]`);
  };

  const handleFilterChange = (filterKey: FilterKey, value: string) => {
    const params = new URLSearchParams(searchParams);
    const selectedValues = getSelectedValues(filterKey);

    params.delete(`${filterKey}[]`);

    if (selectedValues.includes(value)) {
      selectedValues
        .filter((v) => v !== value)
        .forEach((v) => params.append(`${filterKey}[]`, v));
    } else {
      [...selectedValues, value].forEach((v) =>
        params.append(`${filterKey}[]`, v),
      );
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

  const content = (
    <div className="space-y-2">
      {options.map((option) => (
        <div key={option} className="flex items-center space-x-2">
          <Checkbox
            id={`${filterKey}-${option.toLowerCase()}`}
            checked={getSelectedValues(filterKey).includes(option)}
            onCheckedChange={() => handleFilterChange(filterKey, option)}
          />
          <label
            htmlFor={`${filterKey}-${option.toLowerCase()}`}
            className="text-sm cursor-pointer"
          >
            {option}
          </label>
        </div>
      ))}
    </div>
  );

  if (collapsible) {
    return (
      <Collapsible>
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <h3 className="font-medium">{title}</h3>
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2">{content}</CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <div>
      <h3 className="font-medium mb-3">{title}</h3>
      {content}
    </div>
  );
}
