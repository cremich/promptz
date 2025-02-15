import Prompt from "@/app/ui/prompts/prompt";

export default function Page({ params }: { params: { id: string } }) {
  return (
    <main className="py-8">
      <Prompt promptId={params.id} />
    </main>
  );
}
