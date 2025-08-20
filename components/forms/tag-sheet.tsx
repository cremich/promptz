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
  submission: "prompt" | "project rule" | "agent";
  onTagSelect: (tag: string) => void;
  selectedTags?: string[];
  tags: Tag[];
}

export default function TagSheet(props: TagSheetProps) {
  const isPrompt = props.submission === "prompt";
  const isProjectRule = props.submission === "project rule";
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
            {isPrompt && (
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
                (e.g. Design, Implementation) this {props.submission} relates
                to.
              </div>
            )}
            {isProjectRule && (
              <div className="my-2">
                Select tags related to the{" "}
                <span className="text-violet-500 font-semibold">interface</span>{" "}
                (e.g. IDE, CLI),{" "}
                <span className="text-violet-500 font-semibold">
                  programming language
                </span>{" "}
                (e.g. TypeScript, Python),{" "}
                <span className="text-violet-500 font-semibold">framework</span>{" "}
                (e.g. Next.js, React),{" "}
                <span className="text-violet-500 font-semibold">IaC tools</span>{" "}
                (e.g. CDK, Terraform), or{" "}
                <span className="text-violet-500 font-semibold">
                  SDLC activity
                </span>{" "}
                this project rule applies to.
              </div>
            )}
          </SheetDescription>
        </SheetHeader>

        {/* Interface section - shown for both prompts and project rules */}
        <div className="my-4">
          <p>Amazon Q Developer Interface:</p>
          <p className="text-sm text-muted-foreground">
            {isPrompt
              ? "Is the prompt related to Amazon Q Developer in your IDE, your CLI or the AWS Management Console?"
              : "Which Amazon Q Developer interface does this project rule apply to?"}
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

        {/* SDLC section - shown for both prompts and project rules */}
        <div className="my-4">
          <p>SDLC Activity:</p>
          <p className="text-sm text-muted-foreground">
            Which activity of the SDLC does this {props.submission} relate to?
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

        {/* Agent section - only for prompts */}
        {isPrompt && (
          <>
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
          </>
        )}

        {/* Language section - only for project rules */}
        {isProjectRule && (
          <>
            <div className="my-4">
              <p>Programming Language:</p>
              <p className="text-sm text-muted-foreground">
                Which programming language does this project rule apply to?
              </p>
            </div>
            <SelectableTags
              tags={
                props.tags
                  ?.filter((t) => t.category === "Language")
                  .map((t) => t.name) || []
              }
              selectedTags={props.selectedTags}
              onTagSelect={props.onTagSelect}
            />
          </>
        )}

        {/* Framework section - only for project rules */}
        {isProjectRule && (
          <>
            <div className="my-4">
              <p>Framework:</p>
              <p className="text-sm text-muted-foreground">
                Which framework or technology does this project rule apply to?
              </p>
            </div>
            <SelectableTags
              tags={
                props.tags
                  ?.filter((t) => t.category === "Framework")
                  .map((t) => t.name) || []
              }
              selectedTags={props.selectedTags}
              onTagSelect={props.onTagSelect}
            />
          </>
        )}

        {/* IaC section - only for project rules */}
        {isProjectRule && (
          <>
            <div className="my-4">
              <p>Infrastructure as Code:</p>
              <p className="text-sm text-muted-foreground">
                Which Infrastructure as Code tools does this project rule apply
                to?
              </p>
            </div>
            <SelectableTags
              tags={
                props.tags
                  ?.filter((t) => t.category === "IaC")
                  .map((t) => t.name) || []
              }
              selectedTags={props.selectedTags}
              onTagSelect={props.onTagSelect}
            />
          </>
        )}

        {/* Misc section - only for project rules */}
        {isProjectRule && (
          <>
            <div className="my-4">
              <p>Miscellaneous:</p>
              <p className="text-sm text-muted-foreground">
                Other relevant categories for this project rule.
              </p>
            </div>
            <SelectableTags
              tags={
                props.tags
                  ?.filter((t) => t.category === "Misc")
                  .map((t) => t.name) || []
              }
              selectedTags={props.selectedTags}
              onTagSelect={props.onTagSelect}
            />
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
