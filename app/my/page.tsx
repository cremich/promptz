import { searchPrompts } from "@/app/lib/actions/prompts";
import SearchBox from "@/app/ui/browse/search";
import SearchResults from "@/app/ui/browse/search-result";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

interface BrowsePageProps {
  searchParams: {
    query?: string;
    my?: string;
  };
}

export default async function MyPrompts({ searchParams }: BrowsePageProps) {
  const { prompts } = await searchPrompts({
    query: searchParams.query,
    my: "true",
  });

  return (
    <main className="py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">My Prompts</h1>
            <Button asChild className="bg-violet-500 hover:bg-violet-600">
              <Link href="/prompt/create" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Prompt
              </Link>
            </Button>
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
