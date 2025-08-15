import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getAllTags } from "@/lib/actions/fetch-tags-action";

export default async function FooterTags() {
  let tags: string[] = [];

  try {
    tags = await getAllTags();
  } catch (error) {
    console.error("Error fetching tags for footer:", error);
    // Return empty component if tags can't be loaded
    return null;
  }

  if (tags.length === 0) {
    return null;
  }

  return (
    <div className="border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-gray-200 mb-2">
            Explore by Tags
          </h3>
          <p className="text-sm text-gray-400">
            Discover prompts, project rules, and tags organized by technology,
            framework, and use case
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 max-w-5xl mx-auto">
          {tags.map((tag) => (
            <Button
              key={tag}
              variant="outline"
              size="sm"
              asChild
              className="h-8 px-3 text-xs border-gray-700 bg-gray-800/50 text-gray-300 hover:bg-violet-500/20 hover:border-violet-500/50 hover:text-violet-300 transition-all duration-200"
            >
              <Link
                href={`/tag/${encodeURIComponent(tag)}`}
                prefetch={true}
                aria-label={`Browse content tagged with ${tag}`}
                title={`View all prompts and rules tagged with ${tag}`}
              >
                {tag}
              </Link>
            </Button>
          ))}
        </div>

        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            {tags.length} tags available • Click any tag to explore related
            content
          </p>
        </div>
      </div>
    </div>
  );
}
