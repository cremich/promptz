import { Prompt } from "@/lib/models/prompt-model";
import Author from "@/components/common/author";
import Tags from "@/components/common/tags";
import { Card, CardHeader, CardFooter } from "@/components/ui/card";
import Link from "next/link";

interface PromptCardProps {
  prompt: Prompt;
}

export default function PromptCard({ prompt }: PromptCardProps) {
  return (
    <Card key={prompt.id} className="flex flex-col" data-testid="prompt-card">
      <CardHeader className="flex-1">
        <div className="space-y-4">
          {prompt.tags && <Tags tags={prompt.tags} />}

          <h3 className="font-semibold text-xl">
            <Link
              href={`/prompts/prompt/${prompt.slug}`}
              className="hover:text-violet-500"
            >
              {prompt.title}
            </Link>
          </h3>
          <p className="text-muted-foreground">{prompt.description}</p>
        </div>
      </CardHeader>
      <CardFooter>
        {prompt.author && <Author name={prompt.author} />}
      </CardFooter>
    </Card>
  );
}
