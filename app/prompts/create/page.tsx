import PromptForm from "@/components/prompt/prompt-form";
import { fetchTagsByCategory } from "@/lib/actions/fetch-tags-action";

export default async function CreatePrompt() {
  const qInterfaceTags = await fetchTagsByCategory("Interface");
  const qAgentTags = await fetchTagsByCategory("Agent");
  const sdlcTags = await fetchTagsByCategory("SDLC");

  const tags = [...qInterfaceTags, ...qAgentTags, ...sdlcTags];

  return (
    <main className="py-8">
      <h1 className="text-3xl font-bold mb-6">Create Prompt</h1>
      <PromptForm tags={tags} />
    </main>
  );
}
