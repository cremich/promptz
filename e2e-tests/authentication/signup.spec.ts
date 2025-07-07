import { test, expect } from "@playwright/test";
import { extractCode } from "e2e-tests/helpers/authentication";
import MailSlurp from "mailslurp-client";
import path from "path";
import fs from "fs";

const mailSlurp = new MailSlurp({
  apiKey: process.env.MAILSLURP_API_KEY || "",
});

const authFile = path.join(__dirname, "../../.playwright/.auth/user.json");

test.describe("SignUp flow", () => {
  test(
    "User is able to signup for a new account",
    { tag: ["@mailslurp", "@auth"] },
    async ({ page }) => {
      test.skip(
        fs.existsSync(authFile),
        "Login state already saved in ./playwright/.auth/user.json",
      );

      const inbox = await mailSlurp.createInboxWithOptions({
        expiresIn: 5 * 60 * 1000, // 5 minutes in milliseconds
      });

      await page.goto("/signup");
      await page.fill('input[name="email"]', inbox.emailAddress);
      await page.fill('input[name="username"]', "e2e-test");
      await page.click('button[type="submit"]');

      const signUpMail = await mailSlurp.waitForLatestEmail(
        inbox.id,
        120000,
        true,
      );
      const confirmationCode = extractCode(signUpMail.body || "");
      page.fill('input[name="code"]', confirmationCode);
      await page.click('button[type="submit"]');

      // sign-in new created user
      await page.goto("/login");
      await page.fill('input[name="email"]', inbox.emailAddress);
      await page.click('button[type="submit"]');
      const otpMail = await mailSlurp.waitForLatestEmail(
        inbox.id,
        120000,
        true,
      );
      const otp = extractCode(otpMail.body || "");
      page.fill('input[name="code"]', otp);
      await page.click('button[type="submit"]');

      await page.waitForURL("/");

      const logoutButton = page.getByTestId("logout-button");

      // Expect a title "to contain" a substring.
      expect(logoutButton).toBeTruthy();

      await mailSlurp.deleteInbox(inbox.id);
    },
  );
});
