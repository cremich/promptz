import { ProjectRule } from "@/app/lib/definitions";
import ProjectRuleCard from "@/app/ui/rules/project-rule-card";

type SearchResultsProps = {
  initialProjectRules: ProjectRule[];
};

export default function SearchResults({
  initialProjectRules,
}: SearchResultsProps) {
  return (
    <div>
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        role="list"
      >
        {initialProjectRules.map((projectRule) => (
          <ProjectRuleCard projectRule={projectRule} key={projectRule.id} />
        ))}
      </div>
    </div>
  );
}
