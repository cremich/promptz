import { Badge } from "@/components/ui/badge";

interface TagProps {
  tags: string[];
}

export default function Tags(props: TagProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {props.tags.map((tag) => (
        <Badge
          key={tag}
          variant="secondary"
          className="bg-violet-500 hover:bg-violet-500"
          data-testid="tag"
        >
          {tag}
        </Badge>
      ))}
    </div>
  );
}
