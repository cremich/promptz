import { Suspense } from "react";
import SearchResults from "@/components/search/search-result";
import CreateButton from "@/components/common/create-button";
import { fetchMyModels } from "@/lib/actions/my-models-action";
import { fetchCurrentAuthUser } from "@/lib/actions/cognito-auth-action";

export default async function MyModels() {
  const user = await fetchCurrentAuthUser();
  const models = await fetchMyModels(user.id);

  return (
    <main className="py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">
              My Model Providers
            </h1>
            <CreateButton href="/models/create" name="Create Model Provider" />
          </div>
          <p className="text-muted-foreground">
            Manage and refine your Model Providers.
          </p>
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-6">
            <Suspense fallback={<div>Loading...</div>}>
              <SearchResults initialModels={models} />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
