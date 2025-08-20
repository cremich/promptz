import { fetchTagsByCategory } from "@/lib/actions/fetch-tags-action";
import AgentForm from "@/components/agents/agent-form";

export default async function CreateAgent() {
  const qInterfaceTags = await fetchTagsByCategory("Interface");
  const qAgentTags = await fetchTagsByCategory("Agent");
  const sdlcTags = await fetchTagsByCategory("SDLC");

  const tags = [...qInterfaceTags, ...qAgentTags, ...sdlcTags];

  return (
    <main className="py-8">
      <h1 className="text-3xl font-bold mb-6">Create Agent</h1>
      <p className="text-muted-foreground mb-8">
        Create a new Amazon Q Developer CLI agent to help with your development
        workflow.
      </p>
      <AgentForm tags={tags} />
    </main>
  );
}
