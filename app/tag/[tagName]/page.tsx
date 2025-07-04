import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Tag as TagIcon, Terminal, Scale } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  getTag,
  getPromptsAndRulesByTag,
} from "@/lib/actions/fetch-tags-action";
import PromptCard from "@/components/prompt/prompt-card";
import ProjectRuleCard from "@/components/rules/project-rule-card";
import CreateButton from "@/components/common/create-button";

export async function generateMetadata(props: {
  params: Promise<{ tagName: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const tagName = decodeURIComponent(params.tagName);

  try {
    const tag = await getTag(tagName);

    if (!tag) {
      return {
        title: "Tag Not Found - Promptz",
        description: "The requested tag could not be found.",
      };
    }

    const title = `${tag.name} Prompts for Amazon Q Developer - Promptz`;
    const description = tag.description
      ? `Discover ${tag.name} prompts for Amazon Q Developer. ${tag.description}`
      : `Browse prompts tagged with ${tag.name} to enhance your Amazon Q Developer workflow.`;

    return {
      title,
      description,
      keywords: [
        tag.name,
        "Amazon Q Developer",
        "prompts",
        "AI assistant",
        "development",
      ],
      openGraph: {
        title,
        description,
        type: "website",
        url: `https://promptz.dev/prompts/tag/${encodeURIComponent(tag.name)}`,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
      },
      alternates: {
        canonical: `https://promptz.dev/prompts/tag/${encodeURIComponent(tag.name)}`,
      },
    };
  } catch (error) {
    console.error("Error generating metadata for tag page:", error);
    return {
      title: "Tag - Promptz",
      description: "Browse prompts by tag on Promptz.",
    };
  }
}

export default async function PromptsTagPage(props: {
  params: Promise<{ tagName: string }>;
}) {
  const params = await props.params;
  const tagName = decodeURIComponent(params.tagName);

  // Fetch tag information and associated content
  const contentData = await getPromptsAndRulesByTag(tagName); // 20 prompts, 5 rules for preview
  if (!contentData.tag) {
    notFound();
  }

  return (
    <main className="py-8">
      <div className="flex flex-col space-y-6">
        {/* Tag Header */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
              <TagIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {contentData.tag.name}
              </h1>
              {contentData.tag.category && (
                <Badge variant="secondary" className="mt-1">
                  {contentData.tag.category}
                </Badge>
              )}
            </div>
          </div>

          {contentData.tag.description && (
            <p className="text-lg text-muted-foreground max-w-3xl">
              {contentData.tag.description}
            </p>
          )}

          {/* Stats */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4" />
              <span>{contentData.prompts.length} prompts</span>
            </div>
            <div className="flex items-center gap-2">
              <Scale className="h-4 w-4" />
              <span>{contentData.rules?.length} project rules</span>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="grid gap-8">
          {/* Prompts Section */}
          {contentData.prompts.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Related Prompts</h2>
              </div>

              <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
                {contentData.prompts.map((p) => (
                  <PromptCard prompt={p} key={p.id} />
                ))}
              </div>
            </section>
          )}

          {/* Related Project Rules Section */}
          {contentData.rules.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">
                  Related Project Rules
                </h2>
              </div>

              <div className="grid gap-4 md:grid-cols-1">
                {contentData.rules.map((r) => (
                  <ProjectRuleCard projectRule={r} key={r.id} />
                ))}
              </div>
            </section>
          )}

          {/* Empty State */}
          {contentData.prompts.length === 0 &&
            contentData.rules.length === 0 && (
              <div className=" py-12">
                <h3 className="text-lg font-semibold mb-2">No content found</h3>
                <p className="text-muted-foreground mb-4">
                  There are no prompts or project rules tagged with
                  {contentData.tag.name} yet.
                </p>
                <div className="flex gap-4 ">
                  <CreateButton href="/prompts/create" name="Create Prompt" />
                  <CreateButton
                    href="/rules/create"
                    name="Create Project Rule"
                  />
                </div>
              </div>
            )}
        </div>
      </div>
    </main>
  );
}
