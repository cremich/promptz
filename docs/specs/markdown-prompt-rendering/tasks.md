# Implementation Plan

- [x] 1. Setup content directory structure and templates
  - Create `content/prompts/` directory with purpose-based subdirectories (`architecture/`, `code-generation/`, `documentation/`, `testing/`, `analysis/`, `aws/`, `scaffolding/`, `spec-driven-development/`, `solutions/`, `persona/`, `general/`)
  - Create `templates/prompt-template.md` with example frontmatter and content structure
  - Add `.gitkeep` files to maintain empty directories
  - Update `.gitignore` to include content directory in version control
  - _Requirements: 1.1, 1.2, 1.3, 10.1, 10.2, 10.3_

- [x] 2. Implement markdown processing utilities
  - Install required dependencies (`gray-matter`, `remark`, `rehype`)
  - Create `lib/markdown/types.ts` with TypeScript interfaces for frontmatter and processed content
  - Implement `lib/markdown/parser.ts` for frontmatter extraction and validation
  - Create `lib/markdown/processor.ts` for content parsing and section extraction
  - Add slug generation utility (derive from filename)
  - _Requirements: 2.1, 2.2, 3.1, 3.2, 4.1, 4.2, 5.1_

- [x] 3. Build prompt index at build time
  - Implement file system scanning for `.md` files in content directory
  - Create build-time content processing pipeline that converts markdown to existing Prompt model
  - Generate search index from markdown prompts only
  - Implement purpose category tag auto-assignment from directory structure
  - Add content validation with clear error messages for missing required fields
  - _Requirements: 1.4, 2.3, 2.4, 3.3, 3.4, 6.3, 6.4_

- [ ] 4. Update existing data actions to use markdown index
  - Modify existing prompt fetching actions to use markdown index instead of API
  - Update search functionality to work with markdown data source
  - Update filtering and browsing to include markdown prompts
  - Ensure existing PromptCard and PromptPage components work with markdown data
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [ ] 5. Update prompt pages to render markdown content
  - Modify `app/prompts/prompt/[slug]/page.tsx` to handle markdown prompts
  - Implement `generateStaticParams` for markdown-based prompts
  - Add metadata generation for SEO with proper title tags and meta descriptions
  - Ensure interaction tracking (downloads/copies) works for markdown prompts
  - _Requirements: 4.3, 5.2, 5.3, 6.1, 6.2, 7.2, 7.3_

- [ ] 6. Update tag system integration
  - Modify existing tag pages to include markdown-based prompts
  - Update tag indexing to include markdown prompts with combined directory + frontmatter tags
  - Ensure tag counts include markdown-based prompts
  - Maintain existing `/tag/{tagName}` URL structure compatibility
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ] 7. Update sitemap generation
  - Modify `app/sitemap.ts` to include markdown-based prompts instead of API prompts
  - Generate sitemap entries from markdown index during build process
  - Include tag pages that contain markdown-based prompts in sitemap
  - Include lastModified dates from git history for each prompt
  - Set appropriate priority levels for prompt and tag pages
  - _Requirements: 6.1, 6.2_

- [ ] 8. Update prompt browsing and listing pages
  - Update `app/prompts/page.tsx` to use markdown index instead of API
  - Modify prompt listing components to display markdown-based prompt data
  - Update category filtering to use directory structure
  - Update homepage prompt counters to use markdown index
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [ ] 9. Remove prompt form functionality
  - Delete `app/prompts/create/` directory and create prompt functionality
  - Remove `app/prompts/prompt/[slug]/edit/` directory and edit prompt functionality
  - Update navigation to remove "Create Prompt" links
  - Update documentation to reflect GitHub PR-based contribution workflow
  - _Requirements: Content submission via GitHub PRs only_

- [ ] 10. Implement content creation workflow
  - Create multiple PR templates in `.github/PULL_REQUEST_TEMPLATE/` directory
  - Create `new_prompt.md` template with category guidance and validation checklist
  - Implement GitHub workflow `.github/workflows/validate-prompts.yml`
  - Add prompt validation script with frontmatter, content, and security checks
  - Create unit tests for new prompt validation and build process integration
  - _Requirements: Content creation via GitHub PRs with automated validation_

- [ ] 11. Update testing suite
  - Create unit tests for markdown processing utilities
  - Add integration tests for prompt index functionality
  - Test static page generation with sample markdown files
  - Test that existing components work with markdown data
  - Add end-to-end tests for prompt browsing and search functionality
  - Test sitemap generation includes all markdown prompts and tag pages
  - Test tag page integration with markdown prompts
  - Test interaction tracking for markdown prompts
  - Test content creation workflow and validation
  - _Requirements: 2.4, 6.4, 7.5, 8.4, 9.1_

- [ ] 12. Documentation and deployment preparation
  - Update README with new content management workflow
  - Create contributor guide for adding new prompts via markdown and GitHub PRs
  - Document frontmatter schema and content structure requirements
  - Add development setup instructions for content directory
  - Document validation requirements and security checks
  - Prepare deployment configuration for static site generation
  - _Requirements: 10.4_
