/**
 * Jest configuration for content validation tests
 */

import type { Config } from "jest";

const config: Config = {
  testEnvironment: "node",
  clearMocks: true,
  collectCoverage: false,
  testMatch: ["<rootDir>/__tests__/content-validation.test.ts"],
  moduleNameMapper: {
    "^@/components/(.*)$": "<rootDir>/components/$1",
    "^@/app/(.*)$": "<rootDir>/app/$1",
    "^@/lib/(.*)$": "<rootDir>/lib/$1",
  },
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.json",
      },
    ],
  },
  extensionsToTreatAsEsm: [".ts"],
  globals: {
    "ts-jest": {
      useESM: true,
    },
  },
};

export default config;
