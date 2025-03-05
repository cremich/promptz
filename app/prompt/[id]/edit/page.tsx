import { fetchCurrentAuthUser } from "@/app/lib/actions/cognito-server";
import { fetchPrompt } from "@/app/lib/actions/prompts";
import PromptForm from "@/app/ui/prompts/form";
import { redirect, notFound } from "next/navigation";

export default async function EditPrompt({
  params,
}: {
  params: { id: string };
}) {
  const user = await fetchCurrentAuthUser();
  const prompt = await fetchPrompt(params.id);

  if (!prompt) {
    notFound();
  }

  // Check if current user is the author
  if (prompt.authorId !== user.id) {
    redirect(`/prompt/${params.id}`);
  }

  return (
    <main className="py-8">
      <h1 className="text-3xl font-bold mb-6">
        Edit Prompt{" "}
        <span className="text-violet-600">&apos;{prompt.title}&apos;</span>
      </h1>
      <PromptForm prompt={prompt} />
    </main>
  );
}
