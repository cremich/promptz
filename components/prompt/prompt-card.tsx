import { Prompt } from "@/lib/models/prompt-model";
import Author from "@/components/common/author";
import Tags from "@/components/common/tags";
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

export default function PromptCard({ prompt }: PromptCardProps) {
  return (
    <Link
      href={`/prompts/prompt/${prompt.slug}`}
      aria-label={`Show ${prompt.title}`}
    >
      <Card
        key={prompt.id}
        className="h-full bg-gradient-to-br from-neutral-800 to-neutral-900 border-neutral-700 hover:border-violet-500/50 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-violet-500/20"
        data-testid="prompt-card"
      >
        <CardHeader className="pb-3">
          <div className="space-y-4">
            {prompt.tags && <Tags tags={prompt.tags} />}
            <CardTitle className="text-lg font-semibold text-white group-hover:text-violet-300 transition-colors">
              <Link
                href={`/prompts/prompt/${prompt.slug}`}
                className="hover:text-violet-500"
              >
                {prompt.title}
              </Link>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-muted-foreground">{prompt.description}</p>
        </CardContent>
        <CardFooter>
          {prompt.author && <Author name={prompt.author} />}
        </CardFooter>
      </Card>
    </Link>
  );
}
