import PromptDetail from "@/components/prompt/prompt-detail";
import { fetchCurrentAuthUser } from "@/lib/actions/cognito-auth-action";
import { fetchPromptBySlug } from "@/lib/actions/fetch-prompts-action";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  // Get prompt ID from params
  const params = await props.params;

  // Fetch prompt data
  const prompt = await fetchPromptBySlug(params.slug);
  if (!prompt) {
    return {
      title: "Prompt Not Found",
    };
  } else {
    return {
      title: `${prompt.title} prompt for Amazon Q Developer`,
      description: prompt.description,
      openGraph: {
        title: `${prompt.title} prompt for Amazon Q Developer`,
        description: prompt.description,
      },
    };
  }
}

export default async function PromptDetailPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const prompt = await fetchPromptBySlug(params.slug);

  if (!prompt) {
    return notFound();
  }

  // Fetch the current user to check if they're the owner
  const currentUser = await fetchCurrentAuthUser();
  const isOwner =
    !currentUser.guest && currentUser.id === prompt.authorId?.split("::")[0];

  return (
    <main className="py-8">
      <PromptDetail prompt={prompt} isOwner={isOwner} />
    </main>
  );
}
