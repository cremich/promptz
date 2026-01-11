// Content type definitions for the libraries

export interface GitInfo {
  author: string
  authorEmail: string
  createdDate: string
  lastModifiedDate: string
  commitHash: string
  commitMessage: string
}

export interface BaseContent {
  id: string
  title: string
  author: string
  date: string
  path: string
  library: string
  git?: GitInfo
}

export interface Prompt extends BaseContent {
  type: 'prompt'
  content: string
  category?: string
}

export interface Agent extends BaseContent {
  type: 'agent'
  description: string
  config: AgentConfig
  content: string
}

export interface AgentConfig {
  name?: string
  description?: string
  prompt?: string
  mcpServers?: Record<string, {
    command?: string
    args?: string[]
    url?: string
    disabled?: boolean
    autoApprove?: string[]
    env?: Record<string, string>
    [key: string]: unknown
  }>
  tools?: string[]
  toolAliases?: Record<string, string>
  allowedTools?: string[]
  resources?: string[]
  hooks?: Record<string, unknown>
  toolsSettings?: Record<string, unknown>
  useLegacyMcpJson?: boolean
  includeMcpJson?: boolean
  model?: string | null
  [key: string]: unknown
}

export interface Power extends BaseContent {
  type: 'power'
  displayName: string
  description: string
  keywords: string[]
  content: string
  mcpConfig?: Record<string, unknown>
  steeringFiles?: string[]
}

export interface SteeringDocument extends BaseContent {
  type: 'steering'
  content: string
  category?: string
}

export interface Hook extends BaseContent {
  type: 'hook'
  description: string
  content: string
  trigger?: string
  enabled?: boolean
  action?: {
    type: string
    prompt?: string
    [key: string]: unknown
  }
}

export interface Library {
  name: string
  path: string
  prompts: Prompt[]
  agents: Agent[]
  powers: Power[]
  steering: SteeringDocument[]
  hooks: Hook[]
}

export type ContentItem = Prompt | Agent | Power | SteeringDocument | Hook

// Search index types
export interface SearchIndexItem {
  id: string
  type: 'prompt' | 'agent' | 'power' | 'steering' | 'hook'
  title: string
  description: string
  content: string
  author: string
  date: string
  library: string
  path: string
  keywords?: string[]
}

export interface SearchIndex {
  items: SearchIndexItem[]
  metadata: {
    generatedAt: string
    totalItems: number
    itemsByType: Record<string, number>
  }
}