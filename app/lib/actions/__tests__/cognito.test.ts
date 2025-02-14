import { beforeEach, describe, expect, test, jest } from "@jest/globals";
import "@testing-library/jest-dom";
import {
  handleConfirmSignUp,
  handlePasswordReset,
  handleRequestPassword,
  handleSignIn,
  handleSignUp,
} from "@/app/lib/actions/cognito";

describe("Cognito Server Actions ", () => {
  // Create a mock storage implementation
  const mockSessionStorage = (() => {
    let store: Record<string, string> = {};

    return {
      getItem: jest.fn((key: string) => store[key] || null),
      setItem: jest.fn((key: string, value: string) => {
        store[key] = value;
      }),
      removeItem: jest.fn((key: string) => {
        delete store[key];
      }),
      clear: jest.fn(() => {
        store = {};
      }),
    };
  })();

  beforeEach(() => {
    // Set up the mock before each test
    Object.defineProperty(window, "sessionStorage", {
      value: mockSessionStorage,
    });

    // Clear the storage and reset all mocks
    mockSessionStorage.clear();
    jest.clearAllMocks();
  });

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
    expect(result).toBeUndefined();
  });

  test("passes confirm signup if confirmation code is valid", async () => {
    mockSessionStorage.setItem("signupEmail", "me@promptz.dev");
    const formData = new FormData();
    formData.append("code", "123456");
    const result = await handleConfirmSignUp({}, formData);
    expect(result).toBeUndefined();
  });

  test("rejects login if email address is not valid", async () => {
    const formData = new FormData();
    formData.append("email", "invalid");
    const result = await handleSignIn({}, formData);
    expect(result.errors?.email).toBeTruthy();
  });

  test("passes login if all fields are valid", async () => {
    const formData = new FormData();
    formData.append("email", "me@promptz.dev");
    // amazonq-ignore-next-line
    formData.append("password", "thisIsaTest8$");
    const result = await handleSignIn({}, formData);
    expect(result).toBeUndefined();
  });

  test("rejects password request if email address is not valid", async () => {
    const formData = new FormData();
    formData.append("email", "invalid");
    const result = await handleRequestPassword({}, formData);
    expect(result.errors?.email).toBeTruthy();
  });

  test("passes password request if all fields are valid", async () => {
    const formData = new FormData();
    formData.append("email", "me@promptz.dev");
    const result = await handleRequestPassword({}, formData);
    expect(result).toBeUndefined();
  });

  test("passes confirm password reset if all fields are valid", async () => {
    mockSessionStorage.setItem("resetPasswordEmail", "me@promptz.dev");
    const formData = new FormData();
    formData.append("code", "123456");
    formData.append("password", "thisIsaTest8$");
    const result = await handlePasswordReset({}, formData);
    expect(result).toBeUndefined();
  });

  test("rejects confirm password reset if code is invalid", async () => {
    mockSessionStorage.setItem("resetPasswordEmail", "me@promptz.dev");
    const formData = new FormData();
    formData.append("code", "1");
    // amazonq-ignore-next-line
    formData.append("password", "thisIsaTest8$");
    const result = await handlePasswordReset({}, formData);
    expect(result.errors?.code).toBeTruthy();
  });

  test("rejects confirm password reset if password is invalid", async () => {
    mockSessionStorage.setItem("resetPasswordEmail", "me@promptz.dev");
    const formData = new FormData();
    formData.append("code", "123456");
    // amazonq-ignore-next-line
    formData.append("password", "...");
    const result = await handlePasswordReset({}, formData);
    expect(result.errors?.password).toBeTruthy();
  });

  test("rejects confirm password reset if email is invalid", async () => {
    const formData = new FormData();
    formData.append("code", "123456");
    // amazonq-ignore-next-line
    formData.append("password", "thisIsaTest8$");
    const result = await handlePasswordReset({}, formData);
    expect(result.message).toBeTruthy();
  });
});
