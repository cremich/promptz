# Contributing to Promptz.dev

Thank you for your interest in contributing to Promptz.dev! We welcome contributions that help improve the platform and expand the AI-assisted development community.

## Types of Contributions

There are two main ways to contribute to Promptz.dev:

### 1. Content Contributions
Add AI development resources to our integrated content libraries.

### 2. Website Contributions
Improve the platform itself through code contributions.

---

## Content Contributions

Content contributions involve adding prompts, steering documents, custom agents, agent hooks, or Kiro powers to our integrated libraries.

### Contributing to Promptz.lib (Community Library)

The [promptz.lib](https://github.com/cremich/promptz.lib) repository accepts raw Kiro files from your `.kiro` folders.

**What you can contribute:**
- **Steering Documents** - Markdown files with development standards and guidelines
- **Prompts** - Reusable AI instructions for specific tasks
- **Agent Hooks** - `.hook` JSON configuration files for IDE automation
- **Custom Agents** - Agent configurations with optional system prompts
- **Kiro Powers** - Complete power bundles as defined by Kiro

**How to contribute:**
1. Fork the [promptz.lib repository](https://github.com/cremich/promptz.lib)
2. Add your files from your `.kiro` folder (global or workspace-specific) to the appropriate directory:
   - `steering/` for steering documents
   - `prompts/` for AI prompts
   - `hooks/` for agent hooks
   - `agents/` for custom agents
   - `powers/` for Kiro powers
3. Create a pull request with a descriptive title and description
4. Once merged, your content will automatically appear on promptz.dev

**File Sources:**
Your contributions typically come from:
- **Global Kiro folder**: `~/.kiro/` (user-wide configurations)
- **Workspace Kiro folder**: `<project>/.kiro/` (project-specific configurations)

For detailed guidelines, see the [promptz.lib CONTRIBUTING.md](https://github.com/cremich/promptz.lib/blob/main/CONTRIBUTING.md).

### Contributing to Official Kiro Powers

The official Kiro Powers library has a structured submission process.

**How to contribute:**
Visit [https://kiro.dev/powers/submit/](https://kiro.dev/powers/submit/) for the complete submission guidelines and requirements.

---

## Website Contributions

Website contributions help improve the Promptz.dev platform itself.

### Types of Website Contributions

1. **Bug Fixes** - Fix issues with the website functionality
2. **New Features** - Add new capabilities to the platform
3. **Additional Libraries** - Integrate new content libraries as git submodules
4. **Performance Improvements** - Optimize build processes, search, or UI performance
5. **Documentation** - Improve developer documentation and guides

### Development Setup

1. **Fork and clone the repository:**
```bash
git clone --recursive https://github.com/your-username/promptz.dev.git
cd promptz.dev
```

2. **Install dependencies:**
```bash
npm install
```

3. **Initialize submodules** (if not cloned with `--recursive`):
```bash
git submodule update --init --recursive
```

4. **Start development server:**
```bash
npm run dev
```

### Development Workflow

1. **Create a feature branch:**
```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes** following our coding standards:
   - Follow TypeScript strict mode requirements
   - Use established naming conventions (kebab-case for files, PascalCase for components)
   - Write tests for new functionality
   - Follow security best practices

3. **Test your changes:**
```bash
npm run test           # Run tests
npm run lint           # Check code quality
npm run build          # Ensure build succeeds
```

4. **Commit your changes:**
```bash
git commit -m "feat: add your feature description"
```
Use [conventional commit format](https://www.conventionalcommits.org/) for commit messages.

5. **Push and create a pull request:**
```bash
git push origin feature/your-feature-name
```

### Adding New Content Libraries

To integrate additional content libraries as git submodules:

1. **Add the submodule:**
```bash
git submodule add <repository-url> libraries/<library-name>
```

2. **Update the build scripts** in `scripts/generate-library-data.ts` to process the new library

3. **Add content type support** if the library introduces new content types

4. **Update documentation** to reflect the new library

### Code Quality Standards

- **TypeScript**: Strict mode enabled, comprehensive type definitions
- **Testing**: Unit tests with Jest and React Testing Library
- **Linting**: ESLint with Next.js and TypeScript configurations
- **Formatting**: Prettier with automated formatting on commit
- **Performance**: Server Components by default, Client Components only when needed

### Architecture Guidelines

- **Next.js 16 App Router** - Use Server Components by default
- **Build-time Processing** - Content processed during build for optimal performance
- **Type Safety** - Union types for cross-content operations
- **Error Handling** - Graceful degradation for missing or corrupted content

---

## Pull Request Guidelines

### For All Contributions

1. **Descriptive Title** - Clearly describe what your PR does
2. **Detailed Description** - Explain the changes and their purpose
3. **Testing** - Ensure all tests pass and add new tests for new functionality
4. **Documentation** - Update relevant documentation for your changes

### Review Process

1. **Automated Checks** - All PRs must pass automated tests and linting
2. **Code Review** - Maintainers will review your code for quality and consistency
3. **Testing** - Changes will be tested in a staging environment
4. **Merge** - Approved PRs will be merged and deployed automatically

---

## Getting Help

- **Issues** - Use GitHub issues for bug reports and feature requests
- **Discussions** - Use GitHub discussions for questions and community support
- **Documentation** - Check the README and inline code documentation

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you agree to uphold this code.

## License

By contributing to Promptz.dev, you agree that your contributions will be licensed under the same license as the project (MIT License).

---

Thank you for contributing to the AI-assisted development community! 🚀