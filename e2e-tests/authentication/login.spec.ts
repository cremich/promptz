import { test, expect } from "@playwright/test";
import { extractCode } from "e2e-tests/helpers/authentication";
import MailSlurp from "mailslurp-client";
import path from "path";
import fs from "fs";
import page from "@/app/page";

const mailSlurp = new MailSlurp({
  apiKey: process.env.MAILSLURP_API_KEY || "",
});

const authFile = path.join(__dirname, "../../.playwright/.auth/user.json");

test.describe("Login flow", () => {
  test(
    "User is able to login passwordless",
    { tag: ["@mailslurp", "@auth"] },
    async ({ page }) => {
      test.skip(
        fs.existsSync(authFile),
        "Login state already saved in ./playwright/.auth/user.json",
      );

      const inbox = await mailSlurp.getInbox(
        process.env.MAILSLURP_PLAYWRIGHT_USER_INBOX_ID || "",
      );

      await test.step("enter e-mail address", async () => {
        await page.goto("/login");
        await page.getByLabel("Email").fill(inbox.emailAddress);
        await page
          .getByRole("button", { name: "Send One-Time Password" })
          .click();
      });

      await test.step("enter one-time password", async () => {
        const otpMail = await mailSlurp.waitForLatestEmail(
          inbox.id,
          120000,
          true,
        );
        const otp = extractCode(otpMail.body || "");
        await page.getByLabel("One-Time Password").fill(otp);
        await page.getByRole("button", { name: "Confirm" }).click();
      });

      await test.step("save auth context", async () => {
        await page.waitForURL("/");
        await expect(page.getByText("playwright")).toBeVisible();

        await page.context().storageState({ path: authFile });
      });
    },
  );
});
