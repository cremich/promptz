import { Suspense } from "react";
import { getTag } from "@/lib/actions/fetch-tags-action";
import TagCard from "./tag-card";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

interface TagSectionProps {
  title: string;
  description: string;
  tagNames: string[];
}

// Loading skeleton for tag cards
function TagCardSkeleton() {
  return (
    <Card className="h-full bg-gradient-to-br from-neutral-800 to-neutral-900 border-neutral-700">
      <CardContent className="p-6 space-y-3">
        <Skeleton className="h-6 w-3/4 bg-neutral-700" />
        <Skeleton className="h-4 w-full bg-neutral-700" />
        <Skeleton className="h-4 w-2/3 bg-neutral-700" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 bg-neutral-700 rounded-full" />
          <Skeleton className="h-6 w-16 bg-neutral-700 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}

// Error fallback component
function TagCardError({ tagName }: { tagName: string }) {
  return (
    <Card className="h-full bg-gradient-to-br from-red-900/20 to-neutral-900 border-red-500/30">
      <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2">
        <AlertCircle className="h-8 w-8 text-red-400" />
        <p className="text-sm text-red-300">Failed to load {tagName}</p>
        <p className="text-xs text-red-400/70">Please try again later</p>
      </CardContent>
    </Card>
  );
}

// Individual tag card with data fetching
async function TagCardWithData({ tagName }: { tagName: string }) {
  try {
    const tag = await getTag(tagName);

    if (!tag) {
      return <TagCardError tagName={tagName} />;
    }

    return <TagCard tag={tag} />;
  } catch (error) {
    console.error(`Error loading tag ${tagName}:`, error);
    return <TagCardError tagName={tagName} />;
  }
}

export default function TagSection({
  title,
  description,
  tagNames,
}: TagSectionProps) {
  return (
    <section
      className="w-full"
      aria-labelledby={`${title.toLowerCase().replace(/\s+/g, "-")}-heading`}
    >
      <div className="px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
          <div className="space-y-2">
            <h2
              id={`${title.toLowerCase().replace(/\s+/g, "-")}-heading`}
              className="text-3xl font-bold tracking-tighter sm:text-4xl lg:text-5xl bg-gradient-to-r from-white to-violet-300 bg-clip-text text-transparent"
            >
              {title}
            </h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              {description}
            </p>
          </div>
        </div>

        <div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          role="grid"
          aria-label={`${title} tags`}
        >
          {tagNames.map((tagName) => (
            <div key={tagName} role="gridcell">
              <Suspense fallback={<TagCardSkeleton />}>
                <TagCardWithData tagName={tagName} />
              </Suspense>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
