# Promptz

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=for-the-badge)](http://commitizen.github.io/cz-cli/)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg?style=for-the-badge)](./CODE_OF_CONDUCT.md)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=for-the-badge)](https://github.com/prettier/prettier)

Promptz is the ultimate prompting hub for Amazon Q Developer, designed to help you discover, create, and perfect your prompts for every step of the software development lifecycle.

## Table of Contents

- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [End-to-End Testing](#-end-to-end-testing)
- [Contributing](#contributing)
- [License](#license)

## 📝 Prerequisites

- [Create an AWS account](https://portal.aws.amazon.com/gp/aws/developer/registration/index.html) if you do not already have one and log in.
- [Configure AWS for local development](https://docs.amplify.aws/nextjs/start/account-setup/) with Amplify

Before you begin, make sure you have the following installed:

- Node.js v14.x or later
- npm v6.14.4 or later
- git v2.14.1 or later

## 🚀 Getting Started

Promptz is built with AWS Amplify Gen 2 and next.js.

### 1. Clone the repository

```
git clone https://github.com/cremich/promptz.git
cd promptz
```

### 2. Install dependencies

Install all required dependencies via `npm i`.

### 3. Setup local AWS credentials

To deploy the app and make backend updates, Amplify requires AWS credentials to deploy backend updates from your local machine. Follow the official Amplify documentation to [configure AWS for local development](https://docs.amplify.aws/nextjs/start/account-setup/).

### 4. Deploy the app as sandbox in your AWS account

Now that the repository has been setup, deploy the Amplify App in your own AWS account by running

```
npm run sandbox
```

This command will create a sandbox environment that provides an isolated development space to rapidly build, test, and iterate on. The sandbox environment is fully functional. However the sandbox configuration is slightly different from the production configuration:

- The sandbox environment does not configure social idPs for Amazon Cognito.
- Amazon Cognito is configured to send verification e-mails instead of using Amazon SES with the official noreply@promptz.dev email adress.
- DynamoDB Tables and Amazon Cognito Userpools have turned off deletion protection to not cause stale resources in your AWS accont once you delete the sandbox environment.
- DynamoDB Tables have no point-in-time-recovery enabled.
- AWS Appsync is configured without X-Ray and logging to Amazon Cloudwatch.

> ⚠️ **Your deployment will fail if you if you create your sandbox environment with the amplify default approach** calling `npx ampx sandbox`.
>
> `npm run sandbox` will set an environment variable `PROMPTZ_ENV` that is evaluated when provisioning the backend resources. Only if this variable is set to `sandbox`, certain configurations like Amazon SES, Social Provicer idPs are deactivated.

While you are waiting for your app to deploy (~5 mins). Learn about the project structure

- `amplify/` Contains Amplify backend configuration
- `/app`: Next.js app router pages and layouts
- `/components`: React components used throughout the application
- `/contexts`: React context providers
- `/hooks`: Custom React hooks
- `/models`: Data models and types
- `/public`: Static assets
- `/utils`: Utility functions and helpers

When the build completes, visit the newly deployed branch by selecting "View deployed URL".

### 5. Start a local development server

Run `npm run dev` to start a local development server using the amplify configuration downloaded in step 4.

After starting the development server, open your browser and navigate to `http://localhost:3000`.

## 🧪 End-to-End Testing

Promptz uses Playwright for automated end-to-end testing to ensure the application works correctly across different browsers and user scenarios. The tests use MailSlurp for email-based authentication flows, allowing automated testing of passwordless login and signup processes.

### Prerequisites for E2E Testing

Before running end-to-end tests, ensure you have:

1. **Completed the Getting Started setup** - Your sandbox environment must be deployed and running
2. **MailSlurp API Key** - Required for email automation during authentication tests

### MailSlurp Setup

The E2E tests rely on MailSlurp to handle email verification codes during authentication flows:

1. **Create a MailSlurp account**:
   - Sign up at [MailSlurp](https://www.mailslurp.com/) for a free account
   - Get your API key from the dashboard

2. **Create a permanent inbox for login tests**:
   - In your MailSlurp dashboard, create a permanent inbox
   - Note the inbox ID for the login test user

3. **Configure environment variables**:
   ```bash
   # Add to your .env file
   echo "MAILSLURP_API_KEY=your-mailslurp-api-key" >> .env
   echo "MAILSLURP_PLAYWRIGHT_USER_INBOX_ID=your-inbox-id" >> .env
   echo "PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000" >> .env
   ```

### Test User Setup

The E2E tests require a dedicated test user in your Cognito user pool that corresponds to your MailSlurp inbox:

1. **Identify your Cognito User Pool ID**:
   - After deploying your sandbox, check the Amplify console or AWS Console
   - Look for the Cognito User Pool created by your sandbox deployment
   - Note the User Pool ID (format: `region_xxxxxxxxx`)

2. **Create the test user** using AWS CLI:

   ```bash
   aws cognito-idp admin-create-user \
     --user-pool-id YOUR_USER_POOL_ID \
     --username "your-mailslurp-inbox-email@mailslurp.biz" \
     --user-attributes Name=email,Value="your-mailslurp-inbox-email@mailslurp.biz" Name=preferred_username,Value="playwright" \
     --message-action SUPPRESS \
     --region YOUR_AWS_REGION
   ```

   Replace:
   - `YOUR_USER_POOL_ID` with your actual User Pool ID
   - `your-mailslurp-inbox-email@mailslurp.biz` with your MailSlurp inbox email address
   - `YOUR_AWS_REGION` with your deployment region

### Running E2E Tests

Once your MailSlurp and test user setup is complete **Run Playwright tests**:

```bash
# Run all E2E tests
npm run e2e
```

### Test Architecture

The E2E tests are organized as follows:

- **Authentication Tests**: Handle login and signup flows using MailSlurp for email verification
  - `login.spec.ts`: Tests passwordless login with existing user
  - `signup.spec.ts`: Tests new user registration and first login
- **Helper Functions**: Utility functions for common test operations
  - `authentication.ts`: Email code extraction utilities

### Test Environment Notes

- Tests run against your local development server (`http://localhost:3000`) by default.
- Authentication state is persisted in `.playwright/.auth/user.json` to avoid hitting the free quotas of mailslurp due to repetitive logins or signups.
- The signup test creates temporary inboxes that are automatically cleaned up
- The login test uses a permanent inbox for consistent testing

## Contributing

We welcome contributions to Promptz! Please see our [Contributing Guidelines](CONTRIBUTING.md) for more information on how to get started.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Learn More

To learn more about the technologies used in this project, check out the following resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [AWS Amplify Documentation](https://docs.amplify.aws/)
- [Cloudscape Design System](https://cloudscape.design/)
