import { Prompt } from "@/app/lib/definitions";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardFooter } from "@/components/ui/card";
import { CircleUserRound } from "lucide-react";

interface PromptCardProps {
  prompt: Prompt;
}

export default function PromptCard({ prompt }: PromptCardProps) {
  return (
    <Card key={prompt.id} className="flex flex-col">
      <CardHeader className="flex-1">
        <div className="space-y-4">
          <div className="space-x-2">
            {prompt.tags?.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-primary/10 text-primary hover:bg-primary/20"
              >
                {tag}
              </Badge>
            ))}
          </div>
          <h3 className="font-semibold text-xl">{prompt.title}</h3>
          <p className="text-muted-foreground">{prompt.description}</p>
        </div>
      </CardHeader>
      <CardFooter>
        <div className="flex items-center space-x-4">
          <CircleUserRound />
          <div className="text-sm">
            <p className="font-medium">{prompt.author}</p>
            <p className="text-muted-foreground">Author</p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
