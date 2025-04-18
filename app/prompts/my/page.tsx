import { searchPrompts } from "@/app/lib/actions/prompts";
import SearchBox from "@/app/ui/common/search";
import SearchResults from "@/app/ui/prompts/browse/search-result";
import CreatePromptButton from "@/app/ui/prompts/create-prompt-button";
import { Suspense } from "react";

interface BrowsePageProps {
  searchParams?: Promise<{
    query?: string;
    my?: string;
  }>;
}

export default async function MyPrompts(props: BrowsePageProps) {
  const searchParams = await props.searchParams;

  const { prompts } = await searchPrompts({
    query: searchParams?.query,
    my: "true",
  });

  return (
    <main className="py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">My Prompts</h1>
            <CreatePromptButton />
          </div>
          <p className="text-muted-foreground">
            Manage and refine your prompts.
          </p>
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-6">
            {/* Search and filter bar */}
            <div className="flex flex-col sm:flex-row gap-4">
              <SearchBox placeholder="Search prompts..." />
            </div>
            <Suspense fallback={<div>Loading...</div>}>
              <SearchResults initialPrompts={prompts} />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
