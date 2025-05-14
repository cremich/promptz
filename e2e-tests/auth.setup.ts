import { extractCode } from "@/e2e-tests/utils";
import { test as setup, expect } from "@playwright/test";
import MailSlurp from "mailslurp-client";
import path from "path";

let mailBoxId = "";
let emailAddress = "";
const mailSlurp = new MailSlurp({
  apiKey: process.env.MAILSLURP_API_KEY || "",
});

const authFile = path.join(__dirname, "../.playwright/.auth/user.json");

setup.beforeAll(async () => {
  const inbox = await mailSlurp.createInboxWithOptions({
    expiresIn: 5 * 60 * 1000, // 5 minutes in milliseconds
  });

  mailBoxId = inbox.id;
  emailAddress = inbox.emailAddress;
});

setup.afterAll(async () => {
  await mailSlurp.deleteInbox(mailBoxId);
});

setup("setup authentication", async ({ page }) => {
  await page.goto("/signup");
  await page.fill('input[name="email"]', emailAddress);
  await page.fill('input[name="username"]', "e2e-test");
  await page.click('button[type="submit"]');

  const signUpMail = await mailSlurp.waitForLatestEmail(
    mailBoxId,
    120000,
    true,
  );
  const confirmationCode = extractCode(signUpMail.body || "");
  page.fill('input[name="code"]', confirmationCode);
  await page.click('button[type="submit"]');

  // sign-in new created user
  await page.goto("/login");
  await page.fill('input[name="email"]', emailAddress);
  await page.click('button[type="submit"]');
  const otpMail = await mailSlurp.waitForLatestEmail(mailBoxId, 120000, true);
  const otp = extractCode(otpMail.body || "");
  page.fill('input[name="code"]', otp);
  await page.click('button[type="submit"]');

  await page.waitForURL("/");

  const logoutButton = page.getByTestId("logout-button");

  // Expect a title "to contain" a substring.
  expect(logoutButton).toBeTruthy();
  await page.context().storageState({ path: authFile });
});
