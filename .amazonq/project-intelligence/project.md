# Project Overview

## Product Vision

Promptz is the ultimate prompting hub for Amazon Q Developer, designed to help developers discover, create, and perfect their prompts, project rules, and custom agents for every step of the software development lifecycle. The platform serves as a centralized repository where developers can share, discover, and collaborate on high-quality prompts, project rules, and Amazon Q CLI agents specifically tailored for Amazon Q Developer.

## Core Mission

Simplify collaboration with Amazon Q Developer by providing a comprehensive, community-driven platform that reduces friction in developer workflows and enhances productivity through effective AI-assisted development. Promptz aims to become the one-stop shop for all Q Developer capabilities including prompts, project rules, context hooks, and future capabilities that help developers be more efficient.

## Strategic Focus

- **100% Amazon Q Developer Focus**: Exclusively dedicated to Amazon Q Developer capabilities and ecosystem
- **Open Source & Free**: Committed to remaining open-source and free to use forever
- **Community-Driven**: Encouraging collaborative improvement and knowledge sharing
- **Quality Through Usage**: Promoting iterative improvement through community feedback and usage analytics

## Target Users

### Primary Users

- **Software Developers** using Amazon Q Developer in their daily workflow
- **Development Teams** looking to standardize prompting practices
- **DevOps Engineers** seeking automation and deployment prompts
- **Technical Leaders** establishing coding standards and best practices

### Secondary Users

- **AWS Community Builders and AWS Heroes** sharing expertise and best practices
- **Technical Content Creators** documenting and sharing prompt engineering knowledge
- **Enterprise Development Teams** implementing consistent AI-assisted development practices

## Community and Content Quality

### Content Submission

- **Authentication Required**: Only authenticated users can submit prompts and project rules
- **Quality Philosophy**: Encouraging learning and iterative improvement over strict quality gates
- **Community Feedback**: Usage analytics (copy/download counts) provide indirect feedback on content quality
- **No Moderation Policies**: Currently no formal content moderation policies in place

### User Feedback Mechanisms

- **Primary Channel**: GitHub issues for bug reports and feature requests
- **Usage Analytics**: Aggregated copy and download interactions tracked per prompt/rule
- **Indirect Feedback**: Community usage patterns indicate content effectiveness
- **Future Considerations**: Direct feedback mechanisms (comments, ratings) under consideration

### Spam Prevention

- **Authentication Barrier**: Requiring user authentication serves as primary spam prevention
- **Community Self-Regulation**: Reliance on community usage patterns to surface quality content

## User Problems Solved

### Context Switching Reduction

- **Solution**: Direct integration through MCP server allows in-context prompt access

### Prompt Quality Issues

- **Problem**: Developers struggle with ineffective prompts leading to poor AI responses
- **Solution**: Curated, community-tested prompts with proven effectiveness

### Knowledge Fragmentation

- **Problem**: Best practices scattered across blogs, social media, and documentation
- **Solution**: Centralized repository with proper attribution and organization

### Team Consistency

- **Problem**: Teams lack standardized approaches to AI-assisted development
- **Solution**: Shared project rules and team-specific prompt collections

## User Journeys

```mermaid
journey
    title Discovering and Using a Prompt
    section Discovery
      Visit promptz.dev: 5: User
      Search for specific use case: 4: User
      Browse by tags/categories: 4: User
      Find relevant prompt: 5: User
    section Usage
      Read prompt details: 5: User
      Copy prompt to clipboard: 5: User
      Use in Amazon Q Developer: 5: User
```

```mermaid
journey
    title Creating and Sharing Content
    section Authentication
      Sign up/Login: 3: Developer
      Verify email: 3: Developer
      Access promptz.dev: 4: Developer
    section Content Creation
      Navigate to create form: 4: Developer
      Fill prompt/rule/agent details: 4: Developer
      Add tags and metadata: 4: Developer
      Set visibility (public/private): 4: Developer
      Submit for publication: 5: Developer
    section Management
      View personal content: 5: Developer
      Edit existing content: 4: Developer
```

```mermaid
journey
    title Discovering and Using Amazon Q CLI Agents
    section Discovery
      Browse agents section: 5: User
      Search by functionality: 4: User
      Filter by tools/MCP servers: 4: User
      Find relevant agent: 5: User
    section Configuration
      Review agent configuration: 5: User
      Download agent JSON: 5: User
      Install in Q CLI: 4: User
    section Usage
      Use agent in development: 5: User
      Leverage configured tools: 5: User
      Benefit from custom resources: 5: User
```

## Current Development State

### Recently Completed Features

- **Amazon Q Developer CLI Agent Support** (Issue #106): Complete implementation of custom agent creation, management, and sharing with comprehensive configuration options including system prompts, tools, MCP servers, resources, lifecycle hooks, and tool settings
- **Agent Integration with Tag System**: Full integration of agents into the existing tag-based discovery system with many-to-many relationships and SEO optimization
- **Agent E2E Testing Suite**: Comprehensive end-to-end testing coverage for agent creation workflows including minimal configuration, tool configuration, MCP server setup, and resources/hooks configuration
- **UI/UX Consistency Improvements**: Aligned agent detail pages with existing prompt and project rule designs for consistent user experience across all content types
- **EventBridge Archive Configuration** (Issue #118): Implemented EventBridge archive for event replay and audit capabilities with environment-specific retention policies
- **Content Display Improvements** (Issues #111, #112): Enhanced prompt and project rule display consistency with scrollable content and timestamp information
- **Default Sort Order Optimization** (Issue #108): Changed default sort from "Trending" to "Newest" to improve discovery of new content
- **Context Hooks Support** (Issue #101): Added support for Amazon Q CLI context hooks to help developers discover proven context hook commands
- **EventBridge Integration**: Implemented Amazon EventBridge custom event bus with pipeline resolvers for domain event publishing (prompt.saved, prompt.deleted, prompt.copied, projectrule.saved, projectrule.deleted, projectrule.copied, projectrule.downloaded, agent.saved, agent.deleted, agent.copied, agent.downloaded)
- **API Refactoring and Code Organization** (Issues #90, #92, #94): Complete restructuring of server actions, model definitions, and project organization for better maintainability
- **Pipeline Resolvers Architecture**: Refactored AppSync mutations to use two-step pipeline resolvers that combine data operations with event publishing
- **User Data Privacy Protection**: Removed sensitive user data (email, username) from GraphQL API exposure to minimize data exposure and comply with privacy best practices
- **Tag-Based Discoverability** (Issue #93): Enhanced tag system with many-to-many relationships, tag-specific pages, and improved SEO
- **Project Rules Sitemap Integration** (Issue #103): Added project rules to sitemap.xml with separate sitemap files for better search engine indexing
- **Scope Attribute Migration**: Migrated from boolean `public` attribute to enum-based `scope` attribute (PRIVATE/PUBLIC) for better data modeling
- **UI/UX Improvements for prompt visibility** (Issue #98): Better visibility controls and user guidance for prompt/rule visibility toggles

### Active Development (Open Issues)

- **Enhance Login OTP Email Template** (Issue #117): Improve user experience for email-based authentication with better email template design
- **Contributor Dashboard** (Issue #115): Add usage analytics and activity timeline for content creators to track their contributions and engagement
- **AWS WAF Security Enhancement** (Issue #114): Enable AWS WAF for Amplify hosting to enhance security posture
- **Prompt Optimizer with AI Analysis** (Issue #113): AI-powered analysis and suggestions for prompt improvement
- **Download Functionality for Prompts** (Issue #110): Add download functionality to achieve feature parity with project rules
- **Comprehensive Onboarding** (Issue #109): Add onboarding instructions for new users to improve user adoption
- **File Upload with AI Analysis** (Issue #107): Allow file uploads with AI-powered content analysis for automated prompt/rule generation
- **Token Calculation** (Issue #102): Implement approximate token counting for prompts and rules using Anthropic TypeScript Tokenizer
- **MCP Server Listings** (Issue #100): Curated catalog of compatible MCP servers with filtering by use cases and vendors
- **GitHub Integration** (Issue #88): Collaborative updates through GitHub Actions with API hooks for publishing

### Technical Debt and Improvements

- Enhanced search functionality optimization (pagination and caching needed for scalability beyond 20,000 requests/day)
- Performance improvements for large content libraries
- Mobile responsiveness enhancements
- Accessibility compliance improvements
- Rate limiting and usage quotas for public API
- API versioning for GraphQL API
- Automated monitoring alerts and operational runbooks

## Success Metrics

### Primary KPIs

- **Content Creation**: Number of prompts and project rules submitted to the platform
- **Daily Traffic**: Total number of requests per day on promptz.dev (current baseline: <20,000/day)
- **Content Usage**: Prompt and project rule usage derived from copy and download interactions
- **SEO Performance**: SEO impressions, clicks, and search rankings (measured via Google Search Console)

### Secondary Metrics

- **User Engagement**: Monthly active users and user retention rates
- **Content Quality**: Community-driven quality through usage analytics
- **Platform Growth**: Total prompts and rules in library
- **Integration Adoption**: MCP server usage and API access patterns

## Future Roadmap

### Short-term (Next 3 months)

- Complete token calculation feature (Issue #102)
- Implement context hooks support (Issue #101)
- Enhance MCP server catalog (Issue #100)

### Long-term (6+ months)

- Enhanced MCP server capabilities and features
- GitHub integration for collaborative updates (Issue #88)
- Advanced personalization features
- Multi-language support
- Additional Amazon Q Developer capability integrations
