module.exports = async ({ github, context }) => {
  const { data: pr } = await github.rest.pulls.get({
    owner: context.repo.owner,
    repo: context.repo.repo,
    pull_number: context.issue.number,
  });

  const { data: files } = await github.rest.pulls.listFiles({
    owner: context.repo.owner,
    repo: context.repo.repo,
    pull_number: context.issue.number,
  });

  // Check manual review triggers
  const isFirstTimeContributor =
    pr.author_association === "FIRST_TIME_CONTRIBUTOR";
  const hasLargeChanges = files.some((file) => file.changes > 100);

  // Check for external URLs in changed files
  let hasExternalUrls = false;
  for (const file of files) {
    if (file.filename.endsWith(".md") && file.patch) {
      if (file.patch.includes("sourceURL:") && file.patch.includes("http")) {
        hasExternalUrls = true;
        break;
      }
    }
  }

  const needsManualReview =
    isFirstTimeContributor || hasLargeChanges || hasExternalUrls;

  return {
    needsManualReview,
    isFirstTimeContributor,
    hasLargeChanges,
    hasExternalUrls,
  };
};
