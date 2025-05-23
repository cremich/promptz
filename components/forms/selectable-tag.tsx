"use client";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface TagProps {
  tags: string[];
  onTagSelect: (tag: string) => void;
  selectedTags?: string[];
}

export default function SelectableTags(props: TagProps) {
  const [selectedTags, setSelectedTags] = useState(props.selectedTags || []);
  return (
    <div className="flex flex-wrap gap-2">
      {props.tags.map((tag) => (
        <Badge
          key={tag}
          variant="secondary"
          className={`cursor-pointer ${
            selectedTags.includes(tag)
              ? "bg-violet-500 hover:bg-violet-500"
              : "bg-neutral-500 hover:bg-neutral-500"
          }`}
          onClick={() => {
            props.onTagSelect(tag);
            if (selectedTags.includes(tag)) {
              setSelectedTags(selectedTags.filter((t) => t !== tag));
            } else {
              setSelectedTags([...selectedTags, tag]);
            }
          }}
        >
          {tag}
        </Badge>
      ))}
    </div>
  );
}
