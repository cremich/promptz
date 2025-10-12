module.exports = async ({ github, context, changedFiles }) => {
  const fileList = changedFiles
    .split(" ")
    .map((file) => `- \`${file}\``)
    .join("\n");

  const body = `✅ **Auto-approved: All criteria met**
  
  **Automated approval criteria:**
  - ✅ Prompt validation passed
  - ✅ Build process successful
  - ✅ No security violations detected
  - ✅ No manual review triggers

  **Validated files:**
  ${fileList}`;

  await github.rest.pulls.createReview({
    owner: context.repo.owner,
    repo: context.repo.repo,
    pull_number: context.issue.number,
    event: "APPROVE",
    body: body,
  });

  await github.rest.issues.addLabels({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: context.issue.number,
    labels: ["auto-approved"],
  });
};
