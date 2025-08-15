"use server";
import { cookies } from "next/headers";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";
import { type Schema } from "../../amplify/data/resource";
import outputs from "../../amplify_outputs.json";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { agentFormSchema } from "@/lib/models/agent-model";

export type FormState = {
  errors?: {
    id?: string[];
    name?: string[];
    description?: string[];
    howto?: string[];
    prompt?: string[];
    tools?: string[];
    mcpServers?: string[];
    resources?: string[];
    hooks?: string[];
    toolsSettings?: string[];
    toolAliases?: string[];
    allowedTools?: string[];
    useLegacyMcpJson?: string[];
    tags?: string[];
    api?: string[];
    sourceURL?: string[];
    scope?: string[];
  };
  message?: string;
  success?: boolean;
};

const appsync = generateServerClientUsingCookies<Schema>({
  config: outputs,
  cookies,
});

export async function onSubmitAction(
  prevState: FormState,
  data: FormData,
): Promise<FormState> {
  const formData = {
    id: data.get("id") as string,
    name: data.get("name") as string,
    description: data.get("description") as string,
    prompt: data.get("prompt") as string,
    tools: data.getAll("tools") as string[],
    mcpServers: data.get("mcpServers")
      ? JSON.parse(data.get("mcpServers") as string)
      : {},
    resources: data.getAll("resources") as string[],
    hooks: data.get("hooks") ? JSON.parse(data.get("hooks") as string) : {},
    toolsSettings: data.get("toolsSettings")
      ? JSON.parse(data.get("toolsSettings") as string)
      : {},
    toolAliases: data.get("toolAliases")
      ? JSON.parse(data.get("toolAliases") as string)
      : {},
    allowedTools: data.getAll("allowedTools") as string[],
    useLegacyMcpJson: data.get("useLegacyMcpJson") === "true",
    tags: data.getAll("tags") as string[],
    scope: data.get("scope") as string,
    sourceURL: data.get("sourceURL") as string,
  };

  console.log(formData);

  const parsed = agentFormSchema.safeParse(formData);
  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: "Invalid form data",
      success: parsed.success,
    };
  }

  const payload = {
    id: parsed.data.id,
    name: parsed.data.name,
    description: parsed.data.description,
    prompt: parsed.data.prompt,
    tags: parsed.data.tags,
    scope: parsed.data.scope,
    sourceURL: parsed.data.sourceURL,
  };

  let response;
  try {
    response = await appsync.mutations.saveAgent(payload, {
      authMode: "userPool",
    });

    if (response.errors) {
      return {
        errors: {
          api: response.errors.map((e) => e.message),
        },
        message: "Error saving agent.",
        success: false,
      };
    }
  } catch (error) {
    return {
      errors: {
        api: [`Error creating agent: ${error}`],
      },
      message: "Error creating agent.",
      success: false,
    };
  }

  revalidatePath(`/agents/agent/${response.data!.slug}`);
  redirect(`/agents/agent/${response.data!.slug}`);
}
