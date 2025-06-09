import ModelDetail from "@/components/model/model-detail";
import { fetchCurrentAuthUser } from "@/lib/actions/cognito-auth-action";
import { fetchModelBySlug } from "@/lib/actions/fetch-models-action";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  // Get model ID from params
  const params = await props.params;

  // Fetch model data
  const model = await fetchModelBySlug(params.slug);
  if (!model) {
    return {
      title: "Model Not Found",
    };
  } else {
    return {
      title: `${model.name} model Provider for AI tools`,
      description: model.description,
      openGraph: {
        title: `${model.name} model Provider for AI tools`,
        description: model.description,
      },
    };
  }
}

export default async function ModelDetailPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const model = await fetchModelBySlug(params.slug);

  if (!model) {
    return notFound();
  }

  // Fetch the current user to check if they're the owner
  const currentUser = await fetchCurrentAuthUser();
  const isOwner =
    !currentUser.guest && currentUser.id === model.authorId?.split("::")[0];

  return (
    <main className="py-8">
      <ModelDetail model={model} isOwner={isOwner} />
    </main>
  );
}
