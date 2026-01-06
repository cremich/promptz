import { Suspense } from "react";
import { PageHeader, Emphasis } from "@/components/page-header";
import { Grid, GridSkeleton } from "@/components/grid";
import { getAllPowers } from "@/lib/powers";

function PowersLoading() {
  return <GridSkeleton count={12} />;
}

async function AllPowers() {
  const powers = await getAllPowers();
  return <Grid items={powers} />;
}

export default function PowersPage() {
  return (
    <>
      <PageHeader
        title={<><Emphasis>Powers</Emphasis> that extend Kiro&apos;s capabilities</>}
        description="Activate packaged integrations for AWS, Stripe, Terraform, and more. Each power brings domain expertise and best practices directly into your workflow."
        showLibraryLegend={true}
      />

      <section className="container mx-auto max-w-7xl px-6 py-12">
        <Suspense fallback={<PowersLoading />}>
          <AllPowers />
        </Suspense>
      </section>
    </>
  );
}

export const metadata = {
  title: "Kiro Powers | Promptz.dev",
  description: "Discover packaged tools, workflows, and best practices that Kiro can activate on-demand. Powers provide comprehensive integrations with popular services and development tools.",
};
