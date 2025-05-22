import SearchResults from "@/components/search/search-result";
import CreateButton from "@/components/common/create-button";
import { fetchMyRules } from "@/lib/actions/my-rules-action";
import { fetchCurrentAuthUser } from "@/lib/actions/cognito-auth-action";

export default async function MyRules() {
  const user = await fetchCurrentAuthUser();
  const rules = await fetchMyRules(user.id);

  return (
    <main className="py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">My Rules</h1>
            <CreateButton href="/rules/create" name="Create Rule" />
          </div>
          <p className="text-muted-foreground">
            Manage and refine your project rules.
          </p>
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-6">
            <SearchResults initialProjectRules={rules} />
          </div>
        </div>
      </div>
    </main>
  );
}
