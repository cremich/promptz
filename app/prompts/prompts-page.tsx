import SearchBox from "@/components/search/search-box";
import SortSelector from "@/components/search/sort-selector";
import SearchResults from "@/components/search/search-result";
import CreateButton from "@/components/common/create-button";
import FilterSidebar from "@/components/search/filter-sidebar";
import { searchPrompts } from "@/lib/actions/search-prompts-action";

interface BrowsePageProps {
  searchParams?: Promise<{
    query?: string;
    sort?: string;
    "tags[]"?: string[];
  }>;
}

export default async function PromptsPage(props: BrowsePageProps) {
  const searchParams = await props.searchParams;

  const { prompts } = await searchPrompts({
    query: searchParams?.query,
    sort: searchParams?.sort,
    tags: searchParams ? searchParams["tags[]"] : [],
  });

  return (
    <main className="py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">
              Browse Prompts
            </h1>
            <CreateButton href="" name="" />
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
            <SearchResults initialPrompts={prompts} />
          </div>
        </div>
      </div>
    </main>
  );
}
