"use client";
import { promptFormSchema } from "@/lib/models/prompt-model";
import { Prompt } from "@/lib/models/prompt-model";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  FileText,
  HelpCircle,
  Loader2,
  Save,
  Terminal,
  Trash2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useActionState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Tags from "@/components/common/tags";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { onSubmitAction, FormState } from "@/lib/actions/submit-prompt-action";
import { deletePrompt } from "@/lib/actions/delete-prompt-action";
import TagSheet from "@/components/forms/tag-sheet";
import { Tag } from "@/lib/models/tags-model";

interface PromptFormProps {
  prompt?: Prompt;
  tags: Tag[];
}

type FormSchema = z.output<typeof promptFormSchema>;

export default function PromptForm({ prompt, tags }: PromptFormProps) {
  const [state, formAction, isPending] = useActionState(onSubmitAction, {
    message: "",
    success: true,
  });

  useEffect(() => {
    if (state.success && state.message) {
      toast.success(state.message, { richColors: true });
    } else if (!state.success && state.message) {
      toast.error(state.message, {
        description: combineErrors(state),
        richColors: true,
      });
    }
  }, [state]);

  const form = useForm<FormSchema>({
    resolver: zodResolver(promptFormSchema),
    defaultValues: {
      id: prompt?.id || "",
      title: prompt?.title || "",
      description: prompt?.description || "",
      instruction: prompt?.instruction || "",
      tags: prompt?.tags || [],
      howto: prompt?.howto || "",
      sourceURL: prompt?.sourceURL || "",
      public: prompt?.public || false,
    },
  });

  async function onDeletePrompt() {
    const response = await deletePrompt(prompt?.id as string);
    if (response.success === true) {
      redirect(`/prompts`);
    } else {
      toast.error(response.message);
    }
  }

  function selectTag(tag: string) {
    const tags = form.getValues("tags") || [];
    if (tags.includes(tag)) {
      form.setValue(
        "tags",
        tags.filter((t) => t !== tag),
      );
    } else {
      form.setValue("tags", [...tags, tag]);
    }
  }

  function combineErrors(formState: FormState): string {
    return !formState.errors
      ? ""
      : Object.values(formState.errors).flat().filter(Boolean).join(". ");
  }

  return (
    <Form {...form}>
      <form className="space-y-8" action={formAction}>
        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <input type="hidden" {...field} value={field.value || ""} />
          )}
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
                      <FormMessage>{state.errors?.title}</FormMessage>
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
                      <FormMessage>{state.errors?.description}</FormMessage>
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
                          {field.field.value?.map((tag, index) => (
                            <input
                              key={index}
                              type="hidden"
                              name={`tags`}
                              value={tag}
                            />
                          ))}
                          <Tags tags={field.field.value || []}></Tags>
                          <TagSheet
                            onTagSelect={selectTag}
                            submission="prompt"
                            selectedTags={field.field.value}
                            tags={tags}
                          ></TagSheet>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sourceURL"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        Source URL
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Optional: Link to original source or inspiration"
                          {...field}
                          className="text-white placeholder-white placeholder-opacity-50"
                        />
                      </FormControl>
                      <FormMessage>{state.errors?.sourceURL}</FormMessage>
                      <FormDescription>
                        If this prompt was inspired by or adapted from another
                        source, provide the URL here
                      </FormDescription>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="public"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between">
                      <div className="space-y-0.5">
                        <FormLabel>Visibility</FormLabel>
                        <FormDescription className="pr-10">
                          Keep your prompt private as a draft or just for you. A
                          private prompt can still be shared via URL but will
                          not be listed on promptz.dev. Make your prompt public
                          to share it with the community.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <div>
                          <Switch
                            className="border-neutral-400"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                          <input
                            type="hidden"
                            name="public"
                            value={`${field.value}`}
                          />
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
                          placeholder="Write your prompt here..."
                          {...field}
                          className="min-h-[500px] text-white placeholder-white placeholder-opacity-50 font-mono"
                        />
                      </FormControl>
                      <FormMessage>{state.errors?.instruction}</FormMessage>
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
                  <FormMessage>{state.errors?.howto}</FormMessage>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex items-center gap-4">
          <Button type="submit" data-test-id="prompt_form_submit">
            {isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Prompt
          </Button>

          {prompt && prompt.id && (
            <AlertDialog>
              <Button
                type="button"
                variant="destructive"
                className="ml-auto"
                asChild
              >
                <AlertDialogTrigger>
                  <div className="flex items-center">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Prompt
                  </div>
                </AlertDialogTrigger>
              </Button>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Prompt?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this prompt? This action
                    cannot be undone and will also remove any associated drafts.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onDeletePrompt}
                    className="bg-destructive hover:bg-destructive/90 text-white"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
        <div>
          {/* {state.errors && (
            <ErrorMessage
              title={state.message}
              description={combineErrors(state)}
            />
          )} */}
        </div>
      </form>
    </Form>
  );
}
