import ModelProviderDetail from "@/components/modelProvider/modelProvider-detail";
import { fetchCurrentAuthUser } from "@/lib/actions/cognito-auth-action";
import { fetchModelProviderBySlug } from "@/lib/actions/fetch-modelProviders-action";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  // Get modelProvider ID from params
  const params = await props.params;

  // Fetch modelProvider data
  const modelProvider = await fetchModelProviderBySlug(params.slug);
  if (!modelProvider) {
    return {
      title: "ModelProvider Not Found",
    };
  } else {
    return {
      title: `${modelProvider.name} model Provider for AI tools`,
      description: modelProvider.description,
      openGraph: {
        title: `${modelProvider.name} model Provider for AI tools`,
        description: modelProvider.description,
      },
    };
  }
}

export default async function ModelProviderDetailPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const modelProvider = await fetchModelProviderBySlug(params.slug);

  if (!modelProvider) {
    return notFound();
  }

  // Fetch the current user to check if they're the owner
  const currentUser = await fetchCurrentAuthUser();
  const isOwner =
    !currentUser.guest &&
    currentUser.id === modelProvider.authorId?.split("::")[0];

  return (
    <main className="py-8">
      <ModelProviderDetail modelProvider={modelProvider} isOwner={isOwner} />
    </main>
  );
}
