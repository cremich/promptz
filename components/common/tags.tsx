import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface TagProps {
  tags: string[];
}

export default function Tags(props: TagProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {props.tags.map((tag) => (
        <Link
          key={tag}
          href={`/tag/${encodeURIComponent(tag)}`}
          aria-label={`View prompts tagged with ${tag}`}
          title={`Browse prompts tagged with ${tag}`}
          prefetch={true}
          itemProp="keywords"
        >
          <Badge
            variant="secondary"
            className="bg-violet-500 hover:bg-violet-500"
            data-testid="tag"
          >
            {tag}
          </Badge>
        </Link>
      ))}
    </div>
  );
}
