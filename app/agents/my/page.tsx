import { Suspense } from "react";
import SearchResults from "@/components/search/search-result";
import CreateButton from "@/components/common/create-button";
import { fetchCurrentAuthUser } from "@/lib/actions/cognito-auth-action";

export default async function MyAgents() {
  const user = await fetchCurrentAuthUser();

  // TODO: Implement fetchMyAgents action
  // const agents = await fetchMyAgents(user.id);
  const agents: any[] = []; // Placeholder until action is implemented

  return (
    <main className="py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">My Agents</h1>
            <CreateButton href="/agents/create" name="Create Agent" />
          </div>
          <p className="text-muted-foreground">
            Manage and refine your Amazon Q Developer CLI custom agents.
          </p>
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-6">
            <Suspense fallback={<div>Loading...</div>}>
              <SearchResults initialAgents={agents} />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
