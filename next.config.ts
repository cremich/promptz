import type { NextConfig } from "next";
import createMDX from '@next/mdx';

const nextConfig: NextConfig = {
  // Enable Cache Components for optimal performance
  cacheComponents: true,
  
  // Configure pageExtensions to include MDX files
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
  
  async redirects() {
    return [
      // Main navigation redirects - rules are now called "steering"
      {
        source: '/rules',
        destination: '/steering',
        permanent: true,
      },
      {
        source: '/whats-new',
        destination: '/',
        permanent: true,
      },
      {
        source: '/categories',
        destination: '/',
        permanent: true,
      },
      {
        source: '/tags',
        destination: '/',
        permanent: true,
      },
      {
        source: '/authors',
        destination: '/',
        permanent: true,
      },
      
      // Individual prompt redirects from old nested structure to new slug format
      {
        source: '/prompts/analysis/automated-code-review/:path*',
        destination: '/prompts/promptz-prompt-automated-code-review',
        permanent: true,
      },
      {
        source: '/prompts/general/conventional-commit-messages/:path*',
        destination: '/prompts/promptz-prompt-conventional-commit-messages',
        permanent: true,
      },
      {
        source: '/prompts/architecture/generate-drawio-architecture-diagram-from-code/:path*',
        destination: '/prompts/promptz-prompt-generate-drawio-architecture-diagram-from-code',
        permanent: true,
      },
      {
        source: '/prompts/persona/independent-thought-challenger/:path*',
        destination: '/prompts/promptz-prompt-independent-thought-challenger',
        permanent: true,
      },
      {
        source: '/prompts/analysis/refactor-like-a-pro-improve-your-java17-code/:path*',
        destination: '/prompts/promptz-prompt-refactor-like-a-pro-improve-your-java17-code',
        permanent: true,
      },
      {
        source: '/prompts/scaffolding/setup-workspace-rules/:path*',
        destination: '/prompts/promptz-prompt-setup-workspace-rules',
        permanent: true,
      },
      {
        source: '/prompts/ai-development/responsible-ai-checker/:path*',
        destination: '/prompts/promptz-prompt-responsible-ai-checker',
        permanent: true,
      },
      {
        source: '/prompts/general/configura-o-de-contexto-inteligente-amazonq/:path*',
        destination: '/prompts/promptz-prompt-configura-o-de-contexto-inteligente-amazonq',
        permanent: true,
      },
      
      // Rules → Steering redirects from old nested structure to new slug format
      {
        source: '/rules/general/amazon-q-learning-files/:path*',
        destination: '/steering/promptz-steering-amazon-q-learning-files',
        permanent: true,
      },
      {
        source: '/rules/cdk/cdk-project-structure/:path*',
        destination: '/steering/promptz-steering-cdk-project-structure',
        permanent: true,
      },
      {
        source: '/rules/general/kiro-specs/:path*',
        destination: '/steering/promptz-steering-kiro-specs',
        permanent: true,
      },
      {
        source: '/rules/general/project-intelligence/:path*',
        destination: '/steering/promptz-steering-project-intelligence',
        permanent: true,
      },
      {
        source: '/rules/python/python-programming-rules/:path*',
        destination: '/steering/promptz-steering-python-programming-rules',
        permanent: true,
      },
      {
        source: '/rules/typescript/typescript-tdd-behavioural-test-specifications/:path*',
        destination: '/steering/promptz-steering-typescript-tdd-behavioural-test-specifications',
        permanent: true,
      },
      {
        source: '/rules/mobile/mobile-testing-automation/:path*',
        destination: '/steering/promptz-steering-mobile-testing-automation',
        permanent: true,
      },
      
      // Agents redirects from old nested structure to new slug format
      {
        source: '/agents/engineering/kiro-specs-agent/:path*',
        destination: '/agents/promptz-agent-kiro-specs-agent',
        permanent: true,
      },
      {
        source: '/agents/engineering/project-intelligence-agent/:path*',
        destination: '/agents/promptz-agent-project-intelligence-agent',
        permanent: true,
      },
      {
        source: '/agents/engineering/system-intelligence-agent/:path*',
        destination: '/agents/promptz-agent-system-intelligence-agent',
        permanent: true,
      },
      {
        source: '/agents/engineering/enterprise-architect-partnet/:path*',
        destination: '/agents/promptz-agent-enterprise-architect-partnet',
        permanent: true,
      },
      {
        source: '/agents/testing/airtest-project-generator/:path*',
        destination: '/agents/promptz-agent-airtest-project-generator',
        permanent: true,
      },
    ];
  },
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [
      // Use string format for Turbopack compatibility
      'remark-gfm',
    ],
    rehypePlugins: [],
  },
});

export default withMDX(nextConfig);
