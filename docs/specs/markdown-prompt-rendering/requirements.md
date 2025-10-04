# Requirements Document

## Introduction

This specification defines the implementation of markdown-based prompt rendering for Promptz v2. The goal is to transition from API-based prompt storage to a git-based content management system using markdown files with frontmatter, enabling community contributions through pull requests while maintaining the existing user experience.

## Requirements

### Requirement 1: Content Directory Structure

**User Story:** As a developer, I want to organize prompts in a structured directory hierarchy based on purpose and functionality, so that content is easily discoverable and maintainable.

#### Acceptance Criteria

1. WHEN the application starts THE SYSTEM SHALL read prompts from a `content/prompts/` directory at the repository root
2. WHEN organizing prompts THE SYSTEM SHALL support purpose-based subdirectories (`architecture/`, `code-generation/`, `documentation/`, `testing/`, `analysis/`, `aws/`, `scaffolding/`, `spec-driven-development/`, `solutions/`, `persona/`, `general/`)
3. WHEN a prompt file exists in a category directory THE SYSTEM SHALL automatically assign the directory name as a primary tag
4. WHEN the content directory structure is modified THE SYSTEM SHALL reflect changes after rebuild
5. WHEN users contribute prompts THE SYSTEM SHALL provide clear guidance on directory selection based on prompt purpose and functionality

### Requirement 2: Markdown File Processing

**User Story:** As a content creator, I want to write prompts in markdown format with frontmatter metadata, so that I can use familiar tools and version control workflows.

#### Acceptance Criteria

1. WHEN a markdown file contains valid frontmatter THE SYSTEM SHALL parse and extract metadata
2. WHEN a markdown file has a `.md` extension THE SYSTEM SHALL process it as a prompt
3. WHEN frontmatter is missing required fields THE SYSTEM SHALL provide clear error messages
4. WHEN markdown content is invalid THE SYSTEM SHALL gracefully handle errors and continue processing other files

### Requirement 3: Frontmatter Schema

**User Story:** As a content creator, I want a comprehensive metadata schema that preserves existing tag patterns, so that I can provide necessary information while maintaining backward compatibility.

#### Acceptance Criteria

1. WHEN defining prompt metadata THE SYSTEM SHALL require `title`, `description`, and `author` fields
2. WHEN `slug` is not provided THE SYSTEM SHALL auto-generate it from the title
3. WHEN `tags` are provided THE SYSTEM SHALL merge them with the auto-generated purpose category tag
4. WHEN `sourceURL` is provided THE SYSTEM SHALL validate it as a proper URL
5. WHEN migrating existing prompts THE SYSTEM SHALL preserve existing tag formats for backward compatibility

### Requirement 4: Markdown Content Structure

**User Story:** As a content creator, I want to structure prompt content with clear sections, so that users understand both the prompt and how to use it.

#### Acceptance Criteria

1. WHEN writing prompt content THE SYSTEM SHALL expect a main prompt section
2. WHEN including usage instructions THE SYSTEM SHALL support a "How to Use" section in the markdown
3. WHEN parsing markdown THE SYSTEM SHALL extract both prompt content and howto sections
4. WHEN rendering prompts THE SYSTEM SHALL display both sections appropriately

### Requirement 5: File Naming Convention

**User Story:** As a developer, I want consistent file naming, so that URLs are predictable and SEO-friendly.

#### Acceptance Criteria

1. WHEN creating prompt files THE SYSTEM SHALL use slug-based naming (e.g., `lambda-best-practices.md`)
2. WHEN a file name conflicts with the frontmatter slug THE SYSTEM SHALL prioritize the frontmatter slug
3. WHEN generating URLs THE SYSTEM SHALL use the pattern `/prompts/prompt/{slug}`
4. WHEN file names contain invalid characters THE SYSTEM SHALL provide validation errors

### Requirement 6: Build-Time Processing

**User Story:** As a user, I want fast page loads, so that I can quickly browse and search prompts.

#### Acceptance Criteria

1. WHEN the application builds THE SYSTEM SHALL process all markdown files at build time
2. WHEN generating static pages THE SYSTEM SHALL create individual pages for each prompt
3. WHEN building the prompt index THE SYSTEM SHALL generate searchable metadata
4. WHEN markdown processing fails THE SYSTEM SHALL fail the build with clear error messages

### Requirement 7: API Integration for Interaction Tracking

**User Story:** As a product owner, I want to track downloads and copies of markdown-based prompts, so that I can measure engagement and usage analytics.

#### Acceptance Criteria

1. WHEN a markdown prompt is processed THE SYSTEM SHALL create or update corresponding API records for tracking
2. WHEN users download markdown prompts THE SYSTEM SHALL use existing API mutations to track interactions
3. WHEN users copy markdown prompts THE SYSTEM SHALL use existing API mutations to track interactions
4. WHEN displaying prompt statistics THE SYSTEM SHALL combine markdown metadata with API interaction data
5. WHEN markdown prompts are updated THE SYSTEM SHALL maintain API record consistency

### Requirement 8: Search and Filtering Integration

**User Story:** As a user, I want to search and filter markdown-based prompts alongside existing prompts, so that I can find relevant content quickly from all sources.

#### Acceptance Criteria

1. WHEN searching prompts THE SYSTEM SHALL index markdown content and metadata alongside existing API data
2. WHEN filtering by tags THE SYSTEM SHALL include both directory-based and frontmatter tags
3. WHEN sorting prompts THE SYSTEM SHALL support sorting by title, author, and creation date
4. WHEN no results are found THE SYSTEM SHALL display appropriate empty state messages

### Requirement 9: Tag System Integration

**User Story:** As a user, I want to find markdown-based prompts on existing tag pages, so that I can discover content through the established tag navigation system.

#### Acceptance Criteria

1. WHEN visiting tag pages THE SYSTEM SHALL include markdown-based prompts in tag listings
2. WHEN processing markdown prompts THE SYSTEM SHALL merge directory tags with frontmatter tags
3. WHEN displaying tag counts THE SYSTEM SHALL include counts from markdown-based prompts
4. WHEN generating tag indexes THE SYSTEM SHALL include all markdown prompt tags
5. WHEN maintaining SEO THE SYSTEM SHALL preserve existing `/tag/{tagName}` URL structure

### Requirement 10: Template System

**User Story:** As a content creator, I want prompt templates, so that I can quickly create new prompts with proper structure.

#### Acceptance Criteria

1. WHEN creating new prompts THE SYSTEM SHALL provide templates in the `templates/` directory
2. WHEN using templates THE SYSTEM SHALL include example frontmatter with all supported fields
3. WHEN templates include content structure THE SYSTEM SHALL show proper markdown sections for prompt and howto
4. WHEN documentation is needed THE SYSTEM SHALL include inline comments explaining each field
