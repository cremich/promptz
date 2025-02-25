# Technical Context: Promptz

## Technology Stack

### Frontend

- **Framework**: Next.js 15.1.0
- **UI Library**: React 19.0.0
- **Styling**: Tailwind CSS 3.4.1
- **Component Library**: Custom components with Radix UI primitives
- **Form Handling**: React Hook Form 7.54.2 with Zod 3.24.2 validation
- **Notifications**: Sonner 1.7.4
- **Theming**: next-themes 0.4.4

### Backend

- **Cloud Provider**: AWS
- **Infrastructure as Code**: AWS Amplify Gen 2 with CDK
- **Authentication**: Amazon Cognito
- **API**: AWS AppSync (GraphQL)
- **Database**: Amazon DynamoDB
- **Functions**: AWS Lambda (Node.js)

### Development Tools

- **Language**: TypeScript 5.6.3
- **Package Manager**: npm
- **Linting**: ESLint 9 with Next.js and Prettier configurations
- **Testing**: Jest 29.7.0 with React Testing Library 16.2.0
- **Commit Standards**: Commitizen with Conventional Commits
- **Code Formatting**: Prettier 3.4.2
- **Git Hooks**: Husky 9.1.7 with lint-staged

## Development Environment

### Prerequisites

- Node.js v14.x or later
- npm v6.14.4 or later
- git v2.14.1 or later
- AWS account with appropriate permissions
- AWS CLI configured for local development

### Local Setup

1. Clone repository: `git clone https://github.com/cremich/promptz.git`
2. Install dependencies: `npm i`
3. Configure AWS credentials for Amplify
4. Deploy sandbox environment: `npm run sandbox`
5. Start development server: `npm run dev`

### Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build production version
- `npm run start`: Start production server
- `npm run lint`: Run ESLint
- `npm run test`: Run Jest tests
- `npm run pr`: Run lint and tests (for pull requests)
- `npm run sandbox`: Deploy sandbox environment

## Project Structure

```
promptz/
├── amplify/               # AWS Amplify configuration
│   ├── auth/              # Authentication resources
│   ├── data/              # Data models and API
│   └── functions/         # Lambda functions
├── app/                   # Next.js app router
│   ├── (auth)/            # Authentication routes
│   ├── lib/               # Shared utilities and data access
│   ├── prompt/            # Prompt-related pages
│   └── ui/                # UI components
├── components/            # Shared React components
│   └── ui/                # UI component library
├── lib/                   # Utility functions
├── public/                # Static assets
└── scripts/               # Utility scripts
```

## Key Technical Decisions

### 1. Next.js App Router

- Chosen for its server component support and improved rendering options
- Enables a mix of static, server-rendered, and client components
- Provides built-in API routes and middleware support

### 2. AWS Amplify Gen 2

- Selected for streamlined AWS service integration
- TypeScript-first approach with improved developer experience
- Better separation of frontend and backend code
- Infrastructure as code using CDK constructs

### 3. GraphQL with AppSync

- Provides flexible data querying capabilities
- Real-time data with subscriptions when needed
- Strong typing with schema definition
- Direct integration with DynamoDB

### 4. Authentication Strategy

- Amazon Cognito for user management
- Custom UI components for auth flows
- JWT token-based authentication
- Post-authentication Lambda triggers for user setup

### 5. Component Architecture

- Atomic design principles
- Clear separation between UI and business logic
- Comprehensive test coverage for components
- Reusable patterns across the application

## Technical Constraints

### 1. AWS Ecosystem Integration

- All services must integrate well with AWS
- Authentication must use Cognito
- Data storage must use DynamoDB

### 2. Performance Requirements

- Initial page load under 2 seconds
- Time to interactive under 3 seconds
- Optimized bundle sizes
- Efficient data fetching patterns

### 3. Security Requirements

- HTTPS for all communications
- Proper authentication and authorization
- Input validation for all user inputs
- Protection against common web vulnerabilities

### 4. Scalability Considerations

- DynamoDB capacity planning
- AppSync request throttling
- Lambda concurrency limits
- CDN for static assets

## Dependencies and External Services

### Core Dependencies

- AWS Amplify libraries for backend integration
- Next.js for frontend framework
- React for UI components
- Tailwind CSS for styling
- Zod for validation

### External Services

- AWS Amplify hosting
- Amazon Cognito for authentication
- AWS AppSync for GraphQL API
- Amazon DynamoDB for data storage
- AWS Lambda for serverless functions

## Deployment Strategy

### Environments

- Development: Local development environment
- Sandbox: Isolated testing environment in AWS
- Production: Live environment

### CI/CD Pipeline

- GitHub Actions for continuous integration
- Automated testing before deployment
- Amplify for continuous deployment
- Environment-specific configurations

### Monitoring and Logging

- CloudWatch for logs and metrics
- X-Ray for distributed tracing (production only)
- Error tracking and reporting
