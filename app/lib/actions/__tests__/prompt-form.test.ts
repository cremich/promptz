import { onSubmitAction, type FormState } from "../prompt-form";
import { redirect } from "next/navigation";
import { beforeEach, describe, expect, test, jest } from "@jest/globals";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";

import {
  createPromptMock,
  updatePromptMock,
} from "@/__mocks__/@aws-amplify/adapter-nextjs/api";

describe("onSubmitAction", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should create a new prompt successfully", async () => {
    // Create test form data
    const formData = new FormData();
    formData.append("title", "Test Prompt");
    formData.append("description", "Test Description");
    formData.append("howto", "Test How To");
    formData.append("instruction", "Test Instruction");
    formData.append("tags", "tag1");
    formData.append("tags", "tag2");
    formData.append("public", "true");
    formData.append("sourceURL", "");

    // Execute the action
    await onSubmitAction({} as FormState, formData);
    // Verify the create function was called with correct parameters
    expect(createPromptMock).toHaveBeenCalled();

    // Verify redirect and revalidation
    expect(revalidatePath).toHaveBeenCalled();
    expect(redirect).toHaveBeenCalled();
  });

  test("should update an existing prompt successfully", async () => {
    // Create test form data with an existing ID
    const id = uuidv4();
    const formData = new FormData();
    formData.append("id", id);
    formData.append("title", "Updated Prompt");
    formData.append("description", "Updated Description");
    formData.append("howto", "Updated How To");
    formData.append("instruction", "Updated Instruction");
    formData.append("tags", "tag1");
    formData.append("public", "false");
    formData.append("sourceURL", "");

    // Execute the action
    await onSubmitAction({} as FormState, formData);

    // Verify the update function was called with correct parameters
    expect(updatePromptMock).toHaveBeenCalledWith(
      {
        id: id,
        name: "Updated Prompt",
        slug: `updated-prompt-${id.split("-")[0]}`,
        description: "Updated Description",
        howto: "Updated How To",
        instruction: "Updated Instruction",
        tags: ["tag1"],
        public: false,
        sourceURL: "",
      },
      { authMode: "userPool" },
    );

    // Verify redirect and revalidation
    expect(revalidatePath).toHaveBeenCalledWith(
      `/prompts/prompt/updated-prompt-${id.split("-")[0]}`,
    );
    expect(redirect).toHaveBeenCalledWith(
      `/prompts/prompt/updated-prompt-${id.split("-")[0]}`,
    );
  });

  test("should return validation errors for invalid form data", async () => {
    // Create invalid form data (missing required fields)
    const formData = new FormData();
    formData.append("title", ""); // Empty title should fail validation

    // Execute the action
    const result = await onSubmitAction({} as FormState, formData);

    // Verify validation errors are returned
    expect(result.success).toBe(false);
    expect(result.message).toBe("Invalid form data");
    expect(result.errors).toBeDefined();
  });

  test("should handle API errors", async () => {
    // Mock the AppSync client with an error response

    createPromptMock.mockReturnValueOnce(
      Promise.resolve({ errors: [{ message: "API Error" }] }),
    );

    // Create valid form data
    const formData = new FormData();
    formData.append("title", "Test Prompt");
    formData.append("description", "Test Description");
    formData.append("howto", "Test How To");
    formData.append("instruction", "Test Instruction");
    formData.append("tags", "tag1");
    formData.append("public", "true");
    formData.append("sourceURL", "");

    // Execute the action
    const result = await onSubmitAction({} as FormState, formData);

    // Verify error handling
    expect(result.success).toBe(false);
    expect(result.message).toBe("Error saving prompt.");
    expect(result.errors?.api).toEqual(["API Error"]);
  });
});
