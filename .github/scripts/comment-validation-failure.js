module.exports = async ({ github, context }) => {
  const body = `❌ **Prompt validation or build failed**
  
  Please check the validation errors above and fix the issues in your markdown files.

  **Common issues:**
  - Missing or invalid frontmatter fields (title, description, author)
  - Missing "How to Use" section
  - Invalid file naming (use lowercase-with-hyphens.md)
  - Content too short or too long
  - Security issues (script tags, suspicious content)
  - Build-time processing errors

  **Need help?** Check the [prompt template](https://github.com/${context.repo.owner}/${context.repo.repo}/blob/main/templates/prompt-template.md) for guidance.`;

  const { data: comments } = await github.rest.issues.listComments({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: context.issue.number,
  });

  const botComment = comments.find(
    (comment) =>
      comment.user.type === "Bot" &&
      comment.body.includes("❌ Prompt validation"),
  );

  if (botComment) {
    await github.rest.issues.updateComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      comment_id: botComment.id,
      body: body,
    });
  } else {
    await github.rest.issues.createComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: context.issue.number,
      body: body,
    });
  }
};
