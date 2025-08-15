import { fetchCurrentAuthUser } from "@/lib/actions/cognito-auth-action";
import { fetchTagsByCategory } from "@/lib/actions/fetch-tags-action";
import { fetchAgentBySlug } from "@/lib/actions/fetch-agents-action";
import { notFound, redirect } from "next/navigation";
import AgentForm from "@/components/agents/agent-form";

export default async function EditAgent(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;

  const agent = await fetchAgentBySlug(params.slug);

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
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Edit Agent</h1>
        <p className="text-muted-foreground mb-8">
          Update your Amazon Q Developer CLI agent configuration.
        </p>
        <AgentForm agent={agent} tags={tags} />
      </div>
    </main>
  );
}
