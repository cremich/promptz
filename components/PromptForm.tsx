// components/Logout.tsx

"use client";

import {
  Form,
  SpaceBetween,
  Button,
  Container,
  FormField,
  Input,
  Textarea,
  Select,
} from "@cloudscape-design/components";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import {
  PromptCategory,
  PromptViewModel,
  SdlcPhase,
} from "@/models/PromptViewModel";
import { createSelectOptions } from "@/utils/formatters";
import { useRouter } from "next/navigation";

interface PromptFormProps {
  prompt: PromptViewModel;
  onSubmit: SubmitHandler<PromptFormInputs>;
  onDelete?: (prompt: PromptViewModel) => void;
  onSaveDraft?: (formInputs: PromptFormInputs) => void;
}

export interface PromptFormInputs {
  name: string;
  description: string;
  instruction: string;
  sdlc: string;
  category: string;
  howto?: string;
}

const schema = yup
  .object({
    name: yup.string().required().min(3).max(100),
    description: yup.string().required().min(10).max(500),
    instruction: yup.string().required().min(10).max(4000),
    howto: yup.string().max(4000),
    sdlc: yup
      .string()
      .required()
      .matches(/^Plan|Requirements|Design|Implement|Test|Deploy|Maintain$/),
    category: yup
      .string()
      .required()
      .matches(/^Chat|Dev Agent|Inline$/),
  })
  .required();

const categoryOptions = createSelectOptions(PromptCategory, [
  PromptCategory.UNKNOWN,
]);
const sdlcOptions = createSelectOptions(SdlcPhase, [SdlcPhase.UNKNOWN]);

export default function PromptForm(props: PromptFormProps) {
  const {
    control,
    handleSubmit,
    getValues,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: props.prompt.name,
      description: props.prompt.description,
      instruction: props.prompt.instruction,
      sdlc: props.prompt.sdlcPhase,
      category: props.prompt.category,
      howto: props.prompt.howto,
    },
  });
  const router = useRouter();

  return (
    <form onSubmit={handleSubmit(props.onSubmit)} id="prompt-form">
      <Form
        actions={
          <SpaceBetween direction="horizontal" size="xs">
            <Button
              formAction="none"
              variant="link"
              data-testid="button-cancel"
              onClick={() => {
                reset();
                router.back();
              }}
            >
              Cancel
            </Button>
            {props.onSaveDraft && (
              <Button
                formAction="none"
                disabled={!isDirty}
                onClick={() => {
                  props.onSaveDraft!(getValues());
                  reset(getValues());
                }}
                data-testid="button-save-draft"
              >
                Save Draft
              </Button>
            )}
            <Button
              variant="primary"
              formAction="submit"
              form="prompt-form"
              loading={isSubmitting}
              data-testid="button-save"
            >
              Publish prompt
            </Button>
          </SpaceBetween>
        }
        secondaryActions={
          props.onDelete && (
            <Button
              formAction="none"
              variant="normal"
              iconName="remove"
              onClick={() => props.onDelete!(props.prompt)}
              data-testid="button-delete"
            >
              Delete prompt
            </Button>
          )
        }
      >
        <Container>
          <SpaceBetween direction="vertical" size="l">
            <FormField
              data-testid="formfield-name"
              stretch
              description="A catchy name for your prompt."
              label="Name"
              errorText={errors.name?.message}
            >
              <Controller
                name="name"
                control={control}
                rules={{ required: true, minLength: 3, maxLength: 100 }}
                render={({ field }) => (
                  <Input
                    {...field}
                    data-testid="input-name"
                    value={field.value}
                    spellcheck={false}
                    autoComplete="off"
                    onChange={({ detail }) => field.onChange(detail.value)}
                  />
                )}
              />
            </FormField>
            <FormField
              data-testid="formfield-description"
              stretch
              description="What is this prompt doing? What is the goal?"
              label="Description"
              errorText={errors.description?.message}
            >
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    data-testid="input-description"
                    value={field.value}
                    onChange={({ detail }) => field.onChange(detail.value)}
                  />
                )}
              />
            </FormField>
            <FormField
              data-testid="formfield-sdlc"
              label="Software Development Lifecycle (SDLC) Phase"
              description="Which phase of the SDLC does this prompt relate to?"
              stretch
              errorText={errors.sdlc?.message}
            >
              <Controller
                name="sdlc"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    data-testid="select-sdlc"
                    selectedOption={
                      sdlcOptions.find((opt) => opt.value === field.value)!
                    }
                    onChange={({ detail }) =>
                      field.onChange(detail.selectedOption?.value)
                    }
                    options={sdlcOptions}
                  />
                )}
              />
            </FormField>
            <FormField
              data-testid="formfield-category"
              label="Prompt Category"
              description="Is this prompt related to Amazon Q Developer Chat, Dev Agent, or inline code completion?"
              stretch
              errorText={errors.category?.message}
            >
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    data-testid="select-category"
                    selectedOption={
                      categoryOptions.find((opt) => opt.value === field.value)!
                    }
                    onChange={({ detail }) =>
                      field.onChange(detail.selectedOption?.value)
                    }
                    options={categoryOptions}
                  />
                )}
              />
            </FormField>
            <FormField
              data-testid="formfield-howto"
              label={
                <span>
                  How-To <i>- optional</i>
                </span>
              }
              description="Document relevant prerequisities or explanation that help others to better understand on how to use this prompt."
              stretch
              errorText={errors.howto?.message}
            >
              <Controller
                name="howto"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    data-testid="textarea-howto"
                    rows={3}
                    value={field.value || ""}
                    onChange={({ detail }) => field.onChange(detail.value)}
                  />
                )}
              />
            </FormField>
            <FormField
              data-testid="formfield-instruction"
              label="Instruction"
              description="The specific task you want Amazon Q Developer to perform."
              stretch
              errorText={errors.instruction?.message}
            >
              <Controller
                name="instruction"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    data-testid="textarea-instruction"
                    rows={10}
                    value={field.value}
                    onChange={({ detail }) => field.onChange(detail.value)}
                  />
                )}
              />
            </FormField>
          </SpaceBetween>
        </Container>
      </Form>
    </form>
  );
}
