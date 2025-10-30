# Promptz

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=for-the-badge)](http://commitizen.github.io/cz-cli/)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg?style=for-the-badge)](./CODE_OF_CONDUCT.md)

Promptz is the ultimate library for Amazon Q Developer, designed to help developers discover, create, and perfect their prompts, project rules, and custom agents for every step of the software development lifecycle.

## Table of Contents

- [About Promptz v2](#-about-promptz-v2)
- [Getting Started](#-getting-started)
- [Contributing Content](#-contributing-content)
- [Development](#-development)
- [Contributing](#contributing)
- [License](#license)

## 🚀 About Promptz v2

Promptz v2 is a complete rewrite as a Hugo-based static website, moving away from the previous Next.js application. This new architecture provides:

- **Git-based content management** - All content is managed through markdown files and GitHub pull requests
- **Static site performance** - Lightning-fast loading with Hugo's static site generation
- **Modern dark theme** - Built with Basecoat CSS and Tailwind for a developer-focused experience
- **Advanced search** - Powered by Pagefind for instant content discovery
- **Three content types**:
  - **Prompts** - AI instructions for specific development tasks
  - **Project Rules** - Coding standards and development guidelines
  - **Custom Agents** - Specialized AI assistants for workflows

## 🏃 Getting Started

### Prerequisites

- Hugo Extended v0.112.0 or later
- Node.js v18.x or later
- npm v8.x or later
- Git v2.14.1 or later

### Local Development

1. **Clone the repository**:

   ```bash
   git clone https://github.com/cremich/promptz.git
   cd promptz
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start the development server**:

   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to `http://localhost:1313`

### Project Structure

```
promptz/
├── content/           # Markdown content organized by type
│   ├── prompts/      # AI prompts for development tasks
│   ├── rules/        # Project rules and coding standards
│   └── agents/       # Custom agent configurations
├── layouts/          # Hugo templates and layouts
├── assets/           # CSS, JavaScript, and other assets
├── static/           # Static files (images, icons)
├── templates/        # Content templates for contributors
└── docs/specs/       # Technical specifications
```

## 📝 Contributing Content

Promptz v2 uses a git-based workflow where all content is managed through markdown files and GitHub pull requests. No authentication or complex setup required!

### Quick Start for Contributors

1. **Fork the repository** on GitHub
2. **Choose your content type**:
   - **Prompts** - Instructions for Amazon Q Developer
   - **Project Rules** - Development standards and guidelines
   - **Custom Agents** - Specialized AI assistant configurations
3. **Use the templates** in the `templates/` directory
4. **Submit a pull request**

### Content Types

#### Prompts

AI instructions organized by category:

- `analysis/` - Code review, security, optimization
- `architecture/` - System design, diagrams
- `aws/` - AWS-specific tasks
- `code-generation/` - Scaffolding, boilerplate
- `documentation/` - ADRs, specs, docs
- `testing/` - Unit tests, QA processes
- And more...

#### Project Rules

Development standards organized by technology:

- `nextjs/` - Next.js best practices
- `typescript/` - TypeScript standards
- `security/` - Security guidelines
- `testing/` - Testing practices
- And more...

#### Custom Agents

Specialized AI assistants organized by function:

- `documentation/` - Doc generation agents
- `engineering/` - Development assistants
- `testing/` - QA automation agents
- And more...

### Content Guidelines

All content uses structured frontmatter and follows validation rules:

```yaml
---
title: "Your Content Title"
description: "Brief description"
categories: ["category-name"]
tags: ["CLI", "Chat", "IDE"]
draft: false
---
```

For detailed contribution guidelines, see [CONTRIBUTING.md](CONTRIBUTING.md).

## 🛠 Development

### Available Scripts

- `npm run dev` - Start Hugo development server
- `npm run build` - Build the static site
- `npm run build:search` - Build search index with Pagefind
- `npm run validate` - Validate content and frontmatter
- `npm run lint:content` - Check content quality

### Architecture

Promptz v2 is built with:

- **Hugo** - Static site generator with fast builds
- **Tailwind CSS** - Utility-first CSS framework
- **Basecoat CSS** - Shadcn/ui-compatible components for Hugo
- **Pagefind** - Static search without external dependencies
- **GitHub Actions** - Automated validation and deployment
- **GitHub Pages** - Static hosting with custom domain

### Content Validation

All content is automatically validated for:

- Required frontmatter fields
- File naming conventions
- Content structure and security
- Markdown syntax

### Deployment

The site automatically deploys to GitHub Pages when changes are pushed to the main branch. The deployment includes:

- Hugo site build
- Tailwind CSS compilation
- Pagefind search index generation
- Asset optimization

## Contributing

We welcome contributions to Promptz! Please see our [Contributing Guidelines](CONTRIBUTING.md) for more information on how to get started.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Learn More

To learn more about the technologies used in this project, check out the following resources:

- [Hugo Documentation](https://gohugo.io/documentation/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Basecoat CSS Documentation](https://basecoat.dev/)
- [Pagefind Documentation](https://pagefind.app/)
