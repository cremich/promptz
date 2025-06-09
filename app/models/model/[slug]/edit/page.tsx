import ModelForm from "@/components/model/model-form";
import { fetchCurrentAuthUser } from "@/lib/actions/cognito-auth-action";
import { fetchModelBySlug } from "@/lib/actions/fetch-models-action";
import { redirect, notFound } from "next/navigation";

export default async function EditModelPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;

  const user = await fetchCurrentAuthUser();
  const model = await fetchModelBySlug(params.slug);

  if (!model) {
    notFound();
  }

  // Check if current user is the author
  if (model.authorId !== user.id) {
    redirect(`/models/model/${params.slug}`);
  }

  return (
    <main className="py-8">
      <h1 className="text-3xl font-bold mb-6">
        Edit Model Provider{" "}
        <span className="text-cyan-600">&apos;{model.name}&apos;</span>
      </h1>
      <ModelForm model={model} />
    </main>
  );
}
