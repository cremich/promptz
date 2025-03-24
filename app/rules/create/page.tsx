import { redirect } from "next/navigation";
import ProjectRuleForm from "@/app/ui/rules/project-rule-form";
import { fetchCurrentAuthUser } from "@/app/lib/actions/cognito-server";

/**
 * Page component for creating a new project rule
 * This component handles authentication checks and renders the project rule form
 */
export default async function CreateProjectRulePage() {
  // Check if the user is authenticated
  const currentUser = await fetchCurrentAuthUser();

  // Redirect unauthenticated users to the login page
  if (currentUser.guest) {
    redirect("/login");
  }

  return (
    <main className="py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Create Project Rule
          </h1>
          <p className="text-muted-foreground">
            Create a new project rule to enforce coding standards and best
            practices
          </p>
        </div>

        {/* Render the project rule form component */}
        <ProjectRuleForm />
      </div>
    </main>
  );
}
