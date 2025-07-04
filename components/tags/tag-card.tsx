import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tag } from "@/lib/models/tags-model";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface TagCardProps {
  tag: Tag;
}

export default function TagCard({ tag }: TagCardProps) {
  const totalCount = (tag.promptCount || 0) + (tag.ruleCount || 0);

  return (
    <Link
      href={`/browse?tags[]=${encodeURIComponent(tag.name)}`}
      className="group block transition-transform hover:scale-105 focus:scale-105 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-black rounded-lg"
      aria-label={`Browse ${tag.name} tag with ${totalCount} items`}
    >
      <Card className="h-full bg-gradient-to-br from-neutral-800 to-neutral-900 border-neutral-700 hover:border-violet-500/50 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-violet-500/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-white group-hover:text-violet-300 transition-colors">
            {tag.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {tag.description && (
            <p className="text-sm text-zinc-400 line-clamp-2 leading-relaxed">
              {tag.description}
            </p>
          )}

          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label="Content counts"
          >
            <Badge
              variant="secondary"
              className="bg-violet-600/20 text-violet-300 border-violet-500/30 hover:bg-violet-600/30 transition-colors"
              aria-label={`${tag.promptCount} prompts`}
            >
              {tag.promptCount} {tag.promptCount === 1 ? "Prompt" : "Prompts"}
            </Badge>
            <Badge
              variant="secondary"
              className="bg-emerald-600/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-600/30 transition-colors"
              aria-label={`${tag.ruleCount} project rules`}
            >
              {tag.ruleCount} {tag.ruleCount === 1 ? "Rule" : "Rules"}
            </Badge>
            {/* )} */}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
