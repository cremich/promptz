import { describe, expect, test } from "@jest/globals";
import robots from "@/app/robots";

describe("Robots", () => {
  test("Returns correct sitemap configuration", () => {
    const robotsConfig = robots();

    // Verify the sitemap URL
    expect(robotsConfig.sitemap).toBe("https://promptz.dev/sitemap.xml");
  });
});
