import { Prompt } from "@/lib/models/prompt-model";
import Author from "@/components/common/author";
import Tags from "@/components/common/tags";
import { Flame, Copy, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import Link from "next/link";

interface PromptCardProps {
  prompt: Prompt;
}

function GetPopularityBadge(copyCount: number) {
  if (copyCount >= 100)
    return { label: "Hot", color: "bg-red-500 hover:bg-red-600" };
  if (copyCount >= 50)
    return { label: "Trending", color: "bg-orange-500 hover:bg-orange-600" };
  return null;
}

export default function PromptCard({ prompt }: PromptCardProps) {
  return (
    <Link
      href={`/prompts/prompt/${prompt.slug}`}
      aria-label={`Show ${prompt.name}`}
    >
      <Card
        key={prompt.id}
        className="h-full bg-gradient-to-br from-neutral-800 to-neutral-900 border-neutral-700 hover:border-violet-500/50 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-violet-500/20"
        data-testid="prompt-card"
      >
        <CardHeader className="pb-1">
          <div className="space-y-4">
            {prompt.tags && <Tags tags={prompt.tags} />}
            <CardTitle className="text-lg font-semibold text-white group-hover:text-violet-300 transition-colors">
              {prompt.name}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-muted-foreground">{prompt.description}</p>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          {prompt.author && <Author name={prompt.author} />}
        </CardFooter>
      </Card>
    </Link>
  );
}
