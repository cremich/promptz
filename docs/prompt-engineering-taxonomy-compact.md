# Prompt Engineering Taxonomy

A reference for the 15 prompt engineering techniques used to classify prompts on [Promptz.dev](https://promptz.dev), with hallucination risk profiles and mitigation strategies. For full source citations, see [sources.md](./prompt-engineering-taxonomy-sources.md).

---

## Table of Contents

- [Category Quick Reference](#category-quick-reference)
- [Categories](#categories)
- [Hallucination Risk Table](#hallucination-risk-table)
- [Universal Mitigation Strategies](#universal-mitigation-strategies)
- [Provider Approaches to Hallucination](#provider-approaches-to-hallucination)
- [Cross-Provider Consensus](#cross-provider-consensus)

---

## Category Quick Reference

| Category | Description | Hallucination Risk |
|----------|-------------|--------------------|
| Zero-Shot | Direct instruction, no examples | High |
| One-Shot | Single example provided | Medium-High |
| Few-Shot | Multiple examples provided | Medium |
| Chain-of-Thought | Step-by-step reasoning | Low-Medium |
| Persona | Assigns expertise/identity | Medium-High |
| Template | Fill-in-the-blank with variables | Medium |
| Structured Output | Specifies output format | Low-Medium |
| Decomposition | Breaks task into subtasks | Low-Medium |
| Multi-Turn | Iterative dialogue | Medium |
| ReAct | Reasoning + tool use | Low |
| Agentic | Multi-agent coordination | Medium |
| Constraint-Based | Defines rules/boundaries | Low-Medium |
| Code Generation | Produces executable code | Medium |
| Creative | Open-ended content creation | Low (by design) |
| Instruction-Based | Direct imperative command | High |

---

## Categories

### Zero-Shot

No examples provided — the model infers everything from the instruction alone. Best for straightforward, well-understood tasks.

```
Write me a git commit message for the staged changes.
```

**Hallucination risk: High.** No anchoring examples means widest output variance. Research shows ~28–38% hallucination rates for underspecified prompts [13]. Mitigate by adding abstention instructions, constraining output scope, or upgrading to few-shot/CoT.

With mitigations applied:

```
Write a git commit message for the staged changes. Use the Conventional
Commits format: <type>(<scope>): <description>. Base it ONLY on the
actual diff — do not infer intent beyond what the code shows. If the
purpose of a change is unclear, describe the mechanical change instead.
Limit to 72 characters for the subject line.
```

---

### One-Shot

A single input/output example demonstrates the expected behavior. Sits between zero-shot and few-shot in both cost and reliability.

```
Convert the following user story into a test case.

Example:
User Story: "As a user, I can reset my password via email"
Test Case: "Verify that clicking 'Forgot Password' sends a reset link
to the registered email within 30 seconds"

Now convert this:
User Story: "As a user, I can filter search results by date range"
```

**Hallucination risk: Medium-High.** The model may overfit to the single example or fill gaps with fabricated content. Mitigate by choosing a highly representative example and adding explicit instructions alongside it.

With mitigations applied:

```
Convert the following user story into a test case. Follow the exact
format shown in the example. If acceptance criteria are ambiguous,
write the test for the most literal interpretation and add a comment
noting the ambiguity. Do not invent requirements not stated in the story.

Example:
User Story: "As a user, I can reset my password via email"
Test Case: "Verify that clicking 'Forgot Password' sends a reset link
to the registered email within 30 seconds"
// Covers: email delivery, UI trigger, timing constraint

Now convert this:
User Story: "As a user, I can filter search results by date range"
```

---

### Few-Shot

Multiple input/output pairs calibrate the model to a specific format, tone, or logic pattern. More examples improve consistency but cost more tokens.

```
Classify the sentiment of the following headlines as positive, negative, or neutral.

"Startup raises $50M in Series B" → Positive
"Company lays off 200 employees" → Negative
"New airline between Seattle and SF offers opportunity" →
```

**Hallucination risk: Medium.** Reduces rates to ~22% [13], but example quality is everything — bad examples teach bad patterns. Use 3–5 high-quality, diverse, verified examples.

With mitigations applied:

```
Classify the sentiment of the following headlines as positive, negative,
or neutral. If a headline is ambiguous, classify it as "neutral" and
append "(ambiguous)" — do not guess.

"Startup raises $50M in Series B" → Positive
"Company lays off 200 employees" → Negative
"Tech stocks hold steady amid uncertainty" → Neutral (ambiguous)

Now classify:
"New airline between Seattle and SF offers opportunity" →
```

---

### Chain-of-Thought

Explicitly asks the model to reason step-by-step before answering. Historically one of the strongest hallucination reducers (~18% rate [13]), though recent research shows diminishing returns as models improve [2] and potential performance degradation on certain task types [3].

```
<task>
Analyze the code for Service1 and Service2, and identify CloudWatch
alarms present in Service2 but missing in Service1.
</task>

<instructions>
1. Review the code for Service2 and take note of all alarms.
2. Review the code for Service1 and take note of all alarms.
3. Compare the two lists and identify gaps.
4. For each missing alarm, explain why it matters.
</instructions>
```

**Hallucination risk: Low-Medium.** Can produce elaborate but wrong reasoning chains when the model lacks knowledge. CoT also obscures detection signals, making hallucinations harder to catch [5]. Recent research shows CoT's value is diminishing as models improve [2], and it can even reduce performance on certain tasks [3]. Mitigate by combining with grounding/RAG and using uncertainty quantification techniques [4].

With mitigations applied:

```
<task>
Analyze the code for Service1 and Service2, and identify CloudWatch
alarms present in Service2 but missing in Service1.
</task>

<instructions>
1. List every CloudWatch alarm defined in Service2. Cite the file and line.
2. List every CloudWatch alarm defined in Service1. Cite the file and line.
3. Compare the two lists and identify gaps.
4. For each missing alarm, explain why it matters.
5. Re-check: verify each alarm you listed actually exists in the code.
   Remove any that you cannot trace to a specific file.
</instructions>

If you cannot locate the alarm definitions, say so rather than guessing
the alarm names or configurations.
```

---

### Persona / Role-Based

Assigns the model a specific identity or expertise, shaping vocabulary, perspective, and depth.

```
You are acting as an experienced AWS Solutions Architect. Your task is to
design a technical solution that aligns business requirements with scalable,
efficient cloud solutions.
```

**Hallucination risk: Medium-High.** The model prioritizes staying "in character" over accuracy, fabricating domain knowledge to maintain authority. Mitigate by pairing with constraints: "You are an expert, but say 'I'm not sure' when uncertain."

With mitigations applied:

```
You are acting as an experienced AWS Solutions Architect. Your task is to
design a technical solution that aligns business requirements with scalable,
efficient cloud solutions.

Rules:
- Base recommendations ONLY on AWS services you can cite from official
  documentation. Do not reference services or features you are unsure exist.
- If you are uncertain about pricing, limits, or regional availability,
  say "verify this in the AWS pricing calculator / service quotas console."
- When recommending an architecture pattern, name the Well-Architected
  pillar it addresses.
```

---

### Template-Based

Contains placeholder variables (`{{variable}}`) that users fill in before execution. Standardizes structure while varying content.

```
Create a GitHub Actions workflow that runs on pull requests targeting the
{{branch-name}} branch. The workflow should:
- Run on ubuntu-latest
- Use the latest stable {{runtime}} version
- Implement dependency caching with {{cache-dependency-path}}
```

**Hallucination risk: Medium.** Templates constrain structure but not content — the model may fill placeholders with fabricated values. Add "use N/A if unknown" instructions and pre-fill known values.

With mitigations applied:

```
Create a GitHub Actions workflow that runs on pull requests targeting the
{{branch-name}} branch. The workflow should:
- Run on ubuntu-latest
- Use {{runtime}} version {{runtime-version}} (exact version, not "latest")
- Implement dependency caching with {{cache-dependency-path}}

If any placeholder value is missing or unclear, output "PLACEHOLDER_NEEDED:
<variable>" instead of substituting a default. Do not invent version numbers.
```

---

### Structured Output

Specifies output format (JSON, tables, schemas). Ensures machine-parseable or visually consistent responses.

```
For each persona, include:
- Name: [A name for the persona]
- Demographics: [Age, gender, occupation, location]
- Goals: [Primary objectives when using the product]
- Pain Points: [Challenges or frustrations they face]
```

**Hallucination risk: Low-Medium.** Format constraints reduce degrees of freedom, but the model may fabricate values to fill required fields. A JSON response looks authoritative even when wrong. Allow nullable fields and validate programmatically.

With mitigations applied:

```
For each persona, include the fields below. Use null for any field you
cannot determine from the provided research data — do not invent
demographics or goals.

- Name: string
- Demographics: string | null
- Goals: string[] | null
- Pain Points: string[] | null
- Source: "Which research document or data point supports this persona"
```

---

### Decomposition

Breaks a complex task into smaller, ordered subtasks executed sequentially.

```
To complete the task, you must:
1. Read ALL files in the .amazonq/rules folder
2. Read ALL files in the project-intelligence folder
3. Keep asking relevant questions until requirements are clear
4. Create a technical specification document
5. Break it down into small, actionable implementation steps
```

**Hallucination risk: Low-Medium.** Reduces per-step complexity, but errors in early steps cascade through later ones. Add verification checkpoints between steps and keep to 5–7 steps max.

With mitigations applied:

```
To complete the task, you must:
1. Read ALL files in the .amazonq/rules folder. List what you found.
2. Read ALL files in the project-intelligence folder. List what you found.
3. CHECKPOINT: Confirm you have read all files before proceeding. If any
   file failed to load, stop and report the error.
4. Ask clarifying questions until requirements are clear.
5. Create a technical specification document based ONLY on the files read
   and the answers received. Do not add requirements not discussed.
6. Break it down into small, actionable implementation steps.
```

---

### Multi-Turn / Conversational

Establishes iterative dialogue where the model asks clarifying questions and refines output across exchanges.

```
Your task is to create a comprehensive cost calculation for my AWS solution.
- Analyze the workload and services used
- Ask clarifying questions about expected usage and data-transfer patterns
- Gather all required information before producing the estimate
```

**Hallucination risk: Medium.** Context drift across turns introduces contradictions and fabricated context. Periodically restate key facts and limit conversation length.

With mitigations applied:

```
Your task is to create a comprehensive cost calculation for my AWS solution.
- Analyze the workload and services used
- Ask clarifying questions about expected usage and data-transfer patterns
- Gather all required information before producing the estimate
- Before generating the final estimate, restate all confirmed facts and
  assumptions in a numbered list. Ask me to verify before proceeding.
- Use only the pricing data I provide or that you can cite from AWS
  pricing pages. Flag any estimate you are uncertain about as "APPROXIMATE."
```

---

### ReAct (Reasoning + Acting)

Alternates between reasoning and tool-based actions (search, file reads, API calls). Grounds the model in real data.

```
Use your execute tool and your knowledge of unix commands to navigate this
website. Start by analyzing the structure. Continue by researching the listed
topics. Collect both code and documentation. Write the result into a markdown file.
```

**Hallucination risk: Low.** Tool grounding is one of the most effective mitigations [9]. Risk remains if the model fabricates tool outputs when tools fail. Add explicit fallback: "If a tool call fails, report the failure rather than guessing." When ReAct involves code, beware that models accept fabricated library names in 99% of cases and misspellings trigger hallucinations in 26% of tasks [7].

With mitigations applied:

```
Use your execute tool and your knowledge of unix commands to navigate this
website. Start by analyzing the structure. Continue by researching the listed
topics. Collect both code and documentation. Write the result into a markdown
file.

Rules:
- Only include information you retrieved via tool calls. Do not supplement
  with information from memory.
- If a tool call fails or returns an error, report the failure with the
  exact error message. Do not retry silently or fabricate the expected output.
- Cite the URL or file path for every piece of content you include.
```

---

### Agentic / Orchestration

Defines a coordination layer routing tasks between specialized agents. Manages handoffs, state, and workflow sequencing.

```
You are a lightweight coordination agent responsible for routing tasks between
specialized agents and managing workflow state. You do NOT perform research,
writing, or creation tasks yourself.
```

**Hallucination risk: Medium.** Information loss at handoff points, agents fabricating missing context, and contradictions between agent outputs. Use structured handoff schemas and cross-agent consistency checks. Complex workflows may exceed the model's computational ceiling [11].

With mitigations applied:

```
You are a lightweight coordination agent responsible for routing tasks between
specialized agents and managing workflow state. You do NOT perform research,
writing, or creation tasks yourself.

Handoff protocol:
- Pass context between agents using this schema:
  { task, input_summary, constraints, sources_used, open_questions }
- When receiving output from a sub-agent, verify it addresses the original
  task before passing it downstream. If it doesn't, re-route with a
  clarified prompt — do not fill gaps yourself.
- If any agent reports uncertainty, escalate to the user rather than
  resolving it with assumptions.
```

---

### Constraint-Based

Defines explicit rules, boundaries, or guardrails restricting the model's behavior.

```
Your role is that of a principal engineer. You evaluate code for security,
best practices, readability, reliability, and performance. By default you
assume all code was written by either newbies, insider threats, or the worst
of all: inferior AI. Be critical.
```

**Hallucination risk: Low-Medium.** Constraints reduce output space but models can silently ignore them, especially when constraints conflict with training patterns. Keep constraints simple, non-contradictory, and validate compliance programmatically.

With mitigations applied:

```
Your role is that of a principal engineer. You evaluate code for security,
best practices, readability, reliability, and performance.

Constraints:
- Review ONLY the code provided. Do not suggest refactors to code you
  haven't seen.
- For each finding, cite the specific line number and explain the risk.
- Severity levels: CRITICAL, HIGH, MEDIUM, LOW. Do not inflate severity.
- If you find no issues in a category, explicitly state "No issues found"
  rather than inventing minor nitpicks.
- Do not recommend libraries or tools unless you can name the exact
  package and version.
```

---

### Code Generation

Primary output is executable code. Typically specifies language, framework, and version requirements.

```
Create a terraform project for creating an EKS cluster. Also create any VPC,
subnets and other AWS resources required. Use version 20 or higher of
terraform-aws-modules/eks/aws and version 1.32 of Kubernetes.
```

**Hallucination risk: Medium.** Code looks syntactically valid but may reference nonexistent APIs, deprecated methods, or invented libraries. Research shows misspellings in prompts trigger hallucinations in up to 26% of coding tasks, and models accept fabricated library names in 99% of cases [7]. Always specify exact versions, require import statements, and validate with linters/type checkers.

With mitigations applied:

```
Create a terraform project for creating an EKS cluster. Also create any VPC,
subnets and other AWS resources required.

Requirements:
- Use terraform-aws-modules/eks/aws version ~> 20.0
- Kubernetes version 1.32
- Include all required provider blocks with version constraints
- Include all import/source statements — do not assume any module is
  pre-installed
- If you are unsure whether a resource argument exists in this module
  version, add a comment: "// VERIFY: check module docs for this argument"
- Do not reference provider features or arguments from versions you
  are uncertain about
```

---

### Creative / Generative

Open-ended content creation where hallucination is often the desired behavior.

```
Generate a list of creative, engaging, and catchy titles for my document.
The titles should align with the theme and purpose of the content.
```

**Hallucination risk: Low (by design).** Risk shifts to quality and brief alignment. Separate creative sections from factual ones and constrain any factual claims within creative output.

With mitigations applied:

```
Generate a list of 10 creative, engaging, and catchy titles for my document.
The titles should align with the theme and purpose of the content.

Rules:
- Titles are creative — inventive phrasing is encouraged.
- Do NOT include statistics, dates, version numbers, or factual claims
  in the titles. If a title references a fact, it must come from the
  document content provided below.
- After the list, flag any title that implies a factual claim.
```

---

### Instruction-Based

A bare imperative command with no scaffolding. The most common baseline technique.

```
Add doc strings to this codeblock.
```

**Hallucination risk: High.** Minimal guidance maximizes fabrication freedom. Add specificity, constrain scope, or upgrade to a more structured technique for complex tasks.

With mitigations applied:

```
Add JSDoc docstrings to every exported function in this file. For each:
- @param: use the actual parameter names and TypeScript types from the code
- @returns: describe what the function returns based on its implementation
- @example: include one usage example that matches the function signature
- Do not describe behavior that isn't implemented in the code. If a
  function's purpose is unclear from the code alone, write "TODO: clarify
  purpose" instead of guessing.
```

---

## Hallucination Risk Table

Empirical hallucination rates from the Frontiers in AI survey [13]: vague prompts ~38%, zero-shot ~28%, few-shot ~22%, instruction-based ~20%, CoT ~18%.

| Category | Risk | Primary Vulnerability |
|----------|------|-----------------------|
| Zero-Shot | **High** | No anchoring examples |
| One-Shot | **Medium-High** | Insufficient pattern establishment |
| Few-Shot | **Medium** | Example quality determines output quality |
| Chain-of-Thought | **Low-Medium** | Diminishing returns [2]; can reduce performance [3]; obscures detection [5] |
| Persona | **Medium-High** | Fabricates knowledge to stay in character |
| Template | **Medium** | Fills placeholders with fabricated values |
| Structured Output | **Low-Medium** | False precision — valid format, wrong data |
| Decomposition | **Low-Medium** | Error cascading across steps |
| Multi-Turn | **Medium** | Context drift and contradictions |
| ReAct | **Low** | Tool grounding; risk if tools fail |
| Agentic | **Medium** | Handoff data loss; coordination errors |
| Constraint-Based | **Low-Medium** | Silent constraint violation |
| Code Generation | **Medium** | Nonexistent APIs, deprecated methods; misspellings trigger 26% hallucination [7] |
| Creative | **Low** | Hallucination is the feature |
| Instruction-Based | **High** | Maximum fabrication freedom |

---

## Universal Mitigation Strategies

These apply across all prompt types, supported by academic research and provider guidance:

1. **Encourage abstention** — Instruct the model to say "I don't know" rather than guess. Benchmarks that reward guessing over honesty are a root cause of hallucination [12].
2. **Ground in sources** — Use RAG, document citation, or "According to [source]" framing. Grounding reduces hallucination by ~40% (Google) [25, 26].
3. **Constrain output** — Limit length, format, and topic boundaries. Tighter constraints reduce fabrication surface area.
4. **Add verification loops** — AWS Automated Reasoning checks deliver up to 99% verification accuracy [8]. Self-verification and CoVe patterns catch hallucinations post-generation [33].
5. **Use contextual grounding checks** — AWS Bedrock Guardrails verify responses against source material [30].
6. **Lower temperature** — Reduce sampling temperature for factual tasks.
7. **Layer techniques** — Persona + CoT + constraints + RAG produces significantly lower hallucination rates than any single technique.

---

## Provider Approaches to Hallucination

| Provider | Approach | Key Technique | Improvement |
|----------|----------|---------------|-------------|
| OpenAI | Evaluation reform | Reward abstention over guessing [12] | 12.9% → 9.6% (GPT-4o → GPT-5) |
| Anthropic | Interpretability + prompting | Circuit tracing [23]; be specific, use XML tags, permit "I don't know" [17, 18] | Mechanistic understanding |
| Google | Real-time grounding | Google Search integration in Gemini [25, 26] | ~40% reduction |
| Meta | Self-verification | Chain-of-Verification (CoVe) [33] | Up to 94% accuracy boost |
| xAI | Production-data training | Post-training on real user queries | 65% reduction (12.09% → 4.22%) |
| Cohere | Architecture-level RAG | Native document grounding with citations [28] | Built-in |

**Anthropic's key prompting principles** [17, 18]: be painfully specific; tell it why; examples are truth (3–5 diverse); use XML tags for structure; work in small checkpoints; extract rather than generate; use `<thinking>` tags for CoT; request action not advice; use positive instructions.

**Theoretical limits**: Hallucination is a predictable consequence of training objectives that prioritize data distribution over epistemic honesty — behaviorally calibrated reinforcement learning can reduce but not eliminate this [10]. Transformer self-attention caps processing at O(N² · d) complexity; tasks exceeding this threshold will unavoidably produce hallucinations [11]. Mitigation reduces probability but cannot eliminate it entirely [9].

---

## Cross-Provider Consensus

All major providers agree on five principles:

1. **Ground responses** in verifiable sources (RAG, search, citations)
2. **Permit abstention** — "I don't know" beats fabrication
3. **Structure reasoning** — CoT, CoVe, decomposition reduce rates consistently
4. **Verify outputs** — Self-check loops or companion systems catch what prompting misses
5. **Accept the limit** — Hallucination is fundamental, not a bug to patch

---

Bracketed numbers (e.g., [13]) refer to the numbered sources in [prompt-engineering-taxonomy-sources.md](./prompt-engineering-taxonomy-sources.md).
