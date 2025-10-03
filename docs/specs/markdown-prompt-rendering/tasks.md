# Implementation Plan

- [ ] 1. Setup content directory structure and templates
  - Create `content/prompts/` directory with category subdirectories (`aws/`, `nextjs/`, `general/`)
  - Create `templates/prompt-template.md` with example frontmatter and content structure
  - Add `.gitkeep` files to maintain empty directories
  - Update `.gitignore` to include content directory in version control
  - _Requirements: 1.1, 1.2, 1.3, 10.1, 10.2, 10.3_

- [ ] 2. Implement markdown processing utilities
  - Install required dependencies (`gray-matter`, `remark`, `rehype`)
  - Create `lib/markdown/types.ts` with TypeScript interfaces for frontmatter and processed content
  - Implement `lib/markdown/parser.ts` for frontmatter extraction and validation
  - Create `lib/markdown/processor.ts` for content parsing and section extraction
  - Add slug generation utility with URL-safe conversion
  - _Requirements: 2.1, 2.2, 3.1, 3.2, 4.1, 4.2, 5.1_

- [ ] 3. Build content discovery and indexing system
  - Implement file system scanning for `.md` files in content directory
  - Create build-time content processing pipeline
  - Generate searchable metadata index from processed prompts
  - Implement category tag auto-assignment from directory structure
  - Add content validation with clear error messages for missing required fields
  - _Requirements: 1.4, 2.3, 2.4, 3.3, 3.4, 6.3, 6.4_

- [ ] 4. Implement API integration for interaction tracking
  - Create API sync logic to create/update prompt records using slug as identifier
  - Implement build-time API record synchronization for markdown prompts
  - Add interaction tracking integration (download/copy mutations)
  - Ensure API record consistency when markdown prompts are updated
  - Combine markdown metadata with API interaction data for display
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 5. Implement tag system integration
  - Create tag merging logic to combine directory tags with frontmatter tags
  - Update tag indexing to include markdown-based prompts
  - Modify tag page data sources to include markdown prompts
  - Ensure tag counts include markdown-based prompts
  - Maintain existing `/tag/{tagName}` URL structure compatibility
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ] 6. Create static page generation for individual prompts
  - Implement `generateStaticParams` for prompt pages using processed markdown files
  - Create dynamic route `app/prompts/prompt/[slug]/page.tsx` (maintaining existing URL structure)
  - Build prompt page component with markdown rendering
  - Implement proper content section display (prompt content and how-to sections)
  - Add metadata generation for SEO with proper title tags and meta descriptions
  - _Requirements: 4.3, 5.2, 5.3, 6.1, 6.2_

- [ ] 7. Update sitemap generation for SEO
  - Modify `app/sitemap.ts` to include markdown-based prompts
  - Generate sitemap entries during build process from processed markdown files
  - Include tag pages that contain markdown-based prompts in sitemap
  - Include lastModified dates from git history for each prompt
  - Set appropriate priority levels for prompt and tag pages
  - _Requirements: 6.1, 6.2_

- [ ] 8. Update search and filtering functionality
  - Modify search actions to use combined data source (API + markdown)
  - Update filtering logic to include directory-based and frontmatter tags
  - Implement sorting by title, author, and creation date from git history
  - Update search results component to work with mixed data sources
  - Add empty state handling for no search results
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [ ] 9. Update prompt browsing and listing pages
  - Update `app/prompts/page.tsx` to use combined data source (API + markdown)
  - Modify prompt card components to display both API and markdown-based prompt data
  - Update category filtering to use directory structure
  - Update all prompt-related navigation and links to use existing URL structure
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [ ] 10. Update testing suite
  - Create unit tests for markdown processing utilities
  - Add integration tests for content discovery and indexing
  - Test static page generation with sample markdown files
  - Add tests for combined data source functionality (API + markdown)
  - Add end-to-end tests for prompt browsing and search functionality
  - Test sitemap generation includes all markdown prompts and tag pages
  - Test tag page integration with markdown prompts
  - Test API integration for interaction tracking
  - _Requirements: 2.4, 6.4, 7.5, 8.4, 9.1_

- [ ] 11. Documentation and deployment preparation
  - Update README with new content management workflow
  - Create contributor guide for adding new prompts via markdown
  - Document frontmatter schema and content structure requirements
  - Add development setup instructions for content directory
  - Prepare deployment configuration for static site generation
  - _Requirements: 10.4_
