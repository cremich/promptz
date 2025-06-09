import { Model } from "@/lib/models/model-model";
import Author from "@/components/common/author";
import { Card, CardHeader, CardFooter } from "@/components/ui/card";
import Link from "next/link";

interface ModelCardProps {
  model: Model;
}

export default function ModelCard({ model }: ModelCardProps) {
  return (
    <Card key={model.id} className="flex flex-col" data-testid="model-card">
      <CardHeader className="flex-1">
        <div className="space-y-4">
          <h3 className="font-semibold text-xl">
            <Link
              href={`/models/model/${model.slug}`}
              className="hover:text-cyan-500"
            >
              {model.name}
            </Link>
          </h3>
          <p className="text-muted-foreground">{model.description}</p>
        </div>
      </CardHeader>
      <CardFooter>{model.author && <Author name={model.author} />}</CardFooter>
    </Card>
  );
}
