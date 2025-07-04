import ProjectRuleForm from "@/components/rules/project-rule-form";
import { fetchTagsByCategory } from "@/lib/actions/fetch-tags-action";

export default async function CreateProjectRulePage() {
  const interfaceTags = await fetchTagsByCategory("Interface");
  const sdlcTags = await fetchTagsByCategory("SDLC");
  const languageTags = await fetchTagsByCategory("Language");
  const frameworkTags = await fetchTagsByCategory("Framework");
  const miscTags = await fetchTagsByCategory("Misc");

  const tags = [
    ...interfaceTags,
    ...sdlcTags,
    ...languageTags,
    ...frameworkTags,
    ...miscTags,
  ];

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
        <ProjectRuleForm tags={tags} />
      </div>
    </main>
  );
}
