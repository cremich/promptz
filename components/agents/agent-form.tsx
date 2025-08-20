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
  Settings,
  Server,
  Zap,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useActionState, useEffect, useState } from "react";
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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
import { Switch } from "@/components/ui/switch";
import { ToolsMultiSelect } from "@/components/forms/tools-multi-select";
import { ToolAliasesManager } from "@/components/forms/tool-aliases-manager";
import { McpServersManager } from "@/components/forms/mcp-servers-manager";
import { ResourcesManager } from "@/components/forms/resources-manager";
import { HooksManager } from "@/components/forms/hooks-manager";

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

  // State for collapsible sections (closed by default)
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isMcpServersOpen, setIsMcpServersOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [isHooksOpen, setIsHooksOpen] = useState(false);

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
      <form className="space-y-8" action={formAction} data-testid="agent-form">
        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <input type="hidden" {...field} value={field.value || ""} />
          )}
        />

        {/* Hidden inputs for all collapsible sections - always present in DOM */}
        <FormField
          control={form.control}
          name="tools"
          render={({ field }) => (
            <div>
              {field.value?.map((tool, index) => (
                <input key={index} type="hidden" name="tools" value={tool} />
              ))}
            </div>
          )}
        />

        <FormField
          control={form.control}
          name="toolAliases"
          render={({ field }) => (
            <input
              type="hidden"
              name="toolAliases"
              value={JSON.stringify(field.value || {})}
            />
          )}
        />

        <FormField
          control={form.control}
          name="allowedTools"
          render={({ field }) => (
            <div>
              {field.value?.map((tool, index) => (
                <input
                  key={index}
                  type="hidden"
                  name="allowedTools"
                  value={tool}
                />
              ))}
            </div>
          )}
        />

        <FormField
          control={form.control}
          name="useLegacyMcpJson"
          render={({ field }) => (
            <input
              type="hidden"
              name="useLegacyMcpJson"
              value={field.value ? "true" : "false"}
            />
          )}
        />

        <FormField
          control={form.control}
          name="mcpServers"
          render={({ field }) => (
            <input
              type="hidden"
              name="mcpServers"
              value={JSON.stringify(field.value || {})}
            />
          )}
        />

        <FormField
          control={form.control}
          name="resources"
          render={({ field }) => (
            <div>
              {field.value?.map((resource, index) => (
                <input
                  key={index}
                  type="hidden"
                  name="resources"
                  value={resource}
                />
              ))}
            </div>
          )}
        />

        <FormField
          control={form.control}
          name="hooks"
          render={({ field }) => (
            <input
              type="hidden"
              name="hooks"
              value={JSON.stringify(field.value || {})}
            />
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={(field) => (
            <div>
              {field.field.value?.map((tag, index) => (
                <input key={index} type="hidden" name={`tags`} value={tag} />
              ))}
            </div>
          )}
        />

        <FormField
          control={form.control}
          name="scope"
          render={({ field }) => (
            <input type="hidden" name="scope" value={`${field.value}`} />
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
                    (e.g., &ldquo;Frontend Developer&rdquo;, &ldquo;DevOps
                    Assistant&rdquo;)
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
                    responds. Be specific about the agent&apos;s role,
                    expertise, and communication style.
                  </FormDescription>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Tools Configuration Section */}
        <Collapsible open={isToolsOpen} onOpenChange={setIsToolsOpen}>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-800/50 transition-colors">
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Tools Configuration
                  {isToolsOpen ? (
                    <ChevronDown className="w-4 h-4 ml-auto" />
                  ) : (
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  )}
                </CardTitle>
                <CardDescription>
                  Configure which tools your agent can use and how they are
                  accessed
                </CardDescription>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="tools"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Terminal className="w-4 h-4" />
                        Available Tools
                      </FormLabel>
                      <FormControl>
                        <div>
                          <ToolsMultiSelect
                            value={field.value || []}
                            onChange={field.onChange}
                            placeholder="Select tools your agent can use..."
                          />
                        </div>
                      </FormControl>
                      <FormMessage>{state.errors?.tools}</FormMessage>
                      <FormDescription>
                        Select the tools that your agent is allowed to use.
                        These tools will be available for the agent to call
                        during conversations.
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="toolAliases"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tool Aliases</FormLabel>
                      <FormControl>
                        <div>
                          <ToolAliasesManager
                            value={field.value || {}}
                            onChange={field.onChange}
                          />
                        </div>
                      </FormControl>
                      <FormMessage>{state.errors?.toolAliases}</FormMessage>
                      <FormDescription>
                        Create shortcuts for tools by defining aliases. For
                        example, you can alias &ldquo;read&rdquo; to
                        &ldquo;fs_read&rdquo; for easier use.
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="allowedTools"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Allowed Tools (Restriction)</FormLabel>
                      <FormControl>
                        <div>
                          <ToolsMultiSelect
                            value={field.value || []}
                            onChange={field.onChange}
                            placeholder="Optionally restrict to specific tools..."
                          />
                        </div>
                      </FormControl>
                      <FormMessage>{state.errors?.allowedTools}</FormMessage>
                      <FormDescription>
                        Optional: Restrict the agent to only use these specific
                        tools. If empty, all configured tools are allowed.
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="useLegacyMcpJson"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-700 p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Legacy MCP JSON Support
                        </FormLabel>
                        <FormDescription>
                          Enable support for legacy MCP JSON format. Only enable
                          this if you need compatibility with older MCP servers.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <div>
                          <Switch
                            checked={field.value || false}
                            onCheckedChange={field.onChange}
                            className="border-gray-700"
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* MCP Servers Configuration Section */}
        <Collapsible open={isMcpServersOpen} onOpenChange={setIsMcpServersOpen}>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-800/50 transition-colors">
                <CardTitle className="flex items-center gap-2">
                  <Server className="w-4 h-4" />
                  MCP Servers Configuration
                  {isMcpServersOpen ? (
                    <ChevronDown className="w-4 h-4 ml-auto" />
                  ) : (
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  )}
                </CardTitle>
                <CardDescription>
                  Configure Model Context Protocol (MCP) servers to extend your
                  agent&apos;s capabilities with external data sources and tools
                </CardDescription>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="mcpServers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>MCP Servers</FormLabel>
                      <FormControl>
                        <McpServersManager
                          value={field.value || {}}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage>{state.errors?.mcpServers}</FormMessage>
                      <FormDescription>
                        MCP servers provide your agent with access to external
                        tools and data sources. Each server runs as a separate
                        process and communicates with your agent through the
                        Model Context Protocol.
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* File Resources Section */}
        <Collapsible open={isResourcesOpen} onOpenChange={setIsResourcesOpen}>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-800/50 transition-colors">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  File Resources
                  {isResourcesOpen ? (
                    <ChevronDown className="w-4 h-4 ml-auto" />
                  ) : (
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  )}
                </CardTitle>
                <CardDescription>
                  Configure file resources your agent can access for context and
                  functionality
                </CardDescription>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="resources"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>File Resources</FormLabel>
                      <FormControl>
                        <ResourcesManager
                          value={field.value || []}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage>{state.errors?.resources}</FormMessage>
                      <FormDescription>
                        Specify file paths that your agent should have access
                        to. These can be configuration files, documentation, or
                        any other resources your agent needs to function
                        effectively.
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Lifecycle Hooks Section */}
        <Collapsible open={isHooksOpen} onOpenChange={setIsHooksOpen}>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-800/50 transition-colors">
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Lifecycle Hooks
                  {isHooksOpen ? (
                    <ChevronDown className="w-4 h-4 ml-auto" />
                  ) : (
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  )}
                </CardTitle>
                <CardDescription>
                  Configure commands to run at specific points in your
                  agent&apos;s lifecycle
                </CardDescription>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="hooks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lifecycle Hooks</FormLabel>
                      <FormControl>
                        <HooksManager
                          value={field.value || {}}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage>{state.errors?.hooks}</FormMessage>
                      <FormDescription>
                        Configure commands to run at specific points in your
                        agent&apos;s lifecycle. Use agentSpawn for
                        initialization tasks and userPromptSubmit for
                        pre-processing user inputs.
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

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
                    &ldquo;frontend&rdquo;, &ldquo;testing&rdquo;,
                    &ldquo;deployment&rdquo;)
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
