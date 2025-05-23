"use client";
import {
  projectRuleFormSchema,
  ProjectRule,
} from "@/lib/models/project-rule-model";
import { ProjectRuleTag } from "@/lib/models/tags-model";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FileText, Loader2, Save, Terminal, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useActionState, useEffect } from "react";
import { onSubmitAction, FormState } from "@/lib/actions/submit-rule-action";
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
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { deleteProjectRule } from "@/lib/actions/delete-rule-action";
import SelectableTags from "@/components/forms/selectable-tag";

interface ProjectRuleFormProps {
  projectRule?: ProjectRule;
}

// Convert enum to array of strings for tag selection
function getProjectRuleTags(): string[] {
  return Object.values(ProjectRuleTag).filter(
    (value) => typeof value === "string",
  );
}

type FormSchema = z.output<typeof projectRuleFormSchema>;

export default function ProjectRuleForm({ projectRule }: ProjectRuleFormProps) {
  // Set up form action state for handling submission
  const [state, formAction, isPending] = useActionState(onSubmitAction, {
    message: "",
    success: true,
  });

  // Show toast notifications on form submission results
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

  // Initialize form with default values or existing project rule data
  const form = useForm<FormSchema>({
    resolver: zodResolver(projectRuleFormSchema),
    defaultValues: {
      id: projectRule?.id || "",
      title: projectRule?.title || "",
      description: projectRule?.description || "",
      content: projectRule?.content || "",
      tags: projectRule?.tags || [],
      sourceURL: projectRule?.sourceURL || "",
      public: projectRule?.public || false,
    },
  });

  // Handle project rule deletion
  async function onDeleteProjectRule() {
    const response = await deleteProjectRule(projectRule?.id as string);
    if (response.success === true) {
      redirect(`/rules`);
    } else {
      toast.error(response.message);
    }
  }

  // Handle tag selection
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

  // Combine error messages for display
  function combineErrors(formState: FormState): string {
    return !formState.errors
      ? ""
      : Object.values(formState.errors).flat().filter(Boolean).join(". ");
  }

  return (
    <Form {...form}>
      <form className="space-y-8" action={formAction}>
        {/* Hidden ID field for updates */}
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
                  What is this project rule for? What is its purpose?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Title field */}
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
                          placeholder="A clear and descriptive title for your project rule"
                          {...field}
                          className="text-white placeholder-white placeholder-opacity-50"
                        />
                      </FormControl>
                      <FormMessage>{state.errors?.title}</FormMessage>
                    </FormItem>
                  )}
                />
                {/* Description field */}
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
                          placeholder="What is this project rule for? What problem does it solve?"
                          {...field}
                          className="min-h-[140px] text-white placeholder-white placeholder-opacity-50"
                        />
                      </FormControl>
                      <FormMessage>{state.errors?.description}</FormMessage>
                    </FormItem>
                  )}
                />
                {/* Tags field */}
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
                                <SheetTitle>Project Rule Tags</SheetTitle>
                                <SheetDescription>
                                  <div>
                                    Select the relevant tags below to improve
                                    the discoverability of your project rule.
                                  </div>
                                  <div className="my-2">
                                    Consider things like the{" "}
                                    <span className="text-violet-500 font-semibold">
                                      programming language
                                    </span>{" "}
                                    (e.g. TypeScript, JavaScript),{" "}
                                    <span className="text-violet-500 font-semibold">
                                      frameworks
                                    </span>{" "}
                                    (e.g. React, NextJS) or{" "}
                                    <span className="text-violet-500 font-semibold">
                                      AWS services
                                    </span>{" "}
                                    (e.g. Amplify, Authentication) the rule
                                    relates to.
                                  </div>
                                </SheetDescription>
                              </SheetHeader>
                              <div className="my-4">
                                <p>Project Rule Tags:</p>
                                <p className="text-sm text-muted-foreground">
                                  Select all tags that apply to this project
                                  rule
                                </p>
                              </div>
                              <SelectableTags
                                tags={getProjectRuleTags()}
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
                {/* Source URL field */}
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
                        If this project rule was inspired by or adapted from
                        another source, provide the URL here
                      </FormDescription>
                    </FormItem>
                  )}
                />
                {/* Visibility toggle */}
                <FormField
                  control={form.control}
                  name="public"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between">
                      <div className="space-y-0.5">
                        <FormLabel>Visibility</FormLabel>
                        <FormDescription className="pr-10">
                          Keep your project rule private as a draft or just for
                          you. A private project rule can still be shared via
                          URL but will not be listed on promptz.dev. Make your
                          project rule public to share it with the community.
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
                  Rule Content
                </CardTitle>
                <CardDescription>
                  Enter the content of your project rule in markdown format
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Content field */}
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="# Your Project Rule Content in Markdown
                          
Write your project rule content here using markdown formatting. 
Include code examples, guidelines, and best practices."
                          {...field}
                          className="min-h-[500px] text-white placeholder-white placeholder-opacity-50 font-mono"
                        />
                      </FormControl>
                      <FormMessage>{state.errors?.content}</FormMessage>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Save button */}
          <Button type="submit">
            {isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Project Rule
          </Button>

          {/* Delete button (only shown for existing project rules) */}
          {projectRule && projectRule.id && (
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
                    Delete Project Rule
                  </div>
                </AlertDialogTrigger>
              </Button>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Project Rule?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this project rule? This
                    action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onDeleteProjectRule}
                    className="bg-destructive hover:bg-destructive/90 text-white"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </form>
    </Form>
  );
}
