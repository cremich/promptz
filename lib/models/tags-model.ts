// TypeScript interfaces for tag-related data structures
export type Tag = {
  name: string;
  description?: string;
  category?: string;
  promptCount?: number;
  ruleCount?: number;
  agentCount?: number;
  createdAt?: string;
  updatedAt?: string;
};
