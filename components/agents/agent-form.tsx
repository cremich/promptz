"use client";
import { agentFormSchema } from "@/lib/models/agent-model";
import { Agent } from "@/lib/models/agent-model";
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
  Bot,
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
import { onSubmitAction, FormState } from "@/lib/actions/submit-agent-action";
import { deleteAgent } from "@/lib/actions/delete-agent-action";
import TagSheet from "@/components/forms/tag-sheet";
import { Tag } from "@/lib/models/tags-model";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AgentFormProps {
  agent?: Agent;
  tags: Tag[];
}

type FormSchema = z.output<typeof agentFormSchema>;

export default function AgentForm({ agent, tags }: AgentFormProps) {
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
    resolver: zodResolver(agentFormSchema),
    defaultValues: {
      ...agent,
    },
  });

  async function onDeleteAgent() {
    const response = await deleteAgent(agent?.id as string);
    if (response.success === true) {
      redirect(`/agents`);
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

        {/* Basic Information Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Basic Information
            </CardTitle>
            <CardDescription>
              What is this agent doing? What is the goal and purpose of this
              Amazon Q Developer CLI agent?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    Agent Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="A clear and descriptive name for your agent"
                      {...field}
                      className="text-white placeholder-white placeholder-opacity-50"
                    />
                  </FormControl>
                  <FormMessage>{state.errors?.name}</FormMessage>
                  <FormDescription>
                    Choose a name that clearly describes what your agent does
                    (e.g., "Frontend Developer", "DevOps Assistant")
                  </FormDescription>
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
                      placeholder="What is this agent doing? What is the goal and purpose?"
                      {...field}
                      className="min-h-[140px] text-white placeholder-white placeholder-opacity-50"
                    />
                  </FormControl>
                  <FormMessage>{state.errors?.description}</FormMessage>
                  <FormDescription>
                    Provide a detailed description of what your agent does and
                    how it helps with development tasks
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Bot className="w-4 h-4" />
                    System Prompt
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Define the agent's behavior, personality, and instructions..."
                      {...field}
                      className="min-h-[200px] text-white placeholder-white placeholder-opacity-50 font-mono"
                    />
                  </FormControl>
                  <FormMessage>{state.errors?.prompt}</FormMessage>
                  <FormDescription>
                    The system prompt defines how your agent behaves and
                    responds. Be specific about the agent's role, expertise, and
                    communication style.
                  </FormDescription>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Metadata Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              Metadata & Settings
            </CardTitle>
            <CardDescription>
              Configure tags, visibility, and additional information for your
              agent
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
                        submission="agent"
                        selectedTags={field.field.value}
                        tags={tags}
                      ></TagSheet>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Add relevant tags to help others discover your agent (e.g.,
                    "frontend", "testing", "deployment")
                  </FormDescription>
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
                    If this agent was inspired by or adapted from another
                    source, provide the URL here
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="scope"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel>Visibility</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-black">
                          <SelectValue placeholder="Select a privacy scope for your agent" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PRIVATE">Private</SelectItem>
                        <SelectItem value="PUBLIC">Public</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Keep your agent private as a draft or just for you or make
                      it public to share it with the community. A private agent
                      can still be shared via URL but will not be listed on
                      promptz.dev.
                    </FormDescription>
                    <input
                      type="hidden"
                      name="scope"
                      value={`${field.value}`}
                    />
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex items-center gap-4">
          <Button type="submit" data-test-id="agent_form_submit">
            {isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Agent
          </Button>

          {agent && agent.id && (
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
                    Delete Agent
                  </div>
                </AlertDialogTrigger>
              </Button>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Agent?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this agent? This action
                    cannot be undone and will also remove any associated drafts.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onDeleteAgent}
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
