import { fetchCurrentAuthUser } from "@/app/lib/actions/cognito-server";
import { fetchMyPrompts } from "@/app/lib/actions/user";
import SearchResults from "@/app/ui/prompts/browse/search-result";
import CreatePromptButton from "@/app/ui/prompts/create-prompt-button";
import { Suspense } from "react";

export default async function MyPrompts() {
  const user = await fetchCurrentAuthUser();
  const prompts = await fetchMyPrompts(user.id);

  return (
    <main className="py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">My Prompts</h1>
            <CreatePromptButton />
          </div>
          <p className="text-muted-foreground">
            Manage and refine your prompts.
          </p>
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-6">
            <Suspense fallback={<div>Loading...</div>}>
              <SearchResults initialPrompts={prompts} />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
