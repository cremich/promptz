# Design Document

## Architecture Overview

The markdown-based prompt rendering system will replace the current API-driven approach with a static site generation model. This design leverages Next.js's build-time file system operations to process markdown files and generate static pages.

## System Components

### 1. Content Processing Pipeline

```
content/prompts/*.md → Frontmatter Parser → Content Processor → Static Pages
                    ↓
                 Metadata Index → Search Index → Browse Pages
```

### 2. Directory Structure

```
promptz/
├── content/
│   └── prompts/
│       ├── aws/
│       │   ├── lambda-best-practices.md
│       │   └── s3-optimization.md
│       ├── nextjs/
│       │   ├── routing-patterns.md
│       │   └── performance-tips.md
│       └── general/
│           └── code-review-checklist.md
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
3. **Content Processing**: Parse markdown content into structured sections
4. **API Sync**: Create/update API records for interaction tracking
5. **Validation**: Ensure required fields and proper structure
6. **Index Generation**: Create searchable metadata index
7. **Static Generation**: Generate individual prompt pages

#### Runtime Rendering

1. **Page Requests**: Serve pre-generated static pages
2. **Interaction Tracking**: Use existing API mutations for downloads/copies
3. **Search Queries**: Query pre-built search index with API interaction data
4. **Navigation**: Use file-based routing for categories

## Technical Implementation

### 1. Frontmatter Schema

```typescript
interface PromptFrontmatter {
  title: string; // Required: Display name
  slug?: string; // Optional: Auto-generated from title
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
tags: ["serverless", "performance"]
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

### 3. File Processing Logic

```typescript
interface ProcessedPrompt {
  metadata: PromptFrontmatter;
  content: string; // Main prompt content
  howto?: string; // How-to section content
  category: string; // Derived from directory
  slug: string; // Final slug for URL
  filePath: string; // Source file path
}
```

### 4. URL Structure

- **Individual Prompts**: `/prompts/prompt/{slug}` (maintains existing SEO structure)
- **Tag Pages**: `/tag/{tagName}` (maintains existing SEO structure for tag-based browsing)
- **Category Browse**: `/prompts?category={category}`
- **Search Results**: `/prompts?query={search}`
- **Tag Filter**: `/prompts?tags[]={tag}`

## Tag System Integration

### 1. Tag Sources

- **Directory Tags**: Automatically assigned from content directory structure (e.g., `aws/`, `nextjs/`)
- **Frontmatter Tags**: Additional tags specified in markdown frontmatter
- **Tag Merging**: Combine directory and frontmatter tags for comprehensive tagging

### 2. Tag Page Compatibility

- **Existing Tag Pages**: Maintain `/tag/{tagName}` URL structure for SEO
- **Mixed Content**: Tag pages will display both API-based and markdown-based prompts during transition
- **Tag Index**: Update tag indexing to include markdown-based prompts
- **Tag Counts**: Ensure tag counts include markdown prompts

### 3. Tag Processing Pipeline

```typescript
interface TaggedPrompt {
  // ... other fields
  allTags: string[]; // Combined directory + frontmatter tags
  primaryTag: string; // Directory-based category tag
  additionalTags: string[]; // Frontmatter-specified tags
}
```

## SEO and Discoverability

### 1. URL Structure Preservation

- **Maintain existing URLs**: `/prompts/prompt/{slug}` to preserve SEO rankings
- **Redirect handling**: Ensure any category-based URLs redirect to maintain link equity
- **Canonical URLs**: Set proper canonical tags for all prompt pages

### 2. Sitemap Integration

- **Dynamic sitemap generation**: Include all markdown-based prompts in `sitemap.ts`
- **Tag page sitemap**: Include tag pages that contain markdown-based prompts
- **Build-time sitemap**: Generate sitemap entries during static generation
- **Metadata inclusion**: Include lastModified dates from git history
- **Priority settings**: Set appropriate priority levels for prompt and tag pages

### 3. Metadata Optimization

- **Title tags**: Use prompt title with site branding
- **Meta descriptions**: Use prompt description for search snippets
- **Open Graph**: Generate OG tags for social media sharing
- **JSON-LD**: Include structured data for rich snippets

## Component Architecture

### 1. Core Processing Components

- **`MarkdownProcessor`**: Main orchestrator for file processing
- **`FrontmatterParser`**: Extracts and validates metadata
- **`ContentParser`**: Processes markdown content into sections
- **`SlugGenerator`**: Creates URL-safe slugs from titles
- **`IndexBuilder`**: Generates search and browse indexes

#### Slug Generation Logic

```typescript
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .trim()
    .replace(/\s+/g, "-") // Spaces to hyphens
    .replace(/-+/g, "-"); // Multiple hyphens to single
}

// Priority: frontmatter slug > auto-generated from title > filename
// Build-time validation ensures no duplicate slugs across all prompts
```

### 2. Page Components

- **`PromptPage`**: Individual prompt display
- **`PromptBrowser`**: Category and search listing
- **`TagPage`**: Tag-based prompt listing (existing component to be updated)
- **`PromptCard`**: Reusable prompt preview component

### 3. Utility Components

- **`MarkdownRenderer`**: Renders processed markdown content
- **`TagManager`**: Handles tag merging and display
- **`SearchProvider`**: Client-side search functionality

## Implementation Approach

### Phase 1: Infrastructure Setup

1. Create content directory structure
2. Implement markdown processing pipeline
3. Build template system

### Phase 2: Integration

1. Implement static page generation for markdown prompts
2. Update search and filtering to include markdown content
3. Integrate with existing tag system
4. Update sitemap generation

### Phase 3: Testing and Documentation

1. Comprehensive testing suite
2. Update documentation
3. Deploy to production

## Performance Considerations

### Build Time Optimizations

- **Parallel Processing**: Process markdown files concurrently
- **Incremental Builds**: Only reprocess changed files
- **Caching**: Cache processed content between builds
- **Validation**: Fail fast on invalid content

### Runtime Optimizations

- **Static Generation**: All pages pre-generated at build time
- **Search Index**: Pre-built client-side search index
- **Image Optimization**: Optimize any embedded images
- **Code Splitting**: Lazy load non-critical components

## Error Handling

### Build Time Errors

- **Invalid Frontmatter**: Clear error messages with file location
- **Missing Required Fields**: Specific field validation errors
- **Duplicate Slugs**: Conflict detection and resolution
- **Malformed Markdown**: Graceful handling with warnings

### Runtime Errors

- **Missing Pages**: 404 handling with suggestions
- **Search Failures**: Fallback to basic filtering
- **Rendering Errors**: Error boundaries with recovery options

## Security Considerations

### Content Security

- **Markdown Sanitization**: Prevent XSS in user content
- **URL Validation**: Validate external links in sourceURL
- **File Path Security**: Prevent directory traversal attacks
- **Content Validation**: Ensure only valid markdown files are processed

### Access Control

- **Public Content**: All markdown-based prompts are public
- **Author Attribution**: Maintain author information for accountability
- **Source Tracking**: Track content origin through git history
