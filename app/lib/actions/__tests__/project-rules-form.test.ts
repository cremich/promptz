import { describe, expect, test, jest } from "@jest/globals";
import { onSubmitAction, deleteProjectRule } from "../project-rules-form";
import {
  createProjectRuleMock,
  updateProjectRuleMock,
} from "@/__mocks__/@aws-amplify/adapter-nextjs/api";
import { revalidatePath } from "@/__mocks__/next/cache";
import { redirect } from "@/__mocks__/next/navigation";
import { v4 as uuidv4 } from "uuid";

// Mock the uuid module
jest.mock("uuid", () => ({
  v4: jest.fn(() => "test-id"),
}));

describe("Project Rules Form Actions", () => {
  test("onSubmitAction should create a new project rule", async () => {
    const formData = new FormData();
    formData.append("title", "Test Project Rule");
    formData.append("description", "Test description");
    formData.append("content", "# Test Content\n\nThis is a test rule.");
    formData.append("tags", "test");
    formData.append("tags", "rule");
    formData.append("public", "true");
    formData.append("sourceURL", "https://github.com/test/repo");

    await onSubmitAction({}, formData);

    expect(createProjectRuleMock).toHaveBeenCalled();

    // Verify redirect and revalidation
    expect(revalidatePath).toHaveBeenCalled();
    expect(redirect).toHaveBeenCalled();
  });

  test("onSubmitAction should update an existing project rule", async () => {
    const id = uuidv4();
    const formData = new FormData();
    formData.append("id", id);
    formData.append("title", "Updated Project Rule");
    formData.append("description", "Updated description");
    formData.append("content", "# Updated Content\n\nThis is an updated rule.");
    formData.append("tags", "test");
    formData.append("tags", "updated");
    formData.append("public", "true");
    formData.append("sourceURL", "https://github.com/test/repo-updated");

    await onSubmitAction({}, formData);

    expect(updateProjectRuleMock).toHaveBeenCalled();

    // Verify redirect and revalidation
    expect(revalidatePath).toHaveBeenCalled();
    expect(redirect).toHaveBeenCalled();
  });

  test("onSubmitAction should validate form data", async () => {
    const formData = new FormData();
    formData.append("title", "Te"); // Too short
    formData.append("description", "Short"); // Too short
    formData.append("content", "Short"); // Too short
    formData.append("public", "true");

    const result = await onSubmitAction({}, formData);

    expect(result.success).toBe(false);
    expect(result.errors).toBeDefined();
  });

  test("deleteProjectRule should delete a project rule", async () => {
    const result = await deleteProjectRule("test-id");

    expect(result.success).toBe(true);
    expect(result.message).toBe("Project rule deleted");
  });
});
