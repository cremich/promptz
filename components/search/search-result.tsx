import { ProjectRule } from "@/lib/models/project-rule-model";
import ProjectRuleCard from "@/components/rules/project-rule-card";
import { Prompt } from "@/lib/models/prompt-model";
import PromptCard from "@/components/prompt/prompt-card";

type SearchResultsProps = {
  initialProjectRules?: ProjectRule[];
  initialPrompts?: Prompt[];
};

export default function SearchResults({
  initialProjectRules,
  initialPrompts,
}: SearchResultsProps) {
  return (
    <div>
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        role="list"
      >
        {initialProjectRules?.map((projectRule) => (
          <ProjectRuleCard projectRule={projectRule} key={projectRule.id} />
        ))}
        {initialPrompts?.map((prompt) => (
          <PromptCard prompt={prompt} key={prompt.id} />
        ))}
      </div>
    </div>
  );
}
