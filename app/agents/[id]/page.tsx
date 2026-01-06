import { Suspense } from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ContentHeader } from '@/components/content-header'
import { ContributorInfo } from '@/components/contributor-info'
import { DetailLayout, DetailSkeleton } from '@/components/detail-layout'
import { getAllAgents, getAgentById } from '@/lib/agents'
import { idToSlug, slugToId, isValidSlug } from '@/lib/formatter/slug'
import { getLibraryName } from '@/lib/library'
import { getDisplayAuthor } from '@/lib/formatter/content'

interface AgentDetailPageProps {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  try {
    const agents = await getAllAgents()
    return agents.map((agent) => ({
      id: idToSlug(agent.id),
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

export async function generateMetadata({
  params,
}: AgentDetailPageProps): Promise<Metadata> {
  const { id: slug } = await params

  if (!isValidSlug(slug)) {
    return {
      title: 'Invalid Agent URL | Promptz.dev',
      description: 'The requested agent URL is not valid.',
    }
  }

  const id = slugToId(slug)
  const agent = await getAgentById(id)

  if (!agent) {
    return {
      title: 'Agent Not Found | Promptz.dev',
      description: 'The requested agent could not be found.',
    }
  }

  const libraryName = getLibraryName(agent.path)
  const author = getDisplayAuthor(agent)

  return {
    title: `${agent.title} | Promptz.dev`,
    description: `Custom AI agent by ${author} from ${libraryName} library. ${agent.description}`,
    keywords: [
      'AI agent',
      'custom agent',
      'AI assistant',
      'automation',
      'development workflow',
      libraryName,
      author,
      'Kiro',
      'Amazon Q Developer',
      ...(agent.config.mcpServers ? Object.keys(agent.config.mcpServers) : []),
      ...(Array.isArray(agent.config.tools) ? agent.config.tools : []),
    ],
    authors: [{ name: author }],
    openGraph: {
      title: `${agent.title} | Promptz.dev`,
      description: `Custom AI agent by ${author} from ${libraryName} library. ${agent.description}`,
      type: 'article',
      authors: [author],
      publishedTime: agent.git?.createdDate || agent.date,
      modifiedTime: agent.git?.lastModifiedDate,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${agent.title} | Promptz.dev`,
      description: `Custom AI agent by ${author} from ${libraryName} library. ${agent.description}`,
    },
  }
}

async function AgentDetail({ slug }: { slug: string }) {
  if (!isValidSlug(slug)) {
    notFound()
  }

  const id = slugToId(slug)
  const agent = await getAgentById(id)

  if (!agent) {
    notFound()
  }

  return (
    <DetailLayout backHref="/agents" backLabel="Back to Agents">
      {/* Header */}
      <ContentHeader content={agent} />

      {/* Contributor Information */}
      <ContributorInfo content={agent} />

      {/* Agent Configuration and Content */}
      <Card className="border-border/40 bg-card/50">
        <CardHeader>
          <CardTitle className="text-xl">Agent Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="configuration" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="configuration">Configuration</TabsTrigger>
              <TabsTrigger value="prompt">Prompt</TabsTrigger>
            </TabsList>

            <TabsContent value="configuration" className="mt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="mb-3 text-sm font-medium text-muted-foreground">
                    Agent Configuration
                  </h3>
                  <pre className="overflow-x-auto rounded-lg border border-border/40 bg-muted/50 p-4 text-sm font-mono">
                    {JSON.stringify(agent.config, null, 2)}
                  </pre>
                </div>

                {agent.config.mcpServers &&
                  Object.keys(agent.config.mcpServers).length > 0 && (
                    <div>
                      <h3 className="mb-3 text-sm font-medium text-muted-foreground">
                        MCP Servers
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {Object.keys(agent.config.mcpServers).map((serverName) => (
                          <Badge
                            key={serverName}
                            variant="secondary"
                            className="text-xs"
                          >
                            {serverName}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                {Array.isArray(agent.config.tools) &&
                  agent.config.tools.length > 0 && (
                    <div>
                      <h3 className="mb-3 text-sm font-medium text-muted-foreground">
                        Tools
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {agent.config.tools.map((tool, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {tool}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                {agent.config.toolAliases &&
                  Object.keys(agent.config.toolAliases).length > 0 && (
                    <div>
                      <h3 className="mb-3 text-sm font-medium text-muted-foreground">
                        Tool Aliases
                      </h3>
                      <div className="space-y-2">
                        {Object.entries(agent.config.toolAliases).map(([tool, alias]) => (
                          <div key={tool} className="flex items-center gap-2 text-sm">
                            <Badge variant="outline" className="text-xs">
                              {tool}
                            </Badge>
                            <span className="text-muted-foreground">→</span>
                            <Badge variant="secondary" className="text-xs">
                              {alias}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {Array.isArray(agent.config.resources) &&
                  agent.config.resources.length > 0 && (
                    <div>
                      <h3 className="mb-3 text-sm font-medium text-muted-foreground">
                        Resources
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {agent.config.resources.map((resource, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {resource}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </TabsContent>

            <TabsContent value="prompt" className="mt-6">
              <div>
                <h3 className="mb-3 text-sm font-medium text-muted-foreground">
                  Agent Prompt
                </h3>
                <pre className="whitespace-pre-wrap overflow-x-auto rounded-lg border border-border/40 bg-muted/50 p-4 text-sm font-mono">
                  {agent.content}
                </pre>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </DetailLayout>
  )
}

export default async function AgentDetailPage({
  params,
}: AgentDetailPageProps) {
  const { id: slug } = await params

  return (
    <Suspense fallback={<DetailSkeleton />}>
      <AgentDetail slug={slug} />
    </Suspense>
  )
}
