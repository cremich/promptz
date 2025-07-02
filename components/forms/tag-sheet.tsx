"use client";
import SelectableTags from "@/components/forms/selectable-tag";
import { Badge } from "@/components/ui/badge";
import {
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  Sheet,
} from "@/components/ui/sheet";
import { Tag } from "@/lib/models/tags-model";

interface TagSheetProps {
  submission: "prompt" | "project rule";
  onTagSelect: (tag: string) => void;
  selectedTags?: string[];
  tags: Tag[];
}

export default function TagSheet(props: TagSheetProps) {
  return (
    <Sheet>
      <SheetTrigger>
        <Badge
          key="add-tag"
          variant="secondary"
          className="bg-neutral-600 border-dashed border-white hover:bg-neutral-600 cursor-pointer"
        >
          Edit Tags
        </Badge>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Tags</SheetTitle>
          <SheetDescription>
            <div>
              Select the relevant tags below to improve the discoverability of
              your {props.submission}.
            </div>
            <div className="my-2">
              If relevant, select things like the{" "}
              <span className="text-violet-500 font-semibold">
                Amazon Q Developer interface
              </span>{" "}
              (e.g. IDE, CLI),{" "}
              <span className="text-violet-500 font-semibold">the agent</span>{" "}
              (e.g. chat, agent) or the{" "}
              <span className="text-violet-500 font-semibold">
                SDLC activity
              </span>{" "}
              (e.g. Design, Implementation) this {props.submission} relates to.
            </div>
          </SheetDescription>
        </SheetHeader>
        <div className="my-4">
          <p>Amazon Q Developer Interface:</p>
          <p className="text-sm text-muted-foreground">
            Is the prompt related to Amazon Q Developer in your IDE, your CLI or
            the AWS Management Console?
          </p>
        </div>
        <SelectableTags
          tags={
            props.tags
              ?.filter((t) => t.category === "Interface")
              .map((t) => t.name) || []
          }
          selectedTags={props.selectedTags}
          onTagSelect={props.onTagSelect}
        />
        <div className="my-4">
          <p>Agent:</p>
          <p className="text-sm text-muted-foreground">
            Is this prompt related to an Amazon Q Developer agent?
          </p>
        </div>
        <SelectableTags
          tags={
            props.tags
              ?.filter((t) => t.category === "Agent")
              .map((t) => t.name) || []
          }
          selectedTags={props.selectedTags}
          onTagSelect={props.onTagSelect}
        />
        <div className="my-4">
          <p>SDLC Activity:</p>
          <p className="text-sm text-muted-foreground">
            Which activity of the SDLC does this prompt relate to?
          </p>
        </div>
        <SelectableTags
          tags={
            props.tags
              ?.filter((t) => t.category === "SDLC")
              .map((t) => t.name) || []
          }
          selectedTags={props.selectedTags}
          onTagSelect={props.onTagSelect}
        />
      </SheetContent>
    </Sheet>
  );
}
