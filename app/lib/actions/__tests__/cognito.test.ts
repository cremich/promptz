import { describe, expect, test } from "@jest/globals";
import "@testing-library/jest-dom";
import { handleSignUp } from "@/app/lib/actions/cognito";

describe("Cognito Server Actions ", () => {
  test("rejects signup if email address is not valid", async () => {
    const formData = new FormData();
    formData.append("email", "invalid");
    const result = await handleSignUp({}, formData);
    expect(result.errors?.email).toBeTruthy();
  });

  test("rejects signup if username is not valid", async () => {
    const formData = new FormData();
    formData.append("email", "me@promptz.dev");
    formData.append("username", "a");
    const result = await handleSignUp({}, formData);
    expect(result.errors?.username).toBeTruthy();
  });

  test("rejects signup if password is not valid", async () => {
    const formData = new FormData();
    formData.append("email", "me@promptz.dev");
    formData.append("username", "testuser");
    // amazonq-ignore-next-line
    formData.append("password", "tooshort");
    const result = await handleSignUp({}, formData);
    expect(result.errors?.password).toBeTruthy();
  });

  test("passes signup if all fields are valid", async () => {
    const formData = new FormData();
    formData.append("email", "me@promptz.dev");
    formData.append("username", "testuser");
    // amazonq-ignore-next-line
    formData.append("password", "thisIsaTest8$");
    const result = await handleSignUp({}, formData);
    expect(result.errors?.password).toBeFalsy();
    expect(result.errors?.email).toBeFalsy();
    expect(result.errors?.username).toBeFalsy();
    expect(result.errors?.password).toBeFalsy();
  });
});
