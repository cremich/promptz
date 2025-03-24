import { describe, expect, test } from "@jest/globals";
import CreateProjectRulePage from "../page";
import { redirect } from "next/navigation";

describe("CreateProjectRulePage", () => {
  test("redirects to login page when user is not authenticated", async () => {
    // Mock user as guest

    // Render the component
    await CreateProjectRulePage();

    // Check if redirect was called with the correct path
    expect(redirect).toHaveBeenCalledWith("/login");
  });
});
