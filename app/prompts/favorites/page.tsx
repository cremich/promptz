import { fetchCurrentAuthUser } from "@/app/lib/actions/cognito-server";
import { fetchFavoritePrompts } from "@/app/lib/actions/user";
import SearchBox from "@/app/ui/browse/search";
import SearchResults from "@/app/ui/browse/search-result";
import CreatePromptButton from "@/app/ui/prompts/create-prompt-button";
import { Suspense } from "react";

export default async function FavoritePrompts() {
  const user = await fetchCurrentAuthUser();
  const prompts = await fetchFavoritePrompts(user.id);

  return (
    <main className="py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">
              Favorite Prompts
            </h1>
            <CreatePromptButton />
          </div>
          <p className="text-muted-foreground">
            Your collection of prompts that you have starred.
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
