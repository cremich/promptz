# Promptz

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=for-the-badge)](http://commitizen.github.io/cz-cli/)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg?style=for-the-badge)](./CODE_OF_CONDUCT.md)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=for-the-badge)](https://github.com/prettier/prettier)

Promptz is the ultimate prompting hub for Amazon Q Developer, designed to help you discover, create, and perfect your prompts for every step of the software development lifecycle.

## Table of Contents

- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
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

## Contributing

We welcome contributions to Promptz! Please see our [Contributing Guidelines](CONTRIBUTING.md) for more information on how to get started.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Learn More

To learn more about the technologies used in this project, check out the following resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [AWS Amplify Documentation](https://docs.amplify.aws/)
- [Cloudscape Design System](https://cloudscape.design/)
