import { searchProjectRules } from "@/app/lib/actions/project-rules";
import SearchBox from "@/app/ui/common/search";
import SearchResults from "@/app/ui/rules/browse/search-result";
import CreateProjectRuleButton from "@/app/ui/rules/create-project-rule-button";
import { Suspense } from "react";

interface BrowsePageProps {
  searchParams?: Promise<{
    query?: string;
    my?: string;
  }>;
}

export default async function MyRules(props: BrowsePageProps) {
  const searchParams = await props.searchParams;

  // Fetch project rules owned by the current user
  const { projectRules } = await searchProjectRules({
    query: searchParams?.query,
    my: "true",
  });

  return (
    <main className="py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">My Rules</h1>
            <CreateProjectRuleButton />
          </div>
          <p className="text-muted-foreground">
            Manage and refine your project rules.
          </p>
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-6">
            {/* Search and filter bar */}
            <div className="flex flex-col sm:flex-row gap-4">
              <SearchBox placeholder="Search rules..." />
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
