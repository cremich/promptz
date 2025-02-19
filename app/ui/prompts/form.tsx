"use client";
import { Prompt, promptFormSchema } from "@/app/lib/definitions";
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
  Book,
  Code2,
  FileText,
  HelpCircle,
  Layers,
  Save,
  Send,
  Tag,
  Terminal,
  Trash2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import router from "next/router";
import { useActionState } from "react";
import { updatePrompt } from "@/app/lib/actions/prompts";
import { ErrorMessage } from "@/app/ui/error-message";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PromptFormProps {
  prompt?: Prompt;
}

type FormSchema = z.infer<typeof promptFormSchema>;

export default function PromptForm({ prompt }: PromptFormProps) {
  const [state, formAction] = useActionState(updatePrompt, {
    errors: {},
    message: null,
  });

  const form = useForm<FormSchema>({
    resolver: zodResolver(promptFormSchema),
    defaultValues: prompt || {
      title: "",
    },
  });

  async function onDelete() {
    if (!prompt?.id || !confirm("Are you sure you want to delete this prompt?"))
      return;
  }

  return (
    <Form {...form}>
      <form className="space-y-8" action={formAction}>
        <input
          type="hidden"
          {...form.register("id", { value: prompt?.id || "" })}
          defaultValue={prompt?.id || ""}
        />
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8">
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Basic Information
                </CardTitle>
                <CardDescription>
                  Provide the core details of your prompt.
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
                          placeholder="What is this prompt doing? What is the goal?
"
                          {...field}
                          className="min-h-[300px] text-white placeholder-white placeholder-opacity-50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
          <div className="space-y-8">
            <Card>
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
                          className="min-h-[400px] text-white placeholder-white placeholder-opacity-50"
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
        {/* <FormField
                  control={form.control}
                  name="howto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <HelpCircle className="w-4 h-4" />
                        How To Use (Optional)
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter instructions on how to use this prompt"
                          className="text-white placeholder-white placeholder-opacity-50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}

        <div className="flex items-center gap-4">
          <Button type="submit">
            <Send className="w-4 h-4 mr-2" />
            {prompt && prompt.id ? "Update Prompt" : "Create Prompt"}
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={() => console.log("save as draft")}
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
