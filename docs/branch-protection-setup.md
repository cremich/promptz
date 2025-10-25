# Branch Protection Rules Setup

This document outlines the required branch protection rules for the promptz repository to ensure content quality and proper review processes.

## Required Branch Protection Rules for `main` branch

### Status Checks

The following status checks must pass before merging:

- **Lint PR** - Validates PR title follows conventional commits
- **Content Validation** - Validates all content changes
- **Prompt Submission** (if applicable) - Validates prompt-specific changes

### Review Requirements

- **Require a pull request before merging**: ✅ Enabled
- **Require approvals**: 1 approval required
- **Dismiss stale PR approvals when new commits are pushed**: ✅ Enabled
- **Require review from code owners**: ✅ Enabled (uses CODEOWNERS file)

### Additional Restrictions

- **Restrict pushes that create files that match a pattern**: ✅ Enabled
  - Pattern: `content/**/*.md` (ensures all content goes through PR process)
- **Do not allow bypassing the above settings**: ✅ Enabled
- **Allow force pushes**: ❌ Disabled
- **Allow deletions**: ❌ Disabled

## Setup Instructions

### Via GitHub Web Interface

1. Go to repository Settings → Branches
2. Click "Add rule" for branch name pattern: `main`
3. Configure the settings as outlined above

### Via GitHub CLI

```bash
# Enable branch protection with required status checks
gh api repos/:owner/:repo/branches/main/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["Lint PR","validate-content"]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true,"require_code_owner_reviews":true}' \
  --field restrictions=null
```

### Via Terraform (if using Infrastructure as Code)

```hcl
resource "github_branch_protection" "main" {
  repository_id = github_repository.promptz.node_id
  pattern       = "main"

  required_status_checks {
    strict = true
    contexts = [
      "Lint PR",
      "validate-content"
    ]
  }

  required_pull_request_reviews {
    required_approving_review_count = 1
    dismiss_stale_reviews          = true
    require_code_owner_reviews     = true
  }

  enforce_admins = true
}
```

## Verification

After setup, verify the rules are working by:

1. Creating a test PR with invalid content
2. Confirming status checks fail
3. Confirming PR cannot be merged without approval
4. Testing that CODEOWNERS are automatically requested for review
