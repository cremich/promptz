import { Suspense } from "react";
import { Metadata } from "next";
import { PageHeader, Emphasis } from "@/components/page-header";
import { Grid, GridSkeleton } from "@/components/grid";
import { getAllHooks } from "@/lib/hooks";

export const metadata: Metadata = {
  title: "All Agent Hooks | Promptz.dev",
  description: "Browse all agent hooks and automation tools that execute predefined agent actions when specific IDE events occur with Kiro and Amazon Q Developer.",
  keywords: ["agent hooks", "automation", "Kiro", "Amazon Q Developer", "AI-assisted development", "IDE automation", "workflow triggers"],
  openGraph: {
    title: "All Agent Hooks | Promptz.dev",
    description: "Browse all agent hooks and automation tools that execute predefined agent actions when specific IDE events occur.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "All Agent Hooks | Promptz.dev",
    description: "Browse all agent hooks and automation tools that execute predefined agent actions when specific IDE events occur.",
  },
};

function HooksLoading() {
  return <GridSkeleton count={12} />;
}

async function AllHooks() {
  const hooks = await getAllHooks();
  return <Grid items={hooks} />;
}

export default function HooksPage() {
  return (
    <>
      <PageHeader
        title={<><Emphasis>Hooks</Emphasis> that automate your IDE</>}
        description="Trigger agent actions automatically when you save files, open projects, or hit specific events. Set up once, benefit forever."
        showLibraryLegend={true}
      />

      <section className="container mx-auto max-w-7xl px-6 py-12">
        <Suspense fallback={<HooksLoading />}>
          <AllHooks />
        </Suspense>
      </section>
    </>
  );
}
