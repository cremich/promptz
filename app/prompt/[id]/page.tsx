import { fetchPrompt } from "@/app/lib/actions/prompts";
import { notFound, permanentRedirect } from "next/navigation";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const prompt = await fetchPrompt(params.id);
  if (!prompt) {
    notFound();
  }
  permanentRedirect(`/prompts/prompt/${prompt.slug}`);
}
