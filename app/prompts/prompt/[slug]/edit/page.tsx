import PromptForm from "@/components/prompt/prompt-form";
import { fetchCurrentAuthUser } from "@/lib/actions/cognito-auth-action";
import { fetchPromptBySlug } from "@/lib/actions/fetch-prompts-action";
import { redirect, notFound } from "next/navigation";

export default async function EditPromptPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;

  const user = await fetchCurrentAuthUser();
  const prompt = await fetchPromptBySlug(params.slug);

  if (!prompt) {
    notFound();
  }

  // Check if current user is the author
  if (prompt.authorId !== user.id) {
    redirect(`/prompts/prompt/${params.slug}`);
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
