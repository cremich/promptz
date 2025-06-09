import { ProjectRule } from "@/lib/models/project-rule-model";
import ProjectRuleCard from "@/components/rules/project-rule-card";
import { Prompt } from "@/lib/models/prompt-model";
import PromptCard from "@/components/prompt/prompt-card";
import { Model } from "@/lib/models/model-model";
import ModelCard from "@/components/model/model-card";
import { ModelProvider } from "@/lib/models/modelProvider-model";
import ModelProviderCard from "@/components/modelProvider/modelProvider-card";

type SearchResultsProps = {
  initialProjectRules?: ProjectRule[];
  initialPrompts?: Prompt[];
  initialModels?: Model[];
  initialModelProviders?: ModelProvider[];
};

export default function SearchResults({
  initialProjectRules,
  initialPrompts,
  initialModels,
  initialModelProviders,
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
        {initialModels?.map((model) => (
          <ModelCard model={model} key={model.id} />
        ))}
        {initialModelProviders?.map((modelProvider) => (
          <ModelProviderCard
            modelProvider={modelProvider}
            key={modelProvider.id}
          />
        ))}
      </div>
    </div>
  );
}
