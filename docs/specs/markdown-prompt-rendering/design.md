# Design Document

## Architecture Overview

The markdown-based prompt rendering system will migrate the existing content management for prompts to include static markdown files rather than API-based data fetching. This design leverages Next.js's build-time processing to create a prompt index used for searching and data access patterns.

## System Components

### 1. Content Processing Pipeline

```
content/prompts/*.md → Frontmatter Parser → Prompt Model → Build Index → Static Pages
                    ↓
                Index → Search/Browse → Existing Components
```

### 2. Directory Structure

```
promptz/
├── content/
│   └── prompts/
│       ├── architecture/
│       │   ├── aws-architecture-blueprint.md
│       │   ├── generate-mermaid-diagrams.md
│       │   └── solution-design-patterns.md
│       ├── code-generation/
│       │   ├── build-ui-components.md
│       │   ├── python-lambda-layers.md
│       │   └── cdk-infrastructure.md
│       ├── documentation/
│       │   ├── adr-creation.md
│       │   ├── project-specifications.md
│       │   └── code-documentation.md
│       ├── testing/
│       │   ├── unit-test-generation.md
│       │   ├── cypress-testing.md
│       │   └── junit-patterns.md
│       ├── analysis/
│       │   ├── code-review-automation.md
│       │   ├── security-analysis.md
│       │   └── refactoring-guidance.md
│       ├── aws/
│       │   ├── eks-cluster-setup.md
│       │   ├── monitoring-alarms.md
│       │   └── terraform-best-practices.md
│       ├── scaffolding/
│       │   ├── flask-app-bootstrap.md
│       │   ├── workspace-setup.md
│       │   └── ci-cd-workflows.md
│       ├── spec-driven-development/
│       │   ├── specification-creation.md
│       │   └── implementation-planning.md
│       ├── solutions/
│       │   ├── complete-applications.md
│       │   ├── data-pipelines.md
│       │   └── api-solutions.md
│       ├── persona/
│       │   ├── senior-engineer-roles.md
│       │   ├── expert-advisors.md
│       │   └── specialized-coaches.md
│       └── general/
│           └── git-workflows.md
├── templates/
│   └── prompt-template.md
└── lib/
    └── markdown/
        ├── processor.ts
        ├── parser.ts
        └── types.ts
```

### 3. Data Flow Architecture

#### Build Time Processing

1. **File Discovery**: Scan `content/prompts/` recursively for `.md` files
2. **Frontmatter Parsing**: Extract metadata using gray-matter
3. **Content Processing**: Parse markdown content into existing Prompt model
4. **Validation**: Ensure required fields are present
5. **Index Generation**: Create search index from markdown prompts
6. **Static Generation**: Generate individual prompt pages using existing components

#### Build Time Index Structure

```typescript
interface PromptIndex {
  prompts: Prompt[]; // All markdown prompts
  searchIndex: {
    byTitle: Map<string, Prompt[]>;
    byDescription: Map<string, Prompt[]>;
    byContent: Map<string, Prompt[]>;
    byAuthor: Map<string, Prompt[]>;
    byTags: Map<string, Prompt[]>;
    byCategory: Map<string, Prompt[]>;
  };
  tagIndex: Map<string, Prompt[]>;
  categoryIndex: Map<string, Prompt[]>;
  metadata: {
    totalCount: number;
    lastBuildTime: string;
  };
}
```

#### Runtime Rendering

1. **Page Requests**: Use existing prompt pages and components
2. **Data Sources**: Serve from markdown-based index
3. **Search Queries**: Use pre-built search index for fast client-side search
4. **Interaction Tracking**: Use existing API mutations for downloads/copies
5. **Search/Browse**: Use markdown index for all prompt discovery

## Technical Implementation

### 1. Frontmatter Schema

```typescript
interface PromptFrontmatter {
  title: string; // Required: Display name
  description: string; // Required: Brief description
  author: string; // Required: Content creator
  tags?: string[]; // Optional: Additional tags
  sourceURL?: string; // Optional: Reference link
}
```

### 2. Markdown Content Structure

```markdown
---
title: "AWS Lambda Best Practices"
description: "Essential patterns for serverless development"
author: "john-doe"
tags: ["IDE", "Chat", "Optimize"]
sourceURL: "https://github.com/example/repo"
---

# AWS Lambda Best Practices

Your comprehensive prompt content goes here...

## How to Use

Step-by-step instructions for using this prompt effectively:

1. Copy the prompt above
2. Customize the parameters for your use case
3. Apply to your Amazon Q Developer session
```

### 3. Unified Prompt Model (Existing)

The markdown processing will convert frontmatter and content directly to the existing `Prompt` type:

```typescript
// Use existing Prompt type from lib/models/prompt-model.ts
type Prompt = {
  id?: string;
  name?: string; // maps to frontmatter.title
  description?: string; // maps to frontmatter.description
  tags?: string[]; // combined directory + frontmatter tags
  content?: string; // main prompt content
  howto?: string; // "How to Use" section content
  author?: string; // maps to frontmatter.author
  authorId?: string; // not used for markdown prompts
  slug?: string; // derived from filename
  sourceURL?: string; // maps to frontmatter.sourceURL
  createdAt?: string; // from git history
  updatedAt?: string; // from git history
  copyCount?: number; // from API interaction tracking
  downloadCount?: number; // from API interaction tracking
  starCount?: number; // from API interaction tracking
  popularityScore?: number; // calculated from interactions
};
```

### 4. Markdown to Prompt Conversion

```typescript
function convertMarkdownToPrompt(
  frontmatter: PromptFrontmatter,
  content: string,
  howto: string,
  category: string,
  filePath: string,
): Prompt {
  const filename = path.basename(filePath, ".md");

  return {
    id: generateId(filePath),
    slug: filename, // Derived from filename
    name: frontmatter.title,
    description: frontmatter.description,
    tags: [category, ...(frontmatter.tags || [])],
    content,
    howto,
    author: frontmatter.author,
    sourceURL: frontmatter.sourceURL,
    createdAt: getGitCreatedDate(filePath),
    updatedAt: getGitModifiedDate(filePath),
    // Interaction data populated from API client-side
    downloadCount: 0,
    popularityScore: 0,
  };
}
```

### 4. URL Structure (Unchanged)

- **Individual Prompts**: `/prompts/prompt/{slug}`
- **Tag Pages**: `/tag/{tagName}`
- **Category Browse**: `/prompts?category={category}`
- **Search Results**: `/prompts?query={search}`

## Search System Integration

### 1. Build-Time Search Index Generation

```typescript
interface SearchIndexBuilder {
  // Process all prompts (markdown-only) into searchable structures
  buildSearchIndex(prompts: Prompt[]): SearchIndex;

  // Create inverted indexes for fast lookup
  createInvertedIndex(
    prompts: Prompt[],
    field: keyof Prompt,
  ): Map<string, Prompt[]>;

  // Generate search metadata for filtering
  extractSearchableTerms(prompt: Prompt): string[];
}

interface SearchIndex {
  // Full-text search indexes
  titleIndex: Map<string, Prompt[]>; // Searchable by title words
  descriptionIndex: Map<string, Prompt[]>; // Searchable by description words
  contentIndex: Map<string, Prompt[]>; // Searchable by prompt content
  authorIndex: Map<string, Prompt[]>; // Searchable by author

  // Categorical indexes
  tagIndex: Map<string, Prompt[]>; // Filter by tags
  categoryIndex: Map<string, Prompt[]>; // Filter by directory category

  // Combined search terms for fuzzy matching
  allTermsIndex: Map<string, Prompt[]>; // All searchable text combined
}
```

### 2. Search Query Processing

```typescript
interface SearchProcessor {
  // Main search function used by existing search actions
  searchPrompts(query: string, filters?: SearchFilters): Prompt[];

  // Filter prompts by category (directory-based)
  filterByCategory(prompts: Prompt[], category: string): Prompt[];

  // Filter prompts by tags (combined directory + frontmatter)
  filterByTags(prompts: Prompt[], tags: string[]): Prompt[];

  // Sort results by relevance, popularity, date
  sortResults(
    prompts: Prompt[],
    sortBy: "relevance" | "popularity" | "date",
  ): Prompt[];
}

interface SearchFilters {
  categories?: string[]; // Filter by directory categories
  tags?: string[]; // Filter by specific tags
  authors?: string[]; // Filter by authors
  sortBy?: "relevance" | "popularity" | "date";
}
```

### 3. Integration with Existing Search

```typescript
// Existing search actions will be updated to use markdown index
// lib/actions/search-prompts-action.ts (example)
export async function searchPrompts(
  query: string,
  filters?: SearchFilters,
): Promise<Prompt[]> {
  // Before: API call
  // const results = await amplifyClient.graphql({ query: searchPromptsQuery });

  // After: Use build-time generated index
  const promptIndex = await getPromptIndex();
  const searchProcessor = new SearchProcessor(promptIndex.searchIndex);

  return searchProcessor.searchPrompts(query, filters);
}
```

## Tag System Integration

### 1. Tag Sources

- **Directory Tags**: Automatically assigned from purpose-based directory structure (e.g., `architecture/`, `code-generation/`, `testing/`, `analysis/`, `aws/`, `scaffolding/`, `spec-driven-development/`, `solutions/`, `persona/`, `general/`)
- **Frontmatter Tags**: Additional tags specified in markdown frontmatter to preserve existing tag ecosystem
- **Tag Merging**: Combine directory and frontmatter tags for comprehensive tagging while maintaining backward compatibility

### 2. Tag Merging Process

Tags are simply combined during the markdown-to-prompt conversion:

```typescript
// In convertMarkdownToPrompt function
tags: [category, ...(frontmatter.tags || [])];
```

This creates a single `tags` array containing:

- Directory-based category (e.g., "architecture", "testing")
- Additional frontmatter tags (e.g., ["IDE", "Chat", "Optimize"])

Result: `["architecture", "IDE", "Chat", "Optimize"]`

## Component Architecture (Reuse Existing)

### 1. Existing Components (No Changes)

- **`PromptPage`**: Individual prompt display
- **`PromptBrowser`**: Category and search listing
- **`TagPage`**: Tag-based prompt listing
- **`PromptCard`**: Reusable prompt preview component

### 2. New Processing Components

- **`MarkdownProcessor`**: Build-time file processing
- **`UnifiedIndex`**: Combines API + markdown data
- **`BuildTimeValidator`**: Validates markdown content

### 3. Data Layer Updates

- **Extend existing actions**: Update search/browse actions to use unified index
- **Remove prompt form**: Delete create/edit prompt functionality
- **Update sitemap**: Generate from unified index instead of API
- **Maintain existing data contracts**: All components receive standard `Prompt[]` arrays

## Implementation Approach

### Phase 1: Build-Time Processing

1. Create markdown processing utilities
2. Build unified prompt index at build time
3. Validate markdown content and prevent slug collisions

### Phase 2: Integration

1. Update existing data actions to use unified index
2. Update sitemap generation
3. Remove prompt form components

### Phase 3: Testing

1. Test existing components with markdown data
2. Verify interaction tracking still works
3. Test search and filtering with unified data

## Performance Considerations

### Build Time Optimizations

- **Parallel Processing**: Process markdown files concurrently
- **Validation**: Fail fast on invalid content
- **Caching**: Cache processed content between builds
- **Index Serialization**: Serialize search indexes to JSON for fast runtime loading
- **Incremental Processing**: Only reprocess changed markdown files

### Runtime Optimizations

- **Static Generation**: All pages pre-generated at build time
- **Unified Index**: Single data source for all prompt operations
- **Pre-built Search Index**: Client-side search using pre-computed indexes
- **Existing Optimizations**: Leverage all current performance features

### Build Time Process Flow

```typescript
// Build-time processing pipeline
async function buildPromptIndex(): Promise<PromptIndex> {
  // 1. Process markdown files
  const markdownPrompts = await processMarkdownFiles();

  // 2. Build search indexes
  const searchIndex = buildSearchIndex(markdownPrompts);

  // 3. Generate category/tag indexes
  const tagIndex = buildTagIndex(markdownPrompts);
  const categoryIndex = buildCategoryIndex(markdownPrompts);

  return {
    prompts: markdownPrompts,
    searchIndex,
    tagIndex,
    categoryIndex,
    metadata: {
      totalCount: markdownPrompts.length,
      lastBuildTime: new Date().toISOString(),
    },
  };
}
```

## Error Handling

### Build Time Errors

- **Invalid Frontmatter**: Clear error messages with file location
- **Missing Required Fields**: Specific field validation errors
- **Malformed Markdown**: Graceful handling with warnings

### Runtime Errors

- **Existing Error Handling**: Reuse all current error boundaries and handling
