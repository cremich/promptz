import { fetchFeaturedPrompts } from "@/app/lib/actions/prompts";
import PromptCard from "@/app/ui/prompts/prompt-card";

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
            <PromptCard prompt={prompt} key={prompt.id} />
          ))}
        </div>
      </div>
    </section>
  );
}
