import { Suspense } from "react";
import { Metadata } from "next";
import { PageHeader, Emphasis } from "@/components/page-header";
import { Grid, GridSkeleton } from "@/components/grid";
import { getAllPrompts } from "@/lib/prompts";

export const metadata: Metadata = {
  title: "All Prompts | Promptz.dev",
  description: "Browse all AI development prompts, steering documents, and resources for enhanced development workflows with Kiro and Amazon Q Developer.",
  keywords: ["AI prompts", "development", "Kiro", "Amazon Q Developer", "AI-assisted development", "prompts library"],
  openGraph: {
    title: "All Prompts | Promptz.dev",
    description: "Browse all AI development prompts, steering documents, and resources for enhanced development workflows.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "All Prompts | Promptz.dev",
    description: "Browse all AI development prompts, steering documents, and resources for enhanced development workflows.",
  },
};

function PromptsLoading() {
  return <GridSkeleton count={12} />;
}

async function AllPrompts() {
  const prompts = await getAllPrompts();
  return <Grid items={prompts} />;
}

export default function PromptsPage() {
  return (
    <>
      <PageHeader
        title={<><Emphasis>Prompts</Emphasis> that accelerate your workflow</>}
        description="Ready-to-use AI instructions for code generation, testing, documentation, and architecture. Copy a prompt, paste it into Kiro, and get results instantly."
        showLibraryLegend={true}
      />

      <section className="container mx-auto max-w-7xl px-6 py-12">
        <Suspense fallback={<PromptsLoading />}>
          <AllPrompts />
        </Suspense>
      </section>
    </>
  );
}
