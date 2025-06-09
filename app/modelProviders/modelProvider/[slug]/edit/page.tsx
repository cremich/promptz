import ModelProviderForm from "@/components/modelProvider/modelProvider-form";
import { fetchCurrentAuthUser } from "@/lib/actions/cognito-auth-action";
import { fetchModelProviderBySlug } from "@/lib/actions/fetch-modelProviders-action";
import { redirect, notFound } from "next/navigation";

export default async function EditModelProviderPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;

  const user = await fetchCurrentAuthUser();
  const modelProvider = await fetchModelProviderBySlug(params.slug);

  if (!modelProvider) {
    notFound();
  }

  // Check if current user is the author
  if (modelProvider.authorId !== user.id) {
    redirect(`/modelProviders/modelProvider/${params.slug}`);
  }

  return (
    <main className="py-8">
      <h1 className="text-3xl font-bold mb-6">
        Edit Model Provider{" "}
        <span className="text-cyan-600">&apos;{modelProvider.name}&apos;</span>
      </h1>
      <ModelProviderForm modelProvider={modelProvider} />
    </main>
  );
}
