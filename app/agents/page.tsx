import SearchBox from "@/components/search/search-box";
import SortSelector from "@/components/search/sort-selector";
import SearchResults from "@/components/search/search-result";
import CreateButton from "@/components/common/create-button";
import FilterSidebar from "@/components/search/filter-sidebar";

interface BrowsePageProps {
  searchParams?: Promise<{
    query?: string;
    sort?: string;
    "tags[]"?: string[];
  }>;
}

export default async function AgentsPage(props: BrowsePageProps) {
  const searchParams = await props.searchParams;

  // TODO: Implement searchAgents action
  // const { agents } = await searchAgents({
  //   query: searchParams?.query,
  //   sort: searchParams?.sort,
  //   tags: searchParams ? searchParams["tags[]"] : [],
  // });

  const agents: any[] = []; // Placeholder until search action is implemented

  return (
    <main className="py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Browse Agents</h1>
            <CreateButton href="/agents/create" name="Create Agent" />
          </div>
          <p className="text-muted-foreground">
            Discover and explore Amazon Q Developer CLI custom agents created by
            the community to enhance your development workflow
          </p>
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters sidebar - hidden on mobile */}
          <div className="hidden lg:block w-64 shrink-0">
            <FilterSidebar type="agents" />
          </div>

          <div className="flex-1 space-y-6">
            {/* Search and filter bar */}
            <div className="flex flex-col sm:flex-row gap-4">
              <SearchBox placeholder="Search agents..." />

              <SortSelector />
            </div>
            <SearchResults initialAgents={agents} />
          </div>
        </div>
      </div>
    </main>
  );
}
