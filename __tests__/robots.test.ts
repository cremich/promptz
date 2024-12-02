import { describe, it, expect } from "vitest";
import robots from "../app/robots";

describe("robots", () => {
  it("should return valid robots metadata with default base URL", () => {
    const result = robots();

    expect(result).toEqual({
      rules: {
        userAgent: "*",
        allow: "/",
        disallow: ["/browse/my", "/prompt/drafts", "/auth"],
      },
      sitemap: "https://promptz.dev/sitemap.xml",
    });
  });
});
