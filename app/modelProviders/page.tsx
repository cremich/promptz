import SearchBox from "@/components/search/search-box";
import SortSelector from "@/components/search/sort-selector";
import SearchResults from "@/components/search/search-result";
import CreateButton from "@/components/common/create-button";
import FilterSidebar from "@/components/search/filter-sidebar";
import { searchModelProviders } from "@/lib/actions/search-modelProviders-action";

interface BrowsePageProps {
  searchParams?: Promise<{
    query?: string;
    sort?: string;
  }>;
}

export default async function ModelProvidersPage(props: BrowsePageProps) {
  const searchParams = await props.searchParams;

  const { modelProviders } = await searchModelProviders({
    query: searchParams?.query,
    sort: searchParams?.sort,
  });

  return (
    <main className="py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">
              Model Providers
            </h1>
            <CreateButton
              href="/modelProviders/create"
              name="Create Model Provider"
            />
          </div>
          <p className="text-muted-foreground">
            Discover and explore Model Providers created by the community to
            enforce coding standards and best practices
          </p>
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-6">
            {/* Search and filter bar */}
            <div className="flex flex-col sm:flex-row gap-4">
              <SearchBox placeholder="Search model providers..." />
              <SortSelector />
            </div>
            <SearchResults initialModelProviders={modelProviders} />
          </div>
        </div>
      </div>
    </main>
  );
}
