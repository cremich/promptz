import { fetchPrompt } from "@/app/lib/prompts";
import Author from "@/app/ui/prompts/author";
import Tags from "@/app/ui/prompts/tags";
import { FileText, HelpCircle, Terminal } from "lucide-react";
import AttributeCard from "@/app/ui/prompts/attribute-card";

interface PromptProps {
  promptId: string;
}

export default async function Prompt(props: PromptProps) {
  const prompt = await fetchPrompt(props.promptId);
  return (
    <div>
      <div className="mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{prompt.title}</h1>
          <div className="mt-4 flex items-center gap-4">
            {prompt.author && <Author name={prompt.author} />}
            {prompt.tags && <Tags tags={prompt.tags} />}
          </div>
        </div>
        {/* <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 border-gray-800 bg-transparent text-gray-400 hover:bg-purple-900/30 hover:text-purple-300"
            onClick={toggleFavorite}
          >
            <Heart
              className={`h-5 w-5 ${isFavorited ? "fill-current text-purple-500" : ""}`}
            />
            <span className="sr-only">
              {isFavorited ? "Remove from favorites" : "Add to favorites"}
            </span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 border-gray-800 bg-transparent text-gray-400 hover:bg-purple-900/30 hover:text-purple-300"
            onClick={copyToClipboard}
          >
            <Copy className="h-5 w-5" />
            <span className="sr-only">Copy prompt</span>
          </Button>
        </div> */}
      </div>
      {prompt.description && (
        <AttributeCard
          title="Description"
          icon={FileText}
          text={prompt.description}
        />
      )}
      {prompt.howto && (
        <AttributeCard
          title="How to Use"
          icon={HelpCircle}
          text={prompt.howto}
        />
      )}

      {prompt.instruction && (
        <AttributeCard
          title="Prompt"
          icon={Terminal}
          text={prompt.instruction}
        />
      )}
    </div>
  );
}
