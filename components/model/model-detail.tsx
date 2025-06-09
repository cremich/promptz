import Author from "@/components/common/author";
import { SourceURL } from "@/components/common/source-url";
import EditButton from "@/components/common/edit-button";
import { Model } from "@/lib/models/model-model";

interface ModelProps {
  model: Model;
  isOwner: boolean;
}

export default async function ModelDetail(props: ModelProps) {
  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {props.model.name}
          </h1>
          <p className="text-muted-foreground">{props.model.description}</p>
        </div>
        <div className="flex gap-2">
          {props.model.slug && props.isOwner && (
            <EditButton
              href={`/models/model/${props.model.slug}/edit`}
              name="Edit Model Provider"
            />
          )}
          {/* {props.model.instruction && (
            <CopyClipBoardButton
              id={props.model.id!}
              type={ModelType.PROMPT}
              text={props.model.instruction}
            />
          )} */}
        </div>
      </div>
      <div className="flex items-start justify-between mb-8">
        <div className="mt-4 flex items-center gap-4">
          {props.model.author && <Author name={props.model.author} />}
        </div>
        <div className="mt-4">{/* badge would go here */}</div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* {props.model.instruction && (
          <div
            className={`overflow-hidden gap-4 ${props.model.howto ? "lg:col-span-2" : "lg:col-span-3"}`}
          >
            <ModelInstruction
              title="Model"
              modelId={props.model.id!}
              icon={Terminal}
              text={props.model.instruction!}
            />
          </div>
        )}
        {props.model.howto && (
          <div className="lg:col-span-1">
            <ModelHowTo
              title="How to Use"
              icon={HelpCircle}
              text={props.model.howto}
            />
          </div>
        )} */}
      </div>

      {props.model.documentationURL && (
        <SourceURL url={props.model.documentationURL} />
      )}
    </div>
  );
}
