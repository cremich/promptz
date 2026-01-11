import { Suspense } from "react";
import { Metadata } from "next";
import { PageHeader, Emphasis } from "@/components/page-header";
import { Grid, GridSkeleton } from "@/components/grid";
import { getAllSteering } from "@/lib/steering";

export const metadata: Metadata = {
  title: "All Steering Documents | Promptz.dev",
  description: "Browse all AI steering documents and configuration files for consistent AI assistant behavior with Kiro and Amazon Q Developer.",
  keywords: ["AI steering", "configuration", "Kiro", "Amazon Q Developer", "AI-assisted development", "steering documents", "AI guidance"],
  openGraph: {
    title: "All Steering Documents | Promptz.dev",
    description: "Browse all AI steering documents and configuration files for consistent AI assistant behavior.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "All Steering Documents | Promptz.dev",
    description: "Browse all AI steering documents and configuration files for consistent AI assistant behavior.",
  },
};

function SteeringLoading() {
  return <GridSkeleton count={12} />;
}

async function AllSteering() {
  const steering = await getAllSteering();
  return <Grid items={steering} />;
}

export default function SteeringPage() {
  return (
    <>
      <PageHeader
        title={<><Emphasis>Steering</Emphasis> for consistent AI behavior</>}
        description="Define coding standards, architectural patterns, and team conventions. Steering documents ensure Kiro follows your rules across every interaction."
        showLibraryLegend={true}
      />

      <section className="container mx-auto max-w-7xl px-6 py-12">
        <Suspense fallback={<SteeringLoading />}>
          <AllSteering />
        </Suspense>
      </section>
    </>
  );
}
