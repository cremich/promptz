import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,

  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "app/test-content/**",
    "coverage",
    "libraries/**"
  ]),

  {
    rules: {
      // Code complexity limits
      "max-lines": [
        "error",
        { max: 400, skipBlankLines: true, skipComments: true },
      ],
      "max-depth": ["error", 3],
      complexity: ["error", 12],
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["*/utils/*", "*/utils"],
              message: "No utils folders. Use domain-specific names.",
            },
            {
              group: ["*/helpers/*", "*/helpers"],
              message: "No helpers folders. Use domain-specific names.",
            },
            {
              group: ["*/common/*", "*/common"],
              message: "No common folders. Use domain-specific names.",
            },
            {
              group: ["*/shared/*", "*/shared"],
              message: "No shared folders. Use domain-specific names.",
            },
            {
              group: ["*/core/*", "*/core"],
              message: "No core folders. Use domain-specific names.",
            },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
