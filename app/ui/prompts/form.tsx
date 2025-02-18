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
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Title
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter a catchy title"
                  {...field}
                  className="text-white placeholder-white placeholder-opacity-50"
                />
              </FormControl>
              <FormDescription>
                A clear and descriptive title for your prompt
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
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
