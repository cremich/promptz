import Author from "@/components/common/author";
import Tags from "@/components/common/tags";
import { HelpCircle, Terminal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SourceURL } from "@/components/common/source-url";
import { ModelType } from "@/lib/forms/schema-definitions";
import EditButton from "@/components/common/edit-button";
import { ModelProvider } from "@/lib/models/modelProvider-model";

interface ModelProviderProps {
  modelProvider: ModelProvider;
  isOwner: boolean;
}

export default async function ModelProviderDetail(props: ModelProviderProps) {
  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {props.modelProvider.name} HMMM
          </h1>
          <p className="text-muted-foreground">
            {props.modelProvider.description}
          </p>
        </div>
        <div className="flex gap-2">
          {props.modelProvider.slug && props.isOwner && (
            <EditButton
              href={`/modelProviders/modelProvider/${props.modelProvider.slug}/edit`}
              name="Edit Model Provider"
            />
          )}
          {/* {props.modelProvider.instruction && (
            <CopyClipBoardButton
              id={props.modelProvider.id!}
              type={ModelType.PROMPT}
              text={props.modelProvider.instruction}
            />
          )} */}
        </div>
      </div>
      <div className="flex items-start justify-between mb-8">
        <div className="mt-4 flex items-center gap-4">
          {props.modelProvider.author && (
            <Author name={props.modelProvider.author} />
          )}
        </div>
        <div className="mt-4">{/* badge would go here */}</div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* {props.modelProvider.instruction && (
          <div
            className={`overflow-hidden gap-4 ${props.modelProvider.howto ? "lg:col-span-2" : "lg:col-span-3"}`}
          >
            <ModelProviderInstruction
              title="ModelProvider"
              modelProviderId={props.modelProvider.id!}
              icon={Terminal}
              text={props.modelProvider.instruction!}
            />
          </div>
        )}
        {props.modelProvider.howto && (
          <div className="lg:col-span-1">
            <ModelProviderHowTo
              title="How to Use"
              icon={HelpCircle}
              text={props.modelProvider.howto}
            />
          </div>
        )} */}
      </div>

      {props.modelProvider.website && (
        <SourceURL url={props.modelProvider.website} />
      )}
    </div>
  );
}
