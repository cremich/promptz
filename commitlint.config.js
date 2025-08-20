module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-enum": [
      2,
      "always",
      [
        "amplify",
        "nextjs",
        "q",
        "project-intelligence",
        "config",
        "prompts",
        "agents",
        "rules",
        "e2e-test",
        "unit-test",
      ],
    ],
  },
};
