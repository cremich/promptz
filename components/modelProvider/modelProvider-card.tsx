import { ModelProvider } from "@/lib/models/modelProvider-model";
import Author from "@/components/common/author";
import Tags from "@/components/common/tags";
import { Card, CardHeader, CardFooter } from "@/components/ui/card";
import Link from "next/link";

interface ModelProviderCardProps {
  modelProvider: ModelProvider;
}

export default function ModelProviderCard({
  modelProvider,
}: ModelProviderCardProps) {
  return (
    <Card
      key={modelProvider.id}
      className="flex flex-col"
      data-testid="modelProvider-card"
    >
      <CardHeader className="flex-1">
        <div className="space-y-4">
          <h3 className="font-semibold text-xl">
            <Link
              href={`/modelProviders/modelProvider/${modelProvider.slug}`}
              className="hover:text-cyan-500"
            >
              {modelProvider.name}
            </Link>
          </h3>
          <p className="text-muted-foreground">{modelProvider.description}</p>
        </div>
      </CardHeader>
      <CardFooter>
        {modelProvider.author && <Author name={modelProvider.author} />}
      </CardFooter>
    </Card>
  );
}
