"use client";
import { modelFormSchema } from "@/lib/models/model-model";
import { Model } from "@/lib/models/model-model";
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
import { onSubmitAction, FormState } from "@/lib/actions/submit-model-action";
import { deleteModel } from "@/lib/actions/delete-model-action";
import ModelProviderCombobox from "../modelProvider/modelProvider-combobox";

interface ModelFormProps {
  model?: Model;
}

type FormSchema = z.output<typeof modelFormSchema>;

export default function ModelForm({ model }: ModelFormProps) {
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
    resolver: zodResolver(modelFormSchema),
    defaultValues: {
      id: model?.id || "",
      name: model?.name || "",
      description: model?.description || "",
      documentationURL: model?.documentationURL || "",
      providerId: model?.providerId || "",
    },
  });

  async function onDeleteModel() {
    const response = await deleteModel(model?.id as string);
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
                  What is this model doing? What is the goal?
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
                          placeholder="The name of the Model/Tool"
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
                  name="providerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        Model Provider
                      </FormLabel>
                      <FormControl>
                        <ModelProviderCombobox
                          {...field}
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      {/* Add this hidden input to ensure the value is included in form submission */}
                      <input
                        type="hidden"
                        name="providerId"
                        value={field.value || ""}
                      />
                      <FormMessage>{state.errors?.providerId}</FormMessage>
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
                          placeholder="A description of what this model or tools capabilities are?"
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
                  name="documentationURL"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        Source URL
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="The URL to the model documentation"
                          {...field}
                          className="text-white placeholder-white placeholder-opacity-50"
                        />
                      </FormControl>
                      <FormMessage>
                        {state.errors?.documentationURL}
                      </FormMessage>
                      <FormDescription>
                        The URL to the model documentation
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button type="submit" data-test-id="model_form_submit">
            {isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Model
          </Button>

          {model && model.id && (
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
                    Delete Model
                  </div>
                </AlertDialogTrigger>
              </Button>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Model?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this Model? This action
                    cannot be undone!
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onDeleteModel}
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
