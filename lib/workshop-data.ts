// Workshop data: prompt engineering taxonomy techniques, scenarios, and mitigation strategies

export interface Technique {
  id: string
  name: string
  description: string
  example: string
  mitigatedExample: string
  riskLevel: 'Low' | 'Low-Medium' | 'Medium' | 'Medium-High' | 'High'
  primaryVulnerability: string
}

export interface Scenario {
  id: string
  description: string
  correctTechniqueId: string
  distractorTechniqueIds: string[]
  feedback: string
  incorrectHints: Record<string, string>
  promptRewrite?: {
    originalPrompt: string
    sampleImprovedPrompt: string
  }
}

export interface MitigationStrategy {
  title: string
  description: string
  example: string
}

export const TECHNIQUES: Technique[] = [
  {
    id: 'zero-shot',
    name: 'Zero-Shot',
    description: 'No examples provided — the model infers everything from the instruction alone. Best for straightforward, well-understood tasks.',
    example: 'Write me a git commit message for the staged changes.',
    mitigatedExample: 'Write a git commit message for the staged changes. Use the Conventional Commits format: <type>(<scope>): <description>. Base it ONLY on the actual diff — do not infer intent beyond what the code shows. If the purpose of a change is unclear, describe the mechanical change instead. Limit to 72 characters for the subject line.',
    riskLevel: 'High',
    primaryVulnerability: 'No anchoring examples',
  },
  {
    id: 'one-shot',
    name: 'One-Shot',
    description: 'A single input/output example demonstrates the expected behavior. Sits between zero-shot and few-shot in both cost and reliability.',
    example: 'Convert the following user story into a test case.\n\nExample:\nUser Story: "As a user, I can reset my password via email"\nTest Case: "Verify that clicking \'Forgot Password\' sends a reset link to the registered email within 30 seconds"\n\nNow convert this:\nUser Story: "As a user, I can filter search results by date range"',
    mitigatedExample: 'Convert the following user story into a test case. Follow the exact format shown in the example. If acceptance criteria are ambiguous, write the test for the most literal interpretation and add a comment noting the ambiguity. Do not invent requirements not stated in the story.\n\nExample:\nUser Story: "As a user, I can reset my password via email"\nTest Case: "Verify that clicking \'Forgot Password\' sends a reset link to the registered email within 30 seconds"\n// Covers: email delivery, UI trigger, timing constraint\n\nNow convert this:\nUser Story: "As a user, I can filter search results by date range"',
    riskLevel: 'Medium-High',
    primaryVulnerability: 'Insufficient pattern establishment',
  },
  {
    id: 'few-shot',
    name: 'Few-Shot',
    description: 'Multiple input/output pairs calibrate the model to a specific format, tone, or logic pattern. More examples improve consistency but cost more tokens.',
    example: 'Classify the sentiment of the following headlines as positive, negative, or neutral.\n\n"Startup raises $50M in Series B" → Positive\n"Company lays off 200 employees" → Negative\n"New airline between Seattle and SF offers opportunity" →',
    mitigatedExample: 'Classify the sentiment of the following headlines as positive, negative, or neutral. If a headline is ambiguous, classify it as "neutral" and append "(ambiguous)" — do not guess.\n\n"Startup raises $50M in Series B" → Positive\n"Company lays off 200 employees" → Negative\n"Tech stocks hold steady amid uncertainty" → Neutral (ambiguous)\n\nNow classify:\n"New airline between Seattle and SF offers opportunity" →',
    riskLevel: 'Medium',
    primaryVulnerability: 'Example quality determines output quality',
  },
  {
    id: 'chain-of-thought',
    name: 'Chain-of-Thought',
    description: 'Explicitly asks the model to reason step-by-step before answering. Historically one of the strongest hallucination reducers, though recent research shows diminishing returns as models improve.',
    example: '<task>\nAnalyze the code for Service1 and Service2, and identify CloudWatch alarms present in Service2 but missing in Service1.\n</task>\n\n<instructions>\n1. Review the code for Service2 and take note of all alarms.\n2. Review the code for Service1 and take note of all alarms.\n3. Compare the two lists and identify gaps.\n4. For each missing alarm, explain why it matters.\n</instructions>',
    mitigatedExample: '<task>\nAnalyze the code for Service1 and Service2, and identify CloudWatch alarms present in Service2 but missing in Service1.\n</task>\n\n<instructions>\n1. List every CloudWatch alarm defined in Service2. Cite the file and line.\n2. List every CloudWatch alarm defined in Service1. Cite the file and line.\n3. Compare the two lists and identify gaps.\n4. For each missing alarm, explain why it matters.\n5. Re-check: verify each alarm you listed actually exists in the code. Remove any that you cannot trace to a specific file.\n</instructions>\n\nIf you cannot locate the alarm definitions, say so rather than guessing the alarm names or configurations.',
    riskLevel: 'Low-Medium',
    primaryVulnerability: 'Diminishing returns; can reduce performance; obscures detection',
  },
  {
    id: 'persona',
    name: 'Persona / Role-Based',
    description: 'Assigns the model a specific identity or expertise, shaping vocabulary, perspective, and depth.',
    example: 'You are acting as an experienced AWS Solutions Architect. Your task is to design a technical solution that aligns business requirements with scalable, efficient cloud solutions.',
    mitigatedExample: 'You are acting as an experienced AWS Solutions Architect. Your task is to design a technical solution that aligns business requirements with scalable, efficient cloud solutions.\n\nRules:\n- Base recommendations ONLY on AWS services you can cite from official documentation. Do not reference services or features you are unsure exist.\n- If you are uncertain about pricing, limits, or regional availability, say "verify this in the AWS pricing calculator / service quotas console."\n- When recommending an architecture pattern, name the Well-Architected pillar it addresses.',
    riskLevel: 'Medium-High',
    primaryVulnerability: 'Fabricates knowledge to stay in character',
  },
  {
    id: 'template',
    name: 'Template-Based',
    description: 'Contains placeholder variables that users fill in before execution. Standardizes structure while varying content.',
    example: 'Create a GitHub Actions workflow that runs on pull requests targeting the {{branch-name}} branch. The workflow should:\n- Run on ubuntu-latest\n- Use the latest stable {{runtime}} version\n- Implement dependency caching with {{cache-dependency-path}}',
    mitigatedExample: 'Create a GitHub Actions workflow that runs on pull requests targeting the {{branch-name}} branch. The workflow should:\n- Run on ubuntu-latest\n- Use {{runtime}} version {{runtime-version}} (exact version, not "latest")\n- Implement dependency caching with {{cache-dependency-path}}\n\nIf any placeholder value is missing or unclear, output "PLACEHOLDER_NEEDED: <variable>" instead of substituting a default. Do not invent version numbers.',
    riskLevel: 'Medium',
    primaryVulnerability: 'Fills placeholders with fabricated values',
  },
  {
    id: 'structured-output',
    name: 'Structured Output',
    description: 'Specifies output format (JSON, tables, schemas). Ensures machine-parseable or visually consistent responses.',
    example: 'For each persona, include:\n- Name: [A name for the persona]\n- Demographics: [Age, gender, occupation, location]\n- Goals: [Primary objectives when using the product]\n- Pain Points: [Challenges or frustrations they face]',
    mitigatedExample: 'For each persona, include the fields below. Use null for any field you cannot determine from the provided research data — do not invent demographics or goals.\n\n- Name: string\n- Demographics: string | null\n- Goals: string[] | null\n- Pain Points: string[] | null\n- Source: "Which research document or data point supports this persona"',
    riskLevel: 'Low-Medium',
    primaryVulnerability: 'False precision — valid format, wrong data',
  },
  {
    id: 'decomposition',
    name: 'Decomposition',
    description: 'Breaks a complex task into smaller, ordered subtasks executed sequentially.',
    example: 'To complete the task:\n1. Read the project files\n2. Understand the requirements\n3. Write a technical spec\n4. Break it into implementation steps\n5. Start coding',
    mitigatedExample: 'To complete the task, you must:\n1. Read ALL files in the .amazonq/rules folder. List each file you found.\n2. Read ALL files in the project-intelligence folder. List each file you found.\n3. CHECKPOINT: Confirm you have read all files before proceeding. If any file failed to load, stop and report the error.\n4. Ask clarifying questions until requirements are clear. Number each question.\n5. Create a technical specification document based ONLY on the files read and the answers received. Do not add requirements not discussed.\n6. Break it down into small, actionable implementation steps. Each step must reference the spec section it implements.',
    riskLevel: 'Low-Medium',
    primaryVulnerability: 'Error cascading across steps',
  },
  {
    id: 'multi-turn',
    name: 'Multi-Turn / Conversational',
    description: 'Establishes iterative dialogue where the model asks clarifying questions and refines output across exchanges.',
    example: 'Your task is to create a comprehensive cost calculation for my AWS solution.\n- Analyze the workload and services used\n- Ask clarifying questions about expected usage and data-transfer patterns\n- Gather all required information before producing the estimate',
    mitigatedExample: 'Your task is to create a comprehensive cost calculation for my AWS solution.\n- Analyze the workload and services used\n- Ask clarifying questions about expected usage and data-transfer patterns\n- Gather all required information before producing the estimate\n- Before generating the final estimate, restate all confirmed facts and assumptions in a numbered list. Ask me to verify before proceeding.\n- Use only the pricing data I provide or that you can cite from AWS pricing pages. Flag any estimate you are uncertain about as "APPROXIMATE."',
    riskLevel: 'Medium',
    primaryVulnerability: 'Context drift and contradictions',
  },
  {
    id: 'react',
    name: 'ReAct',
    description: 'Alternates between reasoning and tool-based actions (search, file reads, API calls). Grounds the model in real data.',
    example: 'Use your execute tool and your knowledge of unix commands to navigate this website. Start by analyzing the structure. Continue by researching the listed topics. Collect both code and documentation. Write the result into a markdown file.',
    mitigatedExample: 'Use your execute tool and your knowledge of unix commands to navigate this website. Start by analyzing the structure. Continue by researching the listed topics. Collect both code and documentation. Write the result into a markdown file.\n\nRules:\n- Only include information you retrieved via tool calls. Do not supplement with information from memory.\n- If a tool call fails or returns an error, report the failure with the exact error message. Do not retry silently or fabricate the expected output.\n- Cite the URL or file path for every piece of content you include.',
    riskLevel: 'Low',
    primaryVulnerability: 'Tool grounding; risk if tools fail',
  },
  {
    id: 'agentic',
    name: 'Agentic / Orchestration',
    description: 'Defines a coordination layer routing tasks between specialized agents. Manages handoffs, state, and workflow sequencing.',
    example: 'You are a lightweight coordination agent responsible for routing tasks between specialized agents and managing workflow state. You do NOT perform research, writing, or creation tasks yourself.',
    mitigatedExample: 'You are a lightweight coordination agent responsible for routing tasks between specialized agents and managing workflow state. You do NOT perform research, writing, or creation tasks yourself.\n\nHandoff protocol:\n- Pass context between agents using this schema: { task, input_summary, constraints, sources_used, open_questions }\n- When receiving output from a sub-agent, verify it addresses the original task before passing it downstream. If it doesn\'t, re-route with a clarified prompt — do not fill gaps yourself.\n- If any agent reports uncertainty, escalate to the user rather than resolving it with assumptions.',
    riskLevel: 'Medium',
    primaryVulnerability: 'Handoff data loss; coordination errors',
  },
  {
    id: 'constraint-based',
    name: 'Constraint-Based',
    description: 'Defines explicit rules, boundaries, or guardrails restricting the model\'s behavior.',
    example: 'Your role is that of a principal engineer. You evaluate code for security, best practices, readability, reliability, and performance. By default you assume all code was written by either newbies, insider threats, or the worst of all: inferior AI. Be critical.',
    mitigatedExample: 'Your role is that of a principal engineer. You evaluate code for security, best practices, readability, reliability, and performance.\n\nConstraints:\n- Review ONLY the code provided. Do not suggest refactors to code you haven\'t seen.\n- For each finding, cite the specific line number and explain the risk.\n- Severity levels: CRITICAL, HIGH, MEDIUM, LOW. Do not inflate severity.\n- If you find no issues in a category, explicitly state "No issues found" rather than inventing minor nitpicks.\n- Do not recommend libraries or tools unless you can name the exact package and version.',
    riskLevel: 'Low-Medium',
    primaryVulnerability: 'Silent constraint violation',
  },
  {
    id: 'code-generation',
    name: 'Code Generation',
    description: 'Primary output is executable code. Typically specifies language, framework, and version requirements.',
    example: 'Create a terraform project for creating an EKS cluster. Also create any VPC, subnets and other AWS resources required. Use version 20 or higher of terraform-aws-modules/eks/aws and version 1.32 of Kubernetes.',
    mitigatedExample: 'Create a terraform project for creating an EKS cluster. Also create any VPC, subnets and other AWS resources required.\n\nRequirements:\n- Use terraform-aws-modules/eks/aws version ~> 20.0\n- Kubernetes version 1.32\n- Include all required provider blocks with version constraints\n- Include all import/source statements — do not assume any module is pre-installed\n- If you are unsure whether a resource argument exists in this module version, add a comment: "// VERIFY: check module docs for this argument"\n- Do not reference provider features or arguments from versions you are uncertain about',
    riskLevel: 'Medium',
    primaryVulnerability: 'Nonexistent APIs, deprecated methods; misspellings trigger hallucination',
  },
  {
    id: 'creative',
    name: 'Creative / Generative',
    description: 'Open-ended content creation where hallucination is often the desired behavior.',
    example: 'Generate a list of creative, engaging, and catchy titles for my document. The titles should align with the theme and purpose of the content.',
    mitigatedExample: 'Generate a list of 10 creative, engaging, and catchy titles for my document. The titles should align with the theme and purpose of the content.\n\nRules:\n- Titles are creative — inventive phrasing is encouraged.\n- Do NOT include statistics, dates, version numbers, or factual claims in the titles. If a title references a fact, it must come from the document content provided below.\n- After the list, flag any title that implies a factual claim.',
    riskLevel: 'Low',
    primaryVulnerability: 'Hallucination is the feature',
  },
  {
    id: 'instruction-based',
    name: 'Instruction-Based',
    description: 'A bare imperative command with no scaffolding. The most common baseline technique.',
    example: 'Add doc strings to this codeblock.',
    mitigatedExample: 'Add JSDoc docstrings to every exported function in this file. For each:\n- @param: use the actual parameter names and TypeScript types from the code\n- @returns: describe what the function returns based on its implementation\n- @example: include one usage example that matches the function signature\n- Do not describe behavior that isn\'t implemented in the code. If a function\'s purpose is unclear from the code alone, write "TODO: clarify purpose" instead of guessing.',
    riskLevel: 'High',
    primaryVulnerability: 'Maximum fabrication freedom',
  },
]

export const SCENARIOS: Scenario[] = [
  {
    id: 'scenario-1',
    description: 'A developer asks their AI assistant: "Summarize the key changes in this pull request." The assistant receives no examples, no format specification, and no constraints — just the bare instruction alongside the diff.',
    correctTechniqueId: 'zero-shot',
    distractorTechniqueIds: ['instruction-based', 'one-shot', 'structured-output'],
    feedback: 'This is a Zero-Shot prompt because the model receives a single instruction with no examples, format constraints, or scaffolding. While it resembles Instruction-Based, Zero-Shot specifically refers to the absence of examples — the model must infer the expected output entirely from the instruction.',
    incorrectHints: {
      'instruction-based': 'Instruction-Based is a bare imperative command. This prompt does give a clear task context (the PR diff), making it more of a zero-example inference task.',
      'one-shot': 'One-Shot requires providing a single input/output example to demonstrate expected behavior. No example is given here.',
      'structured-output': 'Structured Output specifies a particular format (JSON, table, schema). This prompt does not constrain the output format.',
    },
  },
  {
    id: 'scenario-2',
    description: 'A team lead creates a prompt that includes three examples of converting Jira tickets into acceptance criteria, each showing the input ticket and the expected output format. The AI is then asked to convert a new ticket using the same pattern.',
    correctTechniqueId: 'few-shot',
    distractorTechniqueIds: ['one-shot', 'template', 'structured-output'],
    feedback: 'This is Few-Shot prompting because multiple input/output examples are provided to calibrate the model to a specific format and logic pattern. The three examples establish a consistent pattern the model should follow.',
    incorrectHints: {
      'one-shot': 'One-Shot uses exactly one example. This prompt provides three examples, making it Few-Shot.',
      'template': 'Template-Based uses placeholder variables (like {{variable}}) that users fill in. This prompt uses complete examples, not templates.',
      'structured-output': 'While the output has a consistent format, the technique here is about using multiple examples to teach the pattern, not about specifying output structure.',
    },
  },
  {
    id: 'scenario-3',
    description: 'A developer writes a prompt that says: "You are a senior security engineer with 15 years of experience in penetration testing. Review this authentication module and identify vulnerabilities, rating each by CVSS score."',
    correctTechniqueId: 'persona',
    distractorTechniqueIds: ['constraint-based', 'instruction-based', 'chain-of-thought'],
    feedback: 'This is Persona / Role-Based prompting because it assigns the model a specific identity ("senior security engineer with 15 years of experience") to shape its vocabulary, perspective, and depth of analysis.',
    incorrectHints: {
      'constraint-based': 'Constraint-Based defines explicit rules and boundaries. While CVSS scoring adds structure, the core technique here is assigning an expert identity.',
      'instruction-based': 'Instruction-Based is a bare command with no scaffolding. This prompt adds significant scaffolding through the persona assignment.',
      'chain-of-thought': 'Chain-of-Thought explicitly asks for step-by-step reasoning. This prompt assigns a role rather than requesting a reasoning process.',
    },
    promptRewrite: {
      originalPrompt: 'You are a senior security engineer. Review this code for security issues.',
      sampleImprovedPrompt: 'You are a senior security engineer. Review this authentication module for vulnerabilities.\n\nRules:\n- Only flag issues you can point to in the provided code. Do not speculate about code you haven\'t seen.\n- For each vulnerability, cite the specific line and explain the attack vector.\n- If you are unsure about a finding\'s severity, say "NEEDS VERIFICATION" rather than guessing a CVSS score.\n- Do not fabricate CVE numbers or reference advisories you cannot cite.',
    },
  },
  {
    id: 'scenario-4',
    description: 'An engineer builds a prompt that instructs the AI to: (1) read the project\'s README, (2) list all API endpoints found, (3) check each endpoint for authentication middleware, (4) verify the findings by re-reading the route files, and (5) produce a compliance report. Each step must be completed before moving to the next.',
    correctTechniqueId: 'decomposition',
    distractorTechniqueIds: ['chain-of-thought', 'react', 'agentic'],
    feedback: 'This is Decomposition because it breaks a complex task into smaller, ordered subtasks executed sequentially. Each step builds on the previous one, and the task is explicitly structured as a numbered sequence.',
    incorrectHints: {
      'chain-of-thought': 'Chain-of-Thought asks the model to reason step-by-step before answering. Decomposition breaks the task itself into discrete subtasks, not just the reasoning.',
      'react': 'ReAct alternates between reasoning and tool-based actions. While tools might be used here, the core technique is the sequential task breakdown.',
      'agentic': 'Agentic involves routing tasks between multiple specialized agents. This prompt uses a single agent working through ordered steps.',
    },
  },
  {
    id: 'scenario-5',
    description: 'A developer configures their AI coding assistant with this system prompt: "Use your file search and terminal tools to investigate the bug. Read the error logs first, then examine the relevant source files, then propose a fix based on what you found. Only include information from the files you actually read."',
    correctTechniqueId: 'react',
    distractorTechniqueIds: ['decomposition', 'agentic', 'constraint-based'],
    feedback: 'This is ReAct (Reasoning + Acting) because it alternates between reasoning and tool-based actions — file search, terminal commands, and file reads. The model is grounded in real data retrieved through tool calls.',
    incorrectHints: {
      'decomposition': 'Decomposition breaks tasks into ordered subtasks. While there are steps here, the key element is the use of tools (file search, terminal) to ground reasoning in real data.',
      'agentic': 'Agentic involves coordinating between multiple specialized agents. This is a single agent using tools, not multiple agents.',
      'constraint-based': 'The "only include information from files you read" is a constraint, but the primary technique is the reasoning-plus-tool-action loop.',
    },
  },
  {
    id: 'scenario-6',
    description: 'A prompt asks the AI to generate a REST API response schema and specifies: "Return the result as a JSON object with fields: status (string), data (array of objects with id, name, createdAt), and pagination (object with page, pageSize, total). Use null for any field that cannot be determined."',
    correctTechniqueId: 'structured-output',
    distractorTechniqueIds: ['template', 'constraint-based', 'code-generation'],
    feedback: 'This is Structured Output because it specifies an exact output format (JSON schema) with defined fields and types. The focus is on ensuring machine-parseable, consistently formatted responses.',
    incorrectHints: {
      'template': 'Template-Based uses placeholder variables ({{variable}}) for users to fill in. This prompt defines an output schema, not an input template.',
      'constraint-based': 'While the format specification acts as a constraint, the primary technique is defining the output structure and format.',
      'code-generation': 'Code Generation produces executable code. This prompt asks for a data schema definition, not runnable code.',
    },
    promptRewrite: {
      originalPrompt: 'Generate a JSON response for the user list API endpoint.',
      sampleImprovedPrompt: 'Generate a JSON response for the user list API endpoint. Use this exact schema:\n\n{ "status": string, "data": [{ "id": string, "name": string, "email": string }], "pagination": { "page": number, "total": number } }\n\nUse null for any field you cannot determine from the provided context. Do not invent sample data — use placeholder values like "user_001" and mark them with a "// SAMPLE" comment.',
    },
  },
  {
    id: 'scenario-7',
    description: 'A developer creates a reusable prompt: "Write a {{language}} function called {{functionName}} that takes {{parameters}} and returns {{returnType}}. Include error handling for {{errorCases}}. Target {{framework}} version {{frameworkVersion}}."',
    correctTechniqueId: 'template',
    distractorTechniqueIds: ['code-generation', 'structured-output', 'instruction-based'],
    feedback: 'This is Template-Based prompting because it contains placeholder variables ({{language}}, {{functionName}}, etc.) that users fill in before execution. It standardizes the prompt structure while allowing content to vary.',
    incorrectHints: {
      'code-generation': 'Code Generation focuses on producing executable code as output. This prompt is about the input structure — it uses placeholders to create a reusable template.',
      'structured-output': 'Structured Output specifies the format of the response. This prompt structures the input with fill-in-the-blank variables.',
      'instruction-based': 'Instruction-Based is a bare command. This prompt has significant scaffolding through its template variable system.',
    },
  },
  {
    id: 'scenario-8',
    description: 'A team sets up an AI workflow where a "planner" agent breaks down a feature request, a "coder" agent implements each piece, and a "reviewer" agent checks the code. A coordinator agent manages the handoffs, passing context between them using a structured schema and escalating uncertainties to the human developer.',
    correctTechniqueId: 'agentic',
    distractorTechniqueIds: ['decomposition', 'react', 'multi-turn'],
    feedback: 'This is Agentic / Orchestration because it defines a coordination layer routing tasks between specialized agents (planner, coder, reviewer). The coordinator manages handoffs, state, and workflow sequencing across multiple agents.',
    incorrectHints: {
      'decomposition': 'Decomposition breaks a task into subtasks for a single agent. This involves multiple specialized agents coordinating together.',
      'react': 'ReAct alternates reasoning and tool use within a single agent. This involves multiple agents with distinct roles.',
      'multi-turn': 'Multi-Turn is iterative dialogue between a user and one model. This is coordination between multiple AI agents.',
    },
  },
  {
    id: 'scenario-9',
    description: 'A developer writes: "Create a Python Flask API with user authentication, database models for users and posts, and REST endpoints for CRUD operations. Use SQLAlchemy 2.0 and Flask-JWT-Extended 4.x. Include all import statements."',
    correctTechniqueId: 'code-generation',
    distractorTechniqueIds: ['template', 'instruction-based', 'decomposition'],
    feedback: 'This is Code Generation because the primary output is executable code with specific language, framework, and version requirements. It specifies Python, Flask, SQLAlchemy 2.0, and Flask-JWT-Extended 4.x.',
    incorrectHints: {
      'template': 'Template-Based uses placeholder variables. This prompt specifies concrete values, not fill-in-the-blank placeholders.',
      'instruction-based': 'Instruction-Based is a bare command with no scaffolding. This prompt includes specific framework versions, library requirements, and structural expectations.',
      'decomposition': 'Decomposition breaks tasks into ordered subtasks. While the prompt lists multiple features, it asks for them as a single code output, not sequential steps.',
    },
    promptRewrite: {
      originalPrompt: 'Create a Python API with authentication and a database.',
      sampleImprovedPrompt: 'Create a Python Flask REST API with JWT authentication and SQLAlchemy models.\n\nRequirements:\n- Flask 3.x, SQLAlchemy 2.0, Flask-JWT-Extended 4.x\n- Include all import statements — do not assume any package is pre-installed\n- Models: User (id, email, password_hash), Post (id, title, body, user_id FK)\n- Endpoints: CRUD for users and posts, login/register for auth\n- If you are unsure whether an API exists in the specified version, add a comment: "# VERIFY: check docs for this API"\n- Do not use deprecated patterns from older Flask/SQLAlchemy versions',
    },
  },
  {
    id: 'scenario-10',
    description: 'A developer sets up a conversational flow: "Help me design a database schema for my e-commerce app. Start by asking me about the product types I sell, then ask about my order workflow, then ask about customer data requirements. Don\'t generate the schema until you\'ve gathered all the information."',
    correctTechniqueId: 'multi-turn',
    distractorTechniqueIds: ['decomposition', 'persona', 'chain-of-thought'],
    feedback: 'This is Multi-Turn / Conversational because it establishes an iterative dialogue where the model asks clarifying questions and refines its output across multiple exchanges before producing the final result.',
    incorrectHints: {
      'decomposition': 'Decomposition breaks a task into sequential subtasks. This prompt establishes a back-and-forth conversation, not a one-pass sequential execution.',
      'persona': 'Persona assigns the model an identity. While the model acts as a consultant, the core technique is the iterative question-and-answer dialogue.',
      'chain-of-thought': 'Chain-of-Thought asks for step-by-step reasoning in a single response. This prompt requires multiple exchanges between user and model.',
    },
  },
  {
    id: 'scenario-11',
    description: 'A developer adds this to their AI assistant\'s system prompt: "You may only suggest changes to files I explicitly share with you. Do not reference or modify files you haven\'t seen. Rate all findings as CRITICAL, HIGH, MEDIUM, or LOW — do not invent intermediate severity levels. If you find no issues, say so explicitly."',
    correctTechniqueId: 'constraint-based',
    distractorTechniqueIds: ['persona', 'instruction-based', 'structured-output'],
    feedback: 'This is Constraint-Based prompting because it defines explicit rules, boundaries, and guardrails restricting the model\'s behavior — limiting scope to shared files, defining severity levels, and requiring explicit "no issues" statements.',
    incorrectHints: {
      'persona': 'Persona assigns an identity or expertise. These are behavioral rules, not a role assignment.',
      'instruction-based': 'Instruction-Based is a bare command. This prompt is entirely about defining boundaries and restrictions, not giving a task.',
      'structured-output': 'While severity levels add structure, the primary technique is constraining behavior through explicit rules and guardrails.',
    },
  },
  {
    id: 'scenario-12',
    description: 'A content team asks their AI: "Write 10 tagline options for our new developer tool launch. Be creative and playful — puns are welcome. The taglines should convey speed and simplicity."',
    correctTechniqueId: 'creative',
    distractorTechniqueIds: ['zero-shot', 'instruction-based', 'few-shot'],
    feedback: 'This is Creative / Generative prompting because it\'s open-ended content creation where inventiveness is the goal. The prompt encourages creative phrasing and playfulness — hallucination (in the sense of novel generation) is the desired behavior.',
    incorrectHints: {
      'zero-shot': 'Zero-Shot refers to the absence of examples. While no examples are given, the defining characteristic here is the creative, open-ended nature of the task.',
      'instruction-based': 'Instruction-Based is a bare imperative. This prompt includes creative direction (playful, puns welcome) that goes beyond a simple command.',
      'few-shot': 'Few-Shot provides multiple examples to establish a pattern. No examples are provided in this prompt.',
    },
    promptRewrite: {
      originalPrompt: 'Write some taglines for our product launch.',
      sampleImprovedPrompt: 'Write 10 creative taglines for our developer tool launch. The taglines should convey speed and simplicity. Puns and playful language are encouraged.\n\nRules:\n- Titles are creative — inventive phrasing is welcome.\n- Do NOT include specific performance numbers, benchmarks, or factual claims unless I provide them below.\n- After the list, flag any tagline that implies a factual claim that would need verification.',
    },
  },
]

export const MITIGATION_STRATEGIES: MitigationStrategy[] = [
  {
    title: 'Encourage abstention',
    description: 'Instruct the model to say "I don\'t know" rather than guess. Models that are told they can decline to answer produce fewer fabricated facts.',
    example: 'If you are not confident in the answer or lack sufficient information, respond with "I don\'t have enough information to answer that accurately" instead of guessing.',
  },
  {
    title: 'Ground in sources',
    description: 'Use RAG, document citation, or "According to [source]" framing. Reduces hallucination by ~40% by anchoring responses to real data.',
    example: 'Answer the following question using ONLY the provided documents. Cite each claim with [Doc N]. If the documents don\'t contain the answer, say so.\n\n[Document 1]: ...\n[Document 2]: ...',
  },
  {
    title: 'Constrain output',
    description: 'Limit length, format, and topic boundaries. Narrower output spaces leave less room for the model to fabricate details.',
    example: 'Respond in exactly 3 bullet points. Each bullet must be one sentence. Only discuss the security implications — do not cover performance or cost.',
  },
  {
    title: 'Add verification loops',
    description: 'Self-verification and CoVe (Chain of Verification) patterns catch hallucinations post-generation by having the model check its own work.',
    example: 'First, answer the question. Then, list 3 verification questions that would confirm your answer is correct. Finally, answer those verification questions and revise your original answer if needed.',
  },
  {
    title: 'Use contextual grounding checks',
    description: 'Verify responses against source material. Ask the model to explicitly confirm each claim maps back to provided context.',
    example: 'For each statement in your response, add a [GROUNDED] or [UNGROUNDED] tag indicating whether it can be directly supported by the provided context. Remove any [UNGROUNDED] statements from your final answer.',
  },
  {
    title: 'Lower temperature',
    description: 'Reduce sampling temperature for factual tasks. Lower temperature (0.0–0.3) makes the model pick higher-probability tokens, reducing creative fabrication.',
    example: 'Use temperature=0.1 for factual Q&A, data extraction, and code generation. Reserve temperature=0.7+ for creative writing, brainstorming, and open-ended exploration.',
  },
  {
    title: 'Layer techniques',
    description: 'Persona + CoT + constraints + RAG produces significantly lower hallucination rates than any single technique. Combining strategies compounds their effectiveness.',
    example: 'You are a senior security auditor [Persona]. Using the provided codebase [RAG], analyze the authentication flow step by step [CoT]. List only confirmed vulnerabilities with file and line references [Constraints]. If unsure, flag as "needs manual review" [Abstention].',
  },
]

export const CROSS_PROVIDER_CONSENSUS: string[] = [
  'Ground responses in verifiable sources (RAG, search, citations)',
  'Permit abstention — "I don\'t know" beats fabrication',
  'Structure reasoning — CoT, CoVe, decomposition reduce rates consistently',
  'Verify outputs — Self-check loops or companion systems catch what prompting misses',
  'Accept the limit — Hallucination is fundamental, not a bug to patch',
]
