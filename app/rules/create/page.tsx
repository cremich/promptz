import ProjectRuleForm from "@/components/rules/project-rule-form";

export default function CreateProjectRulePage() {
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
        <ProjectRuleForm />
      </div>
    </main>
  );
}
