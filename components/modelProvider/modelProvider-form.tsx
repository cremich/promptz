"use client";
import { modelProviderFormSchema } from "@/lib/models/modelProvider-model";
import { ModelProvider } from "@/lib/models/modelProvider-model";
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
import {
  getCategoryTags,
  getToolInterfaceTags,
  getSdlcTags,
} from "@/lib/models/tags-model";
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
import SelectableTags from "@/components/forms/selectable-tag";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import {
  onSubmitAction,
  FormState,
} from "@/lib/actions/submit-modelProvider-action";
import { deleteModelProvider } from "@/lib/actions/delete-modelProvider-action";

interface ModelProviderFormProps {
  modelProvider?: ModelProvider;
}

type FormSchema = z.output<typeof modelProviderFormSchema>;

export default function ModelProviderForm({
  modelProvider,
}: ModelProviderFormProps) {
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
    resolver: zodResolver(modelProviderFormSchema),
    defaultValues: {
      id: modelProvider?.id || "",
      name: modelProvider?.name || "",
      description: modelProvider?.description || "",
      website: modelProvider?.website || "",
    },
  });

  async function onDeleteModelProvider() {
    const response = await deleteModelProvider(modelProvider?.id as string);
    if (response.success === true) {
      redirect(`/`);
    } else {
      toast.error(response.message);
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
                  What is this modelProvider doing? What is the goal?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        Title
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="The name of the Model Provider"
                          {...field}
                          className="text-white placeholder-white placeholder-opacity-50"
                        />
                      </FormControl>
                      <FormMessage>{state.errors?.name}</FormMessage>
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
                          placeholder="An overview of the company that's providing models. What's their niche, what are they doing?"
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
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        Source URL
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="The companies website"
                          {...field}
                          className="text-white placeholder-white placeholder-opacity-50"
                        />
                      </FormControl>
                      <FormMessage>{state.errors?.website}</FormMessage>
                      <FormDescription>The companies website</FormDescription>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button type="submit" data-test-id="modelProvider_form_submit">
            {isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Model Provider
          </Button>

          {modelProvider && modelProvider.id && (
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
                    Delete Model Provider
                  </div>
                </AlertDialogTrigger>
              </Button>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Model Provider?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this Model Provider? This
                    action cannot be undone!
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onDeleteModelProvider}
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
