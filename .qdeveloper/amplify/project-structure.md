# Amplify Project Structure

Amplify Gen 2 backends are defined using TypeScript, and enable you to collocate resources depending on their function. For example, you can author a post confirmation trigger for Amazon Cognito that creates a UserProfile model right next to your auth's resource file.

When you create your first Amplify project using npm create amplify@latest, it will automatically set up the scaffolding for Data and Authentication resources:

```
├── amplify/
│   ├── auth/
│   │   └── resource.ts
│   ├── data/
│   │   └── resource.ts
│   ├── backend.ts
│   └── package.json
├── node_modules/
├── .gitignore
├── package-lock.json
├── package.json
└── tsconfig.json
```

As your project grows and you build out your backend, the structure of your project may look like the following:

```
├── amplify/
│   ├── auth/
│   │   ├── custom-message/
│   │   │   ├── custom-message.tsx
│   │   │   ├── handler.ts
│   │   │   ├── package.json
│   │   │   └── resource.ts
│   │   ├── post-confirmation.ts
│   │   ├── pre-sign-up.ts
│   │   ├── resource.ts
│   │   └── verification-email.tsx
│   ├── data/
│   │   ├── resolvers/
│   │   │   ├── list-featured-posts.ts
│   │   │   └── list-top-10-posts.ts
│   │   ├── resource.ts
│   │   └── schema.ts
│   ├── jobs/
│   │   ├── monthly-report/
│   │   │   ├── handler.ts
│   │   │   └── resource.ts
│   │   ├── process-featured-posts/
│   │   │   ├── handler.py
│   │   │   ├── requirements.txt
│   │   │   └── resource.ts
│   │   └── store-top-10-posts/
│   │       ├── handler.ts
│   │       └── resource.ts
│   ├── storage/
│   │   ├── photos/
│   │   │   ├── resource.ts
│   │   │   └── trigger.ts
│   │   └── reports/
│   │       └── resource.ts
│   ├── backend.ts
│   └── package.json
├── node_modules/
├── .gitignore
├── package-lock.json
├── package.json
└── tsconfig.json
```

Backend resources are defined in resource files using the `define*` helpers:

```typescript
//amplify/auth/resource.ts
import { defineAuth } from "@aws-amplify/backend";

export const auth = defineAuth({
  loginWith: {
    email: true,
  },
});
```

After the resources are defined, they are set up on the backend:

```typescript
//amplify/backend.ts
import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";

defineBackend({
  auth,
  data,
});
```

You can extend backends by using the AWS Cloud Development Kit (AWS CDK), which is installed by default as part of the create-amplify workflow. With the CDK, you can build using any AWS service, such as an Amazon S3 bucket that authenticated users have read and write access to. To get started with the CDK, add it to your backend:

```typescript
// amplify/backend.ts
import * as s3 from "aws-cdk-lib/aws-s3";
import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";

const backend = defineBackend({
  auth,
  data,
});

// create the bucket and its stack
const bucketStack = backend.getStack("BucketStack");
const bucket = new s3.Bucket(bucketStack, "Bucket", {
  blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
});

// allow any authenticated user to read and write to the bucket
const authRole = backend.auth.resources.authenticatedUserIamRole;
bucket.grantReadWrite(authRole);

// allow any guest (unauthenticated) user to read from the bucket
const unauthRole = backend.auth.resources.unauthenticatedUserIamRole;
bucket.grantRead(unauthRole);
```
