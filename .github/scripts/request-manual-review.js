module.exports = async ({ github, context, criteria, changedFiles }) => {
  const fileList = changedFiles
    .split(" ")
    .map((file) => `- \`${file}\``)
    .join("\n");

  let reasons = [];
  if (criteria.isFirstTimeContributor) reasons.push("First-time contributor");
  if (criteria.hasLargeChanges) reasons.push("Large content changes");
  if (criteria.hasExternalUrls) reasons.push("Contains external URLs");

  const body = `🔍 **Manual review required**
  
  **Validation successful, but manual review needed due to:**
  ${reasons.map((r) => `- ${r}`).join("\n")}

  **Validated files:**
  ${fileList}
  
  A maintainer will review this shortly.`;

  await github.rest.pulls.createReview({
    owner: context.repo.owner,
    repo: context.repo.repo,
    pull_number: context.issue.number,
    event: "REQUEST_CHANGES",
    body: body,
  });

  await github.rest.issues.addLabels({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: context.issue.number,
    labels: ["needs-manual-review"],
  });
};
