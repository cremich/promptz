# Technical Context

## Technology Stack

### Frontend

- **Framework**: Next.js 14+ (App Router)
- **UI Library**: React 18+
- **Styling**: Tailwind CSS
- **Component Library**: Custom UI components with Shadcn UI
- **Form Management**: React Hook Form
- **State Management**: React Context + Server Components
- **Toast Notifications**: Sonner

### Backend

- **API**: Next.js Server Actions + API Routes
- **Authentication**: AWS Cognito via Amplify
- **Database**: AWS DynamoDB (via Amplify)
- **Storage**: AWS S3 (via Amplify)

### Infrastructure

- **Hosting**: AWS Amplify
- **CI/CD**: GitHub Actions + Amplify Pipeline
- **Monitoring**: AWS CloudWatch

## Development Environment

### Prerequisites

- Node.js (v18+)
- npm or yarn
- AWS Account with Amplify CLI configured

### Local Setup

1. Clone repository
2. Install dependencies (`npm install`)
3. Set up environment variables
4. Run development server (`npm run dev`)

### Environment Variables

- AWS Amplify configuration
- Authentication settings
- API endpoints
- Feature flags

## Build & Deployment

### Build Process

- TypeScript compilation
- Next.js build optimization
- Static asset optimization
- CSS minification

### Deployment Pipeline

1. Code push to repository
2. CI/CD pipeline triggered
3. Tests run
4. Build process
5. Deployment to AWS Amplify

## Testing Framework

- **Unit Testing**: Jest
- **Component Testing**: React Testing Library
- **E2E Testing**: Cypress (if implemented)
- **Test Coverage**: Jest Coverage

## Key Dependencies

### Core Dependencies

- next
- react
- react-dom
- @aws-amplify/adapter-nextjs
- @aws-amplify/auth
- tailwindcss

### UI Dependencies

- shadcn/ui components
- lucide-react (icons)
- class-variance-authority
- clsx
- tailwind-merge

### Development Dependencies

- typescript
- eslint
- prettier
- jest
- @testing-library/react
- husky (git hooks)
- lint-staged

## Performance Considerations

- Server Components for improved initial load
- Image optimization with Next.js Image
- Code splitting and lazy loading
- Optimized bundle sizes
- Caching strategies

## Security Measures

- Authentication via AWS Cognito
- HTTPS enforcement
- CSRF protection
- Content Security Policy
- Input validation
- Rate limiting

## Accessibility Standards

- WCAG 2.1 compliance targets
- Semantic HTML
- Keyboard navigation
- Screen reader support
- Color contrast requirements

## Browser Support

- Modern evergreen browsers
- Mobile responsiveness
- Progressive enhancement
