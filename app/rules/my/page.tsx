import { fetchCurrentAuthUser } from "@/app/lib/actions/cognito-server";
import { fetchMyRules } from "@/app/lib/actions/user";
import SearchResults from "@/components/search/search-result";
import CreateButton from "@/components/common/create-button";
import { Suspense } from "react";

export default async function MyRules() {
  const user = await fetchCurrentAuthUser();
  const rules = await fetchMyRules(user.id);

  return (
    <main className="py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">My Rules</h1>
            <CreateButton />
          </div>
          <p className="text-muted-foreground">
            Manage and refine your project rules.
          </p>
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-6">
            <Suspense fallback={<div>Loading...</div>}>
              <SearchResults initialProjectRules={rules} />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
