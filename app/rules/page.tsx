import { searchProjectRules } from "@/app/lib/actions/project-rules";
import { FilterSidebar } from "@/app/ui/rules/browse/filter-sidebar";
import SearchBox from "@/app/ui/common/search";
import SearchResults from "@/app/ui/rules/browse/search-result";
import { SortSelector } from "@/app/ui/common/sorting";
import CreateProjectRuleButton from "@/app/ui/rules/create-project-rule-button";
import { Suspense } from "react";

interface BrowsePageProps {
  searchParams?: Promise<{
    query?: string;
    sort?: string;
    my?: string;
    "tags[]": string[];
  }>;
}

export default async function RulesPage(props: BrowsePageProps) {
  const searchParams = await props.searchParams;

  const { projectRules } = await searchProjectRules({
    query: searchParams?.query,
    sort: searchParams?.sort,
    my: searchParams?.my,
    tags: searchParams ? searchParams["tags[]"] : [],
  });

  return (
    <main className="py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Project Rules</h1>
            <CreateProjectRuleButton />
          </div>
          <p className="text-muted-foreground">
            Discover and explore Amazon Q project rules created by the community
            to enforce coding standards and best practices
          </p>
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters sidebar - hidden on mobile */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <FilterSidebar />
          </div>

          <div className="flex-1 space-y-6">
            {/* Search and filter bar */}
            <div className="flex flex-col sm:flex-row gap-4">
              <SearchBox placeholder="Search project rules..." />
              <SortSelector />
            </div>
            <Suspense fallback={<div>Loading...</div>}>
              <SearchResults initialProjectRules={projectRules} />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
