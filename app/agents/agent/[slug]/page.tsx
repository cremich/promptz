import { fetchCurrentAuthUser } from "@/lib/actions/cognito-auth-action";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  // Get agent slug from params
  const params = await props.params;

  // TODO: Implement fetchAgentBySlug action
  // const agent = await fetchAgentBySlug(params.slug);
  const agent = null; // Placeholder until action is implemented

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

  // TODO: Implement fetchAgentBySlug action
  // const agent = await fetchAgentBySlug(params.slug);
  const agent = null; // Placeholder until action is implemented

  if (!agent) {
    return notFound();
  }

  // Fetch the current user to check if they're the owner
  const currentUser = await fetchCurrentAuthUser();
  const isOwner =
    !currentUser.guest && currentUser.id === agent.authorId?.split("::")[0];

  return (
    <main className="py-8">
      {/* TODO: Implement AgentDetail component */}
      <div className="text-muted-foreground">
        Agent detail view will be implemented in a future task.
      </div>
    </main>
  );
}
