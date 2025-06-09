import { Suspense } from "react";
import SearchResults from "@/components/search/search-result";
import CreateButton from "@/components/common/create-button";
import { fetchMyModelProviders } from "@/lib/actions/my-modelProviders-action";
import { fetchCurrentAuthUser } from "@/lib/actions/cognito-auth-action";

export default async function MyModelProviders() {
  const user = await fetchCurrentAuthUser();
  const modelProviders = await fetchMyModelProviders(user.id);

  return (
    <main className="py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">
              My Model Providers
            </h1>
            <CreateButton
              href="/modelProviders/create"
              name="Create Model Provider"
            />
          </div>
          <p className="text-muted-foreground">
            Manage and refine your Model Providers.
          </p>
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-6">
            <Suspense fallback={<div>Loading...</div>}>
              <SearchResults initialModelProviders={modelProviders} />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
