import { Suspense } from "react";
import { Metadata } from "next";
import { PageHeader, Emphasis } from "@/components/page-header";
import { Grid, GridSkeleton } from "@/components/grid";
import { getAllAgents } from "@/lib/agents";

export const metadata: Metadata = {
  title: "All Custom Agents | Promptz.dev",
  description: "Browse all custom AI agents and specialized assistants for specific workflows and development processes with Kiro and Amazon Q Developer.",
  keywords: ["AI agents", "custom agents", "Kiro", "Amazon Q Developer", "AI-assisted development", "specialized assistants", "workflow automation"],
  openGraph: {
    title: "All Custom Agents | Promptz.dev",
    description: "Browse all custom AI agents and specialized assistants for specific workflows and development processes.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "All Custom Agents | Promptz.dev",
    description: "Browse all custom AI agents and specialized assistants for specific workflows and development processes.",
  },
};

function AgentsLoading() {
  return <GridSkeleton count={12} />;
}

async function AllAgents() {
  const agents = await getAllAgents();
  return <Grid items={agents} />;
}

export default function AgentsPage() {
  return (
    <>
      <PageHeader
        title={<>Custom <Emphasis>Agents</Emphasis> for specialized tasks</>}
        description="Pre-configured AI assistants tailored for specific workflows. From code reviews to infrastructure setup, find an agent that fits your needs."
        showLibraryLegend={true}
      />

      <section className="container mx-auto max-w-7xl px-6 py-12">
        <Suspense fallback={<AgentsLoading />}>
          <AllAgents />
        </Suspense>
      </section>
    </>
  );
}
