import { searchPrompts } from "@/app/lib/actions/prompts";
import { FilterSidebar } from "@/app/ui/prompts/browse/filter-sidebar";
import SearchBox from "@/app/ui/common/search";
import SearchResults from "@/app/ui/prompts/browse/search-result";
import { SortSelector } from "@/app/ui/common/sorting";
import CreatePromptButton from "@/app/ui/prompts/create-prompt-button";
import { Suspense } from "react";

interface BrowsePageProps {
  searchParams?: Promise<{
    query?: string;
    sort?: string;
    "interface[]": string[];
    "category[]": string[];
    "sdlc[]": string[];
  }>;
}

export default async function PromptsPage(props: BrowsePageProps) {
  const searchParams = await props.searchParams;

  const { prompts } = await searchPrompts({
    query: searchParams?.query,
    sort: searchParams?.sort,
    interface: searchParams ? searchParams["interface[]"] : [],
    category: searchParams ? searchParams["category[]"] : [],
    sdlc: searchParams ? searchParams["sdlc[]"] : [],
  });

  return (
    <main className="py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">
              Browse Prompts
            </h1>
            <CreatePromptButton />
          </div>
          <p className="text-muted-foreground">
            Discover and explore prompts created by the community to enhance
            your Amazon Q Developer workflow
          </p>
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters sidebar - hidden on mobile */}
          <div className="hidden lg:block w-64 shrink-0">
            <FilterSidebar />
          </div>

          <div className="flex-1 space-y-6">
            {/* Search and filter bar */}
            <div className="flex flex-col sm:flex-row gap-4">
              <SearchBox placeholder="Search prompts..." />

              <SortSelector />
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
