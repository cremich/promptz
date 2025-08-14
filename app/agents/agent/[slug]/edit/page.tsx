import { fetchCurrentAuthUser } from "@/lib/actions/cognito-auth-action";
import { fetchTagsByCategory } from "@/lib/actions/fetch-tags-action";
import { notFound, redirect } from "next/navigation";

export default async function EditAgent(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;

  // TODO: Implement fetchAgentBySlug action
  // const agent = await fetchAgentBySlug(params.slug);
  const agent = null; // Placeholder until action is implemented

  if (!agent) {
    return notFound();
  }

  // Check if user is the owner
  const currentUser = await fetchCurrentAuthUser();
  if (currentUser.guest || currentUser.id !== agent.authorId?.split("::")[0]) {
    redirect(`/agents/agent/${params.slug}`);
  }

  const qInterfaceTags = await fetchTagsByCategory("Interface");
  const qAgentTags = await fetchTagsByCategory("Agent");
  const sdlcTags = await fetchTagsByCategory("SDLC");

  const tags = [...qInterfaceTags, ...qAgentTags, ...sdlcTags];

  return (
    <main className="py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Agent</h1>
      {/* TODO: Implement AgentForm component with agent prop */}
      <div className="text-muted-foreground">
        Agent editing form will be implemented in a future task.
      </div>
    </main>
  );
}
