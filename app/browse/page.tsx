import { searchPrompts } from "@/app/lib/actions/prompts";
import { FilterSidebar } from "@/app/ui/browse/filter-sidebar";
import SearchBox from "@/app/ui/browse/search";
import PromptCard from "@/app/ui/prompts/prompt-card";

import { Suspense } from "react";

interface BrowsePageProps {
  searchParams: {
    query?: string;
    "interface[]": string[];
    "category[]": string[];
    "sdlc[]": string[];
  };
}

export default async function Browse({ searchParams }: BrowsePageProps) {
  const { prompts, nextToken } = await searchPrompts({
    query: searchParams.query,
    interface: searchParams["interface[]"],
    category: searchParams["category[]"],
    sdlc: searchParams["sdlc[]"],
  });

  return (
    <main className="py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Browse Prompts</h1>
          <p className="text-muted-foreground">
            Discover and explore prompts created by the community to enhance
            your Amazon Q Developer workflow
          </p>
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters sidebar - hidden on mobile */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <FilterSidebar
              selectedInterface={
                Array.isArray(searchParams["interface[]"])
                  ? searchParams["interface[]"]
                  : [searchParams["interface[]"]]
              }
            />
          </div>

          <div className="flex-1 space-y-6">
            {/* Search and filter bar */}
            <div className="flex flex-col sm:flex-row gap-4">
              <SearchBox placeholder="Search prompts..." />
              {/*
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <select className="bg-background border border-input rounded-md px-3 py-1 text-sm">
                  <option>Most Popular</option>
                  <option>Newest</option>
                  <option>Oldest</option>
                </select>
              </div> */}
            </div>

            <Suspense fallback={<div>Loading...</div>}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {prompts.map((prompt) => (
                  <PromptCard prompt={prompt} />
                ))}
              </div>
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
