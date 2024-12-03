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
  Tiles,
  Grid,
  Box,
} from "@cloudscape-design/components";
import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import {
  PromptViewModel,
  QInterface,
  SdlcActivity,
} from "@/models/PromptViewModel";
import {
  createSelectOptions,
  createTilesItems,
  switchCategories,
} from "@/utils/formatters";
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
  interface?: string;
  instruction: string;
  sdlc?: string;
  category?: string;
  howto?: string;
}

type Interface = "IDE" | "CLI" | "Management Console";

type ContextModifier = {
  id: string;
  label: string;
  value: string;
  applicableInterfaces: Interface[];
};

const schema = yup
  .object({
    name: yup.string().required().min(3).max(100),
    description: yup.string().required().min(10).max(500),
    instruction: yup.string().required().min(10).max(4000),
    howto: yup.string().max(4000),
    interface: yup
      .string()
      .required()
      .matches(/^IDE|CLI|Management Console$/),
    sdlc: yup
      .string()
      .matches(
        /^Debugging|Deploy|Design|Documentation|Enhance|Implement|Operate|Optimize|Patch Management|Plan|Refactoring|Requirements|Security|Support|Test|Unknown$/,
      ),
    category: yup
      .string()
      .required()
      .matches(
        /^Chat|Dev Agent|Inline|Translate|Transform Agent|Test Agent|Doc Agent|Review Agent$/,
      ),
  })
  .required();

const sdlcOptions = createSelectOptions(SdlcActivity, [SdlcActivity.UNKNOWN]);
const interfaceTiles = createTilesItems(QInterface, [QInterface.UNKNOWN]);

const contextModifiers: ContextModifier[] = [
  {
    id: "workspace",
    label: "@workspace",
    value: "@workspace",
    applicableInterfaces: ["IDE"],
  },
  { id: "git", label: "@git", value: "@git", applicableInterfaces: ["CLI"] },
  { id: "env", label: "@env", value: "@env", applicableInterfaces: ["CLI"] },
  {
    id: "history",
    label: "@history",
    value: "@history",
    applicableInterfaces: ["CLI"],
  },
];

export default function PromptForm(props: PromptFormProps) {
  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: props.prompt.name,
      description: props.prompt.description,
      interface: props.prompt.interface,
      instruction: props.prompt.instruction,
      sdlc: props.prompt.sdlcPhase,
      category: props.prompt.category,
      howto: props.prompt.howto,
    },
  });
  const router = useRouter();

  const qInterface = useWatch({ control, name: "interface" });
  const categoryOptions = switchCategories(qInterface as QInterface);

  const handleContextModifierClick = (value: string) => {
    const currentValue = getValues("instruction") || "";
    setValue("instruction", currentValue + ` ${value}`);
  };

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
        <Grid gridDefinition={[{ colspan: 4 }, { colspan: 8 }]}>
          <div>
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
                  data-testid="formfield-interface"
                  label="Amazon Q Developer Interface"
                  description="Is the prompt related to Amazon Q Developer in your IDE, your CLI or the AWS Management Console?"
                  stretch
                  errorText={errors.interface?.message}
                >
                  <Controller
                    name="interface"
                    control={control}
                    render={({ field }) => (
                      <Tiles
                        {...field}
                        data-testid="tiles-interface"
                        value={
                          interfaceTiles.find(
                            (opt) => opt.value === field.value,
                          )?.value || ""
                        }
                        onChange={({ detail }) => field.onChange(detail.value)}
                        items={interfaceTiles}
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
                          categoryOptions.find(
                            (opt) => opt.value === field.value,
                          )!
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
                  data-testid="formfield-sdlc"
                  label={
                    <span>
                      Software Development Lifecycle (SDLC) Activity{" "}
                      <i>- optional</i>
                    </span>
                  }
                  description="Which activity of the SDLC does this prompt relate to?"
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
                        filteringType="auto"
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
              </SpaceBetween>
            </Container>
          </div>
          <div>
            <SpaceBetween direction="vertical" size="l">
              <Container>
                <FormField
                  data-testid="formfield-instruction"
                  label="Prompt"
                  description="What is the prompt? What is the specific task you want Amazon Q Developer to perform?"
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
                        rows={15}
                        value={field.value}
                        onChange={({ detail }) => field.onChange(detail.value)}
                      />
                    )}
                  />
                </FormField>
                <Box margin={{ top: "m" }}>
                  <Box variant="strong" display="block">
                    Context Modifier
                  </Box>
                  <Box
                    variant="small"
                    color="text-body-secondary"
                    display="inline"
                  >
                    Use the supported context modifier shortcut buttons to add
                    them to your prompt.
                  </Box>
                  <Box margin={{ top: "m" }}>
                    <SpaceBetween direction="horizontal" size="xs">
                      {contextModifiers.map(
                        ({ id, label, value, applicableInterfaces }) => (
                          <Button
                            key={id}
                            formAction="none"
                            variant="normal"
                            data-testid={`button-ctxmod-${id}`}
                            disabled={
                              !applicableInterfaces.includes(
                                qInterface as Interface,
                              )
                            }
                            onClick={() => handleContextModifierClick(value)}
                          >
                            {label}
                          </Button>
                        ),
                      )}
                    </SpaceBetween>
                  </Box>
                </Box>
              </Container>
              <Container>
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
              </Container>
            </SpaceBetween>
          </div>
        </Grid>
      </Form>
    </form>
  );
}
