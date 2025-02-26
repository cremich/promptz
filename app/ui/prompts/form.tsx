"use client";
import { Prompt, promptFormSchema } from "@/app/lib/definitions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  FileText,
  HelpCircle,
  Save,
  Send,
  Terminal,
  Trash2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import router from "next/router";
import { useActionState, useRef } from "react";
import { saveDraft, updatePrompt } from "@/app/lib/actions/prompts";
import { ErrorMessage } from "@/app/ui/error-message";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getCategoryTags,
  getQInterfaceTags,
  getSdlcTags,
} from "@/app/lib/data";
import Tags from "@/app/ui/prompts/tags";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import SelectableTags from "@/app/ui/prompts/selectable-tag";
import { toast } from "sonner";

interface PromptFormProps {
  prompt?: Prompt;
}

type FormSchema = z.output<typeof promptFormSchema>;

export default function PromptForm({ prompt }: PromptFormProps) {
  const [state, formAction] = useActionState(updatePrompt, {
    errors: {},
    message: null,
  });

  const form = useForm<FormSchema>({
    resolver: zodResolver(promptFormSchema, undefined, { raw: true }),
    defaultValues: {
      title: prompt?.title || "",
      description: prompt?.description || "",
      instruction: prompt?.instruction || "",
      tags: prompt?.tags || [],
      howto: prompt?.howto || "",
    },
  });

  async function onDelete() {
    if (!prompt?.id || !confirm("Are you sure you want to delete this prompt?"))
      return;
  }

  function selectTag(tag: string) {
    const tags = form.getValues("tags");
    if (tags.includes(tag)) {
      form.setValue(
        "tags",
        tags.filter((t) => t !== tag),
      );
    } else {
      form.setValue("tags", [...tags, tag]);
    }
  }

  const formRef = useRef<HTMLFormElement>(null);

  async function onSaveDraft() {
    const response = await saveDraft(form.getValues());
    toast(response.message);
  }

  return (
    <Form {...form}>
      <form ref={formRef} className="space-y-8" action={formAction}>
        <input
          type="hidden"
          {...form.register("id", { value: prompt?.id || "" })}
          defaultValue={prompt?.id || ""}
        />
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4">
          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Basic Information
                </CardTitle>
                <CardDescription>
                  What is this prompt doing? What is the goal?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        Title
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="A clear and descriptive title for your prompt"
                          {...field}
                          className="text-white placeholder-white placeholder-opacity-50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="What is this prompt doing? What is the goal?"
                          {...field}
                          className="min-h-[140px] text-white placeholder-white placeholder-opacity-50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tags"
                  render={(field) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        Tags
                      </FormLabel>
                      <FormControl>
                        <div className="flex flex-wrap gap-2">
                          {field.field.value.map((tag, index) => (
                            <input
                              key={index}
                              type="hidden"
                              name={`tags`}
                              value={tag}
                            />
                          ))}
                          <Tags tags={field.field.value || []}></Tags>
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
                                <SheetTitle>Prompt Tags</SheetTitle>
                                <SheetDescription>
                                  <div>
                                    Select the relevant tags below to improve
                                    the discoverability of your prompt.
                                  </div>
                                  <div className="my-2">
                                    Consider things like the{" "}
                                    <span className="text-violet-500 font-semibold">
                                      Amazon Q Developer interface
                                    </span>{" "}
                                    (e.g. IDE, CLI),{" "}
                                    <span className="text-violet-500 font-semibold">
                                      the prompt category
                                    </span>{" "}
                                    (e.g. chat, agent) or the{" "}
                                    <span className="text-violet-500 font-semibold">
                                      SDLC activity
                                    </span>{" "}
                                    (e.g. Design, Implementation) the prompt
                                    relates to.
                                  </div>
                                </SheetDescription>
                              </SheetHeader>
                              <div className="my-4">
                                <p>Amazon Q Developer Interface:</p>
                                <p className="text-sm text-muted-foreground">
                                  Is the prompt related to Amazon Q Developer in
                                  your IDE, your CLI or the AWS Management
                                  Console?
                                </p>
                              </div>
                              <SelectableTags
                                tags={getQInterfaceTags()}
                                selectedTags={field.field.value}
                                onTagSelect={selectTag}
                              />
                              <div className="my-4">
                                <p>Prompt Category:</p>
                                <p className="text-sm text-muted-foreground">
                                  Is this prompt related to Amazon Q Developer
                                  Chat, an Agent, or inline code completion?
                                </p>
                              </div>
                              <SelectableTags
                                tags={getCategoryTags()}
                                selectedTags={field.field.value}
                                onTagSelect={selectTag}
                              />
                              <div className="my-4">
                                <p>SDLC Activity:</p>
                                <p className="text-sm text-muted-foreground">
                                  Which activity of the SDLC does this prompt
                                  relate to?
                                </p>
                              </div>
                              <SelectableTags
                                tags={getSdlcTags()}
                                selectedTags={field.field.value}
                                onTagSelect={selectTag}
                              />
                            </SheetContent>
                          </Sheet>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Terminal className="w-4 h-4" />
                  Prompt
                </CardTitle>
                <CardDescription>
                  What is the prompt? What is the specific task you want Amazon
                  Q Developer to perform?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="instruction"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          className="min-h-[450px] text-white placeholder-white placeholder-opacity-50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              How-To
            </CardTitle>
            <CardDescription>
              Document relevant prerequisities or explanation that help others
              to better understand on how to use this prompt.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="howto"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      className="min-h-[200px] text-white placeholder-white placeholder-opacity-50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex items-center gap-4">
          <Button type="submit">
            <Send className="w-4 h-4 mr-2" />
            {prompt && prompt.id ? "Update Prompt" : "Create Prompt"}
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={() => onSaveDraft()}
          >
            <Save className="w-4 h-4 mr-2" />
            Save as Draft
          </Button>

          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>

          {prompt && prompt.id && (
            <Button
              type="button"
              variant="destructive"
              onClick={onDelete}
              className="ml-auto"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Prompt
            </Button>
          )}
        </div>
        <div>
          {state.message && <ErrorMessage description={state.message} />}
        </div>
      </form>
    </Form>
  );
}
