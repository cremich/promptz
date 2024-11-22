import { coverageConfigDefaults, defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    coverage: {
      reporter: ["json", "text", "json-summary"],
      reportOnFailure: true,
      exclude: [
        "next.config.js",
        "commitlint.config.js",
        "amplify/**",
        ...coverageConfigDefaults.exclude,
      ],
    },
    environment: "jsdom",
    setupFiles: ["./vitest.setup.js"],
    alias: {
      "@/": new URL("./", import.meta.url).pathname,
    },
  },
});
