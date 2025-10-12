import AgentDetail from "@/components/agents/agent-detail";
import { fetchAgentBySlug } from "@/lib/actions/fetch-agents-action";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  // Get agent slug from params
  const params = await props.params;

  // Fetch agent data
  const agent = await fetchAgentBySlug(params.slug);
  if (!agent) {
    return {
      title: "Agent Not Found",
    };
  } else {
    return {
      title: `${agent.name} agent for Amazon Q Developer`,
      description: agent.description,
      openGraph: {
        title: `${agent.name} agent for Amazon Q Developer`,
        description: agent.description,
      },
    };
  }
}

export default async function AgentDetailPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const agent = await fetchAgentBySlug(params.slug);

  if (!agent) {
    return notFound();
  }

  return (
    <main className="py-8">
      <AgentDetail agent={agent} />
    </main>
  );
}
