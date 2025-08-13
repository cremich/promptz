module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-enum": [
      2,
      "always",
      ["amplify", "nextjs", "q", "project-intelligence", "config"],
    ],
  },
};
