/**
 * Prompt Engineering Category Taxonomy & Classification Map
 *
 * Categories are based on industry-recognized prompt engineering techniques
 * sourced from AWS Bedrock documentation, academic literature, and
 * practitioner guides (ByteByteGo, Salesforce, etc.).
 *
 * Taxonomy:
 *   zero-shot           — Direct instruction with no examples
 *   one-shot            — Single example input/output pair provided
 *   few-shot            — Includes multiple example input/output pairs
 *   chain-of-thought    — Step-by-step reasoning process
 *   persona             — Assigns a role, identity, or expertise
 *   template            — Fill-in-the-blank structure with variables/placeholders
 *   structured-output   — Specifies output format (JSON, tables, diagrams, etc.)
 *   decomposition       — Breaks complex tasks into ordered subtasks
 *   multi-turn          — Iterative dialogue / conversational flow
 *   react               — Reasoning + Acting with tool use
 *   agentic             — Multi-agent coordination / orchestration
 *   constraint-based    — Defines explicit rules, boundaries, or guardrails
 *   code-generation     — Primary output is executable code
 *   creative            — Open-ended content generation (titles, text, stories)
 *   instruction-based   — Direct task instruction without examples or reasoning
 */

export const PROMPT_CATEGORIES: Record<string, string> = {
  // ── product-teams library ──────────────────────────────────────────
  'product-teams/prompts/ai-framing-agent':
    'persona, structured-output, decomposition, agentic',
  'product-teams/prompts/claudecodeworkflow':
    'decomposition, agentic, multi-turn, constraint-based',
  'product-teams/prompts/document-summarizer':
    'template, structured-output, instruction-based',
  'product-teams/prompts/handoff-schema':
    'template, structured-output',
  'product-teams/prompts/market-research-agent':
    'persona, react, decomposition, structured-output',
  'product-teams/prompts/orchestrator':
    'agentic, decomposition, constraint-based',
  'product-teams/prompts/shared-standards':
    'constraint-based, template',
  'product-teams/prompts/llm-workflow-checklist':
    'decomposition, agentic, multi-turn',
  'product-teams/prompts/prd-creation-guide':
    'persona, structured-output, decomposition, agentic',
  'product-teams/prompts/prfaq-guide':
    'persona, structured-output, decomposition, agentic',
  'product-teams/prompts/prototype-creation-guide':
    'persona, decomposition, constraint-based, code-generation',

  // ── promptz library ────────────────────────────────────────────────
  'promptz/prompts/steering-file-creator':
    'react, instruction-based, constraint-based',
  'promptz/prompts/steering-optimizer':
    'multi-turn, instruction-based, constraint-based',
  'promptz/prompts/security-review':
    'persona, constraint-based',
  'promptz/prompts/amazon-q-project-learning':
    'instruction-based',
  'promptz/prompts/create-user-personas':
    'persona, structured-output, few-shot',
  'promptz/prompts/independent-thought-challenger':
    'persona, constraint-based',
  'promptz/prompts/professional-speaking-coach-feedback-generator':
    'persona, multi-turn, structured-output',
  'promptz/prompts/well-architected-review':
    'persona, decomposition, react',
  'promptz/prompts/prompt-to-send-q-cli-chat-to-do-research-on-recent-libraries-for-you':
    'react, decomposition, instruction-based',
  'promptz/prompts/github-pull-requests':
    'decomposition, instruction-based',
  'promptz/prompts/cost-calculation':
    'persona, multi-turn, decomposition',
  'promptz/prompts/create-a-project-diagram-for-your-project':
    'instruction-based, structured-output',
  'promptz/prompts/create-project-c4-model':
    'instruction-based, structured-output',
  'promptz/prompts/project-intelligence':
    'persona, decomposition, structured-output',
  'promptz/prompts/unit-test-generation':
    'instruction-based, structured-output',
  'promptz/prompts/specifications-for-development-tasks':
    'persona, multi-turn, decomposition',
  'promptz/prompts/copy-data-from-dynamodb-across-accounts':
    'instruction-based, code-generation, constraint-based',
  'promptz/prompts/parameterize-like-a-pro-generating-junit-5-tests':
    'instruction-based, structured-output, constraint-based, code-generation',
  'promptz/prompts/read-cline-memory-bank':
    'instruction-based',
  'promptz/prompts/generate-cdk-lambda-code-from-drawio-diagram':
    'instruction-based, code-generation',
  'promptz/prompts/implementation-plan':
    'persona, decomposition, structured-output',
  'promptz/prompts/identifying-metricsalarms-related-to-aws-resources':
    'template, decomposition, chain-of-thought',
  'promptz/prompts/identifying-metricsalarms-related-to-service-health':
    'template, decomposition, chain-of-thought',
  'promptz/prompts/analyze-bash-history':
    'zero-shot, instruction-based',
  'promptz/prompts/react-component-documentation':
    'instruction-based, structured-output, constraint-based',
  'promptz/prompts/setup-shell-from-zshrc':
    'zero-shot, instruction-based',
  'promptz/prompts/conventional-commit-messages':
    'zero-shot, instruction-based',
  'promptz/prompts/java-heap-dump-analysis':
    'instruction-based, structured-output',
  'promptz/prompts/automated-code-review':
    'decomposition, constraint-based',
  'promptz/prompts/draw-like-a-pro-sequence-diagrams-for-a-system-flow':
    'template, structured-output, constraint-based',
  'promptz/prompts/refactor-like-a-pro-improve-your-java17-code':
    'instruction-based, constraint-based',
  'promptz/prompts/parameterize-like-a-pro-supercharge-your-junit-5-tests':
    'instruction-based, code-generation',
  'promptz/prompts/test':
    'instruction-based, decomposition',
  'promptz/prompts/python-lambda-layer-generator':
    'instruction-based, code-generation, few-shot',
  'promptz/prompts/qr-code-to-url':
    'instruction-based, code-generation, constraint-based',
  'promptz/prompts/requirement-to-issue-stepfunction':
    'multi-turn, code-generation, decomposition',
  'promptz/prompts/tdd-fishing-game-prompt':
    'decomposition, code-generation, multi-turn',
  'promptz/prompts/create-eks-cluster-using-aws-and-terraform-best-practices':
    'instruction-based, code-generation, constraint-based',
  'promptz/prompts/solution-design':
    'persona, multi-turn, decomposition',
  'promptz/prompts/generate-rest-api-fixtures-for-cypress-testing':
    'template, few-shot, code-generation',
  'promptz/prompts/generate-ui-functional-test-using-cypress-for-a-specific-page':
    'template, code-generation, instruction-based',
  'promptz/prompts/cdk-snapshot-tests-for-typescript-and-jest':
    'instruction-based, code-generation, constraint-based',
  'promptz/prompts/cdk-unit-tests-for-typescript-and-jest':
    'instruction-based, code-generation, constraint-based',
  'promptz/prompts/adits-prompt-for-generating-titles':
    'zero-shot, creative',
  'promptz/prompts/pythonexpert-diy-profile-prompt':
    'persona, constraint-based',
  'promptz/prompts/frontend-engineer':
    'persona, constraint-based, structured-output',
  'promptz/prompts/adr-creation':
    'template, structured-output',
  'promptz/prompts/git-commit-message':
    'zero-shot, instruction-based',
  'promptz/prompts/boostrap-flask-app-in-dev':
    'instruction-based, code-generation, template',
  'promptz/prompts/build-a-ui-for-a-votingapp':
    'instruction-based, code-generation, constraint-based',
  'promptz/prompts/document-codeblock':
    'zero-shot, instruction-based',
  'promptz/prompts/github-actions-pull-request-workflow':
    'template, code-generation, constraint-based',
  'promptz/prompts/senior-react-engineer':
    'persona, multi-turn',
  'promptz/prompts/generate-well-architected-recommendations-on-my-drawio-diagram':
    'zero-shot, instruction-based',
  'promptz/prompts/aws-architecture-blueprint-for-an-api-gateway-to-sqs-pattern':
    'template, code-generation, structured-output',
  'promptz/prompts/generate-cdk-lambda-code-from-mermaid-diagram':
    'instruction-based, code-generation',
  'promptz/prompts/generate-drawio-architecture-diagram-from-code':
    'instruction-based, structured-output, constraint-based',
  'promptz/prompts/generate-mermaid-application-flow-diagram-from-code':
    'instruction-based, structured-output',
  'promptz/prompts/generate-mermaid-class-diagram-from-code':
    'zero-shot, structured-output',
  'promptz/prompts/generate-mermaid-sequence-diagram-from-code':
    'zero-shot, structured-output',
  'promptz/prompts/add-unit-test':
    'template, code-generation',
  'promptz/prompts/aws-architecture-blueprint-for-a-scalable-file-processing-pipeline':
    'template, code-generation, structured-output',
  'promptz/prompts/12-factor-refactoring':
    'instruction-based, code-generation, decomposition',
  'promptz/prompts/project-structure-qa':
    'multi-turn, instruction-based',
  'promptz/prompts/python-code-for-external-libraries':
    'zero-shot, code-generation, constraint-based',
}
