# Scripts Directory

This directory contains utility scripts for managing the Promptz application data and infrastructure.

## Tag Seeding Script (`seed_tags.js`)

### Purpose

The `seed_tags.js` script populates the Tag table with all predefined tags from the codebase enumerations. This script is essential for implementing the Tag-Based Discoverability Enhancement (Issue #93).

### Features

- **Comprehensive Tag Coverage**: Seeds all predefined tags from `SdlcActivity`, `PromptCategory`, `QInterface`, and `ProjectRuleTag` enumerations
- **Proper Categorization**: Each tag is categorized (SDLC, Interface, Platform, Framework, Language, Cloud, Quality)
- **Meaningful Descriptions**: Every tag includes a detailed description for better user understanding
- **Error Handling**: Robust error handling with validation and duplicate prevention
- **Dry Run Mode**: Test the script without making actual changes
- **Rollback Capability**: Remove seeded tags if needed
- **List Functionality**: View existing tags in the table

### Usage

#### Prerequisites

1. Ensure you have AWS credentials configured
2. Make sure the Amplify backend is deployed and the Tag table exists
3. Node.js environment with ES modules support

#### Running the Script

```bash
# Navigate to the project root
cd /path/to/promptz

# Run the seeding script
node scripts/seed_tags.js
```

#### Interactive Prompts

The script will ask for:

1. **DynamoDB Tag table name**: Enter the name of your Tag table (e.g., `amplify-promptz-<env>-tag-<hash>`)
2. **AWS region**: Enter your AWS region (default: us-east-1)
3. **Operation**: Choose from:
   - `seed`: Add all predefined tags to the table
   - `rollback`: Remove all seeded tags from the table
   - `list`: Display existing tags in the table
4. **Dry run mode**: Choose whether to run in dry-run mode (recommended for first run)

#### Example Session

```
=== Tag Seeding Script ===
This script will populate the Tag table with predefined tags from the codebase.
Total tags to process: 47

Enter the DynamoDB Tag table name: amplify-promptz-sandbox-tag-ABC123
Enter the AWS region (default: us-east-1): us-east-1
Choose operation (seed/rollback/list): seed
Run in dry-run mode? (y/n): y

Configuration:
- Table: amplify-promptz-sandbox-tag-ABC123
- Region: us-east-1
- Operation: seed
- Dry run: Yes

Proceed with these settings? (y/n): y

DRY RUN: Seeding 47 tags...
Would seed tag: Debugging (SDLC)
  ✓ Would seed: Debugging
Would seed tag: Deploy (SDLC)
  ✓ Would seed: Deploy
...

DRY RUN Seeding completed!
Tags that would be seeded: 47
```

### Tag Categories and Descriptions

The script seeds tags in the following categories:

#### SDLC (Software Development Lifecycle)

- **Debugging**: Troubleshooting and error resolution
- **Deploy**: CI/CD and deployment tasks
- **Design**: Architecture and system design
- **Documentation**: Technical writing and API docs
- **Enhance**: Feature improvements and optimization
- **Implement**: Code development and programming
- **Operate**: System administration and monitoring
- **Optimize**: Performance and efficiency improvements
- **Patch Management**: Security updates and bug fixes
- **Plan**: Project and sprint planning
- **Refactoring**: Code restructuring and quality
- **Requirements**: Gathering and analysis
- **Security**: Security analysis and secure coding
- **Support**: Customer support and maintenance
- **Test**: Testing and quality assurance

#### Interface (Amazon Q Developer Interfaces)

- **Chat**: Conversational prompts
- **Dev Agent**: Development task prompts
- **Doc Agent**: Documentation task prompts
- **Inline**: IDE inline prompts
- **Review Agent**: Code review prompts
- **Test Agent**: Testing task prompts
- **Transform Agent**: Code transformation prompts
- **Translate**: Code translation prompts

#### Platform (Development Platforms)

- **IDE**: Integrated Development Environment prompts
- **CLI**: Command Line Interface prompts
- **Management Console**: AWS Console prompts

#### Framework (Web Frameworks)

- **NextJS**: Next.js specific prompts and rules
- **React**: React library prompts and rules
- **Vue.js**: Vue.js framework prompts and rules

#### Language (Programming Languages)

- **Swift**, **Kotlin**, **TypeScript**, **JavaScript**, **Python**, **Java**, **Rust**, **Go**

#### Cloud (AWS Services)

- **AWS**: General AWS services
- **Amplify**: AWS Amplify specific
- **CDK**: AWS Cloud Development Kit
- **SAM**: Serverless Application Model
- **Cloudformation**: AWS CloudFormation

#### Quality (Code Quality Aspects)

- **Security**: Security-focused prompts and rules
- **Performance**: Performance optimization
- **Accessibility**: Accessibility compliance
- **SEO**: Search engine optimization

### Error Handling

The script includes comprehensive error handling:

- **Validation**: Ensures all tag data is valid before insertion
- **Duplicate Prevention**: Uses conditional expressions to prevent overwriting existing tags
- **Graceful Failures**: Continues processing even if individual tags fail
- **Error Reporting**: Provides detailed error messages and counts

### Rollback Functionality

If you need to remove the seeded tags:

```bash
node scripts/seed_tags.js
# Choose 'rollback' operation when prompted
```

This will remove all tags that were seeded by the script, allowing you to start fresh if needed.

### Verification

After seeding, you can verify the results by:

1. Using the `list` operation in the script
2. Checking the AWS DynamoDB console
3. Testing tag-based queries in your application

### Integration with Tag-Based Discoverability

This script is a crucial component of the Tag-Based Discoverability Enhancement (Issue #93). The seeded tags enable:

- Homepage tag sections for browsing prompts and project rules
- Tag-specific virtual routes for SEO
- Enhanced search and filtering capabilities
- MCP server integration for AI-assisted discovery

### Troubleshooting

#### Common Issues

1. **Table Not Found**: Ensure your Amplify backend is deployed and the table name is correct
2. **Permission Denied**: Check your AWS credentials and IAM permissions
3. **Region Mismatch**: Ensure you're using the correct AWS region

#### Getting Table Name

To find your Tag table name:

```bash
# List DynamoDB tables
aws dynamodb list-tables --region your-region

# Look for tables with 'tag' in the name
aws dynamodb list-tables --region your-region | grep -i tag
```

Or check the Amplify console for your deployed resources.

## Other Scripts

### `update_owner_attribute.js`

Script to update owner attributes in DynamoDB table entries. See the script file for detailed usage instructions.
