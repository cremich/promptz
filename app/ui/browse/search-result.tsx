import { Prompt } from "@/app/lib/definitions";
import PromptCard from "@/app/ui/prompts/prompt-card";

type SearchResultsProps = {
  initialPrompts: Prompt[];
};

export default function SearchResults({ initialPrompts }: SearchResultsProps) {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {initialPrompts.map((prompt) => (
          <PromptCard prompt={prompt} key={prompt.id} />
        ))}
      </div>
    </div>
  );
}
