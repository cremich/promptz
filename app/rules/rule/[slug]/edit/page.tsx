import { redirect, notFound } from "next/navigation";
import ProjectRuleForm from "@/app/ui/rules/project-rule-form";
import { fetchCurrentAuthUser } from "@/app/lib/actions/cognito-server";
import { fetchProjectRuleBySlug } from "@/app/lib/actions/project-rules";

// Define the props for the page component
interface EditProjectRulePageProps {
  slug: string;
}

/**
 * Page component for editing an existing project rule
 * This component handles authentication checks, data fetching, and renders the project rule form
 */
export default async function EditProjectRulePage(props: {
  params: Promise<EditProjectRulePageProps>;
}) {
  const params = await props.params;

  // Check if the user is authenticated
  const currentUser = await fetchCurrentAuthUser();

  // Redirect unauthenticated users to the login page
  if (currentUser.guest) {
    redirect("/login");
  }

  // Fetch the project rule by slug
  const projectRule = await fetchProjectRuleBySlug(params.slug);

  // If the project rule doesn't exist, return a 404 page
  if (!projectRule) {
    notFound();
  }

  // Check if the current user is the owner of the project rule
  const isOwner = currentUser.id === projectRule.authorId;
  // If the user is not the owner, redirect to the project rule page
  if (!isOwner) {
    redirect(`/rules/rule/${projectRule.slug}`);
  }

  return (
    <main className="py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Edit Project Rule
          </h1>
          <p className="text-muted-foreground">
            Update your project rule to improve coding standards and best
            practices
          </p>
        </div>

        {/* Render the project rule form component with the existing project rule data */}
        <ProjectRuleForm projectRule={projectRule} />
      </div>
    </main>
  );
}
