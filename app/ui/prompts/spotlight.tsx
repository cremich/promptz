import { fetchFeaturedPrompts } from "@/app/lib/prompts";
import { Badge } from "@/components/ui/badge";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { CircleUserRound } from "lucide-react";

export default async function PromptSpotlight() {
  const featuredPrompts = await fetchFeaturedPrompts();
  return (
    <section className="py-12 md:py-24 lg:py-32">
      <div className="px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Featured Prompts
            </h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Discover selected prompts created by the community to enhance your
              Amazon Q development workflow.
            </p>
          </div>
        </div>
        <div className="grid gap-6 mt-12 md:grid-cols-2 lg:grid-cols-3">
          {featuredPrompts.map((prompt) => (
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
          ))}
        </div>
      </div>
    </section>
  );
}
