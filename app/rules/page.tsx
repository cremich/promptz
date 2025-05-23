import SearchBox from "@/components/search/search-box";
import SearchResults from "@/components/search/search-result";
import SortSelector from "@/components/search/sort-selector";
import CreateButton from "@/components/common/create-button";
import { searchProjectRules } from "@/lib/actions/rule-search-action";

interface BrowsePageProps {
  searchParams?: Promise<{
    query?: string;
    sort?: string;
    "tags[]"?: string[];
  }>;
}

export default async function BrowseRulesPage(props: BrowsePageProps) {
  const searchParams = await props.searchParams;

  const { projectRules } = await searchProjectRules({
    query: searchParams?.query,
    sort: searchParams?.sort,
    tags: searchParams ? searchParams["tags[]"] : [],
  });

  return (
    <main className="py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Project Rules</h1>
            <CreateButton href="/rules/create" name="Create Rule" />
          </div>
          <p className="text-muted-foreground">
            Discover and explore Amazon Q project rules created by the community
            to enforce coding standards and best practices
          </p>
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-6">
            {/* Search and filter bar */}
            <div className="flex flex-col sm:flex-row gap-4">
              <SearchBox placeholder="Search project rules..." />
              <SortSelector />
            </div>
            <SearchResults initialProjectRules={projectRules} />
          </div>
        </div>
      </div>
    </main>
  );
}
