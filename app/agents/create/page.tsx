import { fetchTagsByCategory } from "@/lib/actions/fetch-tags-action";

export default async function CreateAgent() {
  const qInterfaceTags = await fetchTagsByCategory("Interface");
  const qAgentTags = await fetchTagsByCategory("Agent");
  const sdlcTags = await fetchTagsByCategory("SDLC");

  const tags = [...qInterfaceTags, ...qAgentTags, ...sdlcTags];

  return (
    <main className="py-8">
      <h1 className="text-3xl font-bold mb-6">Create Agent</h1>
      {/* TODO: Implement AgentForm component */}
      <div className="text-muted-foreground">
        Agent creation form will be implemented in a future task.
      </div>
    </main>
  );
}
