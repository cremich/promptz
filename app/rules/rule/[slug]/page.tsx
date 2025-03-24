import { fetchProjectRuleBySlug } from "@/app/lib/actions/project-rules";
import { fetchCurrentAuthUser } from "@/app/lib/actions/cognito-server";
import { notFound } from "next/navigation";
import ProjectRuleDetail from "@/app/ui/rules/project-rule-detail";
import { Metadata } from "next";

// Define the props for the page component
interface ProjectRulePageProps {
  slug: string;
}

export async function generateMetadata(props: {
  params: Promise<ProjectRulePageProps>;
}): Promise<Metadata> {
  // Get project rule slug from params
  const params = await props.params;

  // Fetch project rule data
  const projectRule = await fetchProjectRuleBySlug(params.slug);
  if (!projectRule) {
    return {
      title: "Project Rule Not Found",
    };
  } else {
    return {
      title: `${projectRule.title} - Project Rule for Amazon Q Developer`,
      description: projectRule.description,
      openGraph: {
        title: `${projectRule.title} - Project Rule for Amazon Q Developer`,
        description: projectRule.description,
      },
    };
  }
}

/**
 * Page component for displaying a single project rule
 * This component handles data fetching and passes the data to the ProjectRuleDetail component
 */
export default async function ProjectRulePage(props: {
  params: Promise<ProjectRulePageProps>;
}) {
  // Fetch the project rule by slug
  const params = await props.params;
  const projectRule = await fetchProjectRuleBySlug(params.slug);

  // If the project rule doesn't exist, return a 404 page
  if (!projectRule) {
    notFound();
  }

  // Fetch the current user to check if they're the owner
  const currentUser = await fetchCurrentAuthUser();
  const isOwner =
    !currentUser.guest &&
    currentUser.id === projectRule.authorId?.split("::")[0];

  return (
    <main className="py-8">
      <ProjectRuleDetail projectRule={projectRule} isOwner={isOwner} />
    </main>
  );
}
