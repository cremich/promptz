import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, waitFor } from "@testing-library/react";
import createWrapper from "@cloudscape-design/components/test-utils/dom";
import "@testing-library/jest-dom/vitest";
import { PromptViewModel } from "@/models/PromptViewModel";
import PromptForm, { PromptFormInputs } from "@/components/PromptForm";
import { SubmitHandler } from "react-hook-form";

const backMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    back: backMock,
  }),
}));

describe("PromptForm component", () => {
  const mockPrompt = new PromptViewModel();
  const onSubmitMock: SubmitHandler<PromptFormInputs> = vi.fn();

  const onDeleteMock = vi.fn();
  const onSaveDraftMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders form fields correctly", () => {
    const { container } = render(
      <PromptForm
        prompt={mockPrompt}
        onSubmit={onSubmitMock}
        onDelete={onDeleteMock}
      />,
    );

    const wrapper = createWrapper(container);
    expect(
      wrapper.findFormField('[data-testid="formfield-name"]')!.getElement(),
    ).toBeInTheDocument();
    expect(
      wrapper
        .findFormField('[data-testid="formfield-description"]')!
        .getElement(),
    ).toBeInTheDocument();
    expect(
      wrapper.findFormField('[data-testid="formfield-sdlc"]')!.getElement(),
    ).toBeInTheDocument();
    expect(
      wrapper.findFormField('[data-testid="formfield-category"]')!.getElement(),
    ).toBeInTheDocument();
    expect(
      wrapper
        .findFormField('[data-testid="formfield-instruction"]')!
        .getElement(),
    ).toBeInTheDocument();
    expect(
      wrapper.findFormField('[data-testid="formfield-howto"]')!.getElement(),
    ).toBeInTheDocument();
    expect(
      wrapper
        .findFormField('[data-testid="formfield-interface"]')!
        .getElement(),
    ).toBeInTheDocument();
  });

  it("renders input fields correctly", () => {
    const { container } = render(
      <PromptForm
        prompt={mockPrompt}
        onSubmit={onSubmitMock}
        onDelete={onDeleteMock}
      />,
    );

    const wrapper = createWrapper(container);
    expect(
      wrapper.findInput('[data-testid="input-name"]')!.getElement(),
    ).toBeInTheDocument();
    expect(
      wrapper.findInput('[data-testid="input-description"]')!.getElement(),
    ).toBeInTheDocument();
    expect(
      wrapper.findSelect('[data-testid="select-sdlc"]')!.getElement(),
    ).toBeInTheDocument();
    expect(
      wrapper.findSelect('[data-testid="select-category"]')!.getElement(),
    ).toBeInTheDocument();
    expect(
      wrapper
        .findTextarea('[data-testid="textarea-instruction"]')!
        .getElement(),
    ).toBeInTheDocument();
    expect(
      wrapper.findTextarea('[data-testid="textarea-howto"]')!.getElement(),
    ).toBeInTheDocument();
    expect(
      wrapper.findTiles('[data-testid="tiles-interface"]')!.getElement(),
    ).toBeInTheDocument();
  });

  it("updates form data when input changes", () => {
    const { container } = render(
      <PromptForm
        prompt={mockPrompt}
        onSubmit={onSubmitMock}
        onDelete={onDeleteMock}
      />,
    );

    const wrapper = createWrapper(container);

    wrapper
      .findInput('[data-testid="input-name"]')!
      .setInputValue("Updated Name");

    const nativeInputName = wrapper
      .findInput('[data-testid="input-name"]')!
      .findNativeInput()
      .getElement();
    expect(nativeInputName.value).toBe("Updated Name");

    wrapper
      .findInput('[data-testid="input-description"]')!
      .setInputValue("Updated Description");

    const nativeInputDescription = wrapper
      .findInput('[data-testid="input-description"]')!
      .findNativeInput()
      .getElement();
    expect(nativeInputDescription.value).toBe("Updated Description");

    wrapper
      .findTextarea('[data-testid="textarea-instruction"]')!
      .setTextareaValue("Updated Instruction");

    const nativeInputInstruction = wrapper
      .findTextarea('[data-testid="textarea-instruction"]')!
      .findNativeTextarea()
      .getElement();
    expect(nativeInputInstruction.value).toBe("Updated Instruction");

    wrapper
      .findTextarea('[data-testid="textarea-howto"]')!
      .setTextareaValue("Updated Howto");

    const nativeHowTo = wrapper
      .findTextarea('[data-testid="textarea-howto"]')!
      .findNativeTextarea()
      .getElement();
    expect(nativeHowTo.value).toBe("Updated Howto");
  });

  it("displays validation errors when submitting with empty required fields", async () => {
    const { container } = render(
      <PromptForm
        prompt={new PromptViewModel()}
        onSubmit={onSubmitMock}
        onDelete={onDeleteMock}
      />,
    );
    const wrapper = createWrapper(container);

    await waitFor(() => {
      wrapper.findButton('[data-testid="button-save"]')!.click();
    });
    expect(
      wrapper
        .findFormField('[data-testid="formfield-description"]')!
        .findError(),
    ).toBeTruthy();
    expect(
      wrapper.findFormField('[data-testid="formfield-category"]')!.findError(),
    ).toBeTruthy();
    expect(
      wrapper
        .findFormField('[data-testid="formfield-instruction"]')!
        .findError(),
    ).toBeTruthy();
    expect(
      wrapper.findFormField('[data-testid="formfield-interface"]')!.findError(),
    ).toBeTruthy();
  });

  it("displays validation error", async () => {
    const pvm = new PromptViewModel();
    pvm.name = "ab";
    const { container } = render(
      <PromptForm
        prompt={pvm}
        onSubmit={onSubmitMock}
        onDelete={onDeleteMock}
      />,
    );
    const wrapper = createWrapper(container);

    await waitFor(() => {
      wrapper.findButton('[data-testid="button-save"]')!.click();
    });
    expect(
      wrapper.findFormField('[data-testid="formfield-name"]')!.findError(),
    ).toBeTruthy();
  });

  it("calls on submit handler when form is valid", async () => {
    const { container } = render(
      <PromptForm
        prompt={new PromptViewModel()}
        onSubmit={onSubmitMock}
        onDelete={onDeleteMock}
      />,
    );
    const wrapper = createWrapper(container);

    wrapper
      .findInput('[data-testid="input-name"]')!
      .setInputValue("This is the name");
    wrapper
      .findInput('[data-testid="input-description"]')!
      .setInputValue("This is the description");
    const categorySelect = wrapper.findSelect(
      '[data-testid="select-category"]',
    )!;
    categorySelect.openDropdown();
    categorySelect.selectOptionByValue("Chat");

    const sdlcSelect = wrapper.findSelect('[data-testid="select-sdlc"]')!;
    sdlcSelect.openDropdown();
    sdlcSelect.selectOptionByValue("Plan");
    wrapper
      .findTextarea('[data-testid="textarea-instruction"]')!
      .setTextareaValue(
        "This is the prompt that will solve all my developer issues.",
      );

    const interfaceTiles = wrapper.findTiles(
      '[data-testid="tiles-interface"]',
    )!;
    interfaceTiles.findItemByValue("IDE")?.click();

    await waitFor(() =>
      wrapper.findButton('[data-testid="button-save"]')!.click(),
    );
    expect(vi.mocked(onSubmitMock)).toHaveBeenCalled();
  });

  it("calls on delete handler when delete button is clicked", async () => {
    const { container } = render(
      <PromptForm
        prompt={new PromptViewModel()}
        onSubmit={onSubmitMock}
        onDelete={onDeleteMock}
      />,
    );
    const wrapper = createWrapper(container);

    await waitFor(() =>
      wrapper.findButton('[data-testid="button-delete"]')!.click(),
    );
    expect(vi.mocked(onDeleteMock)).toHaveBeenCalled();
  });

  it("renders save draft button when onSaveDraft handler set", async () => {
    const { container } = render(
      <PromptForm
        prompt={new PromptViewModel()}
        onSubmit={onSubmitMock}
        onDelete={onDeleteMock}
        onSaveDraft={onSaveDraftMock}
      />,
    );
    const wrapper = createWrapper(container);

    expect(
      wrapper.findButton('[data-testid="button-save-draft"]'),
    ).toBeTruthy();
  });

  it("routes back when button is clicked", async () => {
    const { container } = render(
      <PromptForm
        prompt={new PromptViewModel()}
        onSubmit={onSubmitMock}
        onDelete={onDeleteMock}
      />,
    );
    const wrapper = createWrapper(container);

    await waitFor(() =>
      wrapper.findButton('[data-testid="button-cancel"]')!.click(),
    );
    expect(vi.mocked(backMock)).toHaveBeenCalled();
  });

  it("submits prompt with empty sdlc activity", async () => {
    const { container } = render(
      <PromptForm
        prompt={new PromptViewModel()}
        onSubmit={onSubmitMock}
        onDelete={onDeleteMock}
      />,
    );
    const wrapper = createWrapper(container);

    wrapper
      .findInput('[data-testid="input-name"]')!
      .setInputValue("This is the name");
    wrapper
      .findInput('[data-testid="input-description"]')!
      .setInputValue("This is the description");

    wrapper
      .findTextarea('[data-testid="textarea-instruction"]')!
      .setTextareaValue(
        "This is the prompt that will solve all my developer issues.",
      );

    const interfaceTiles = wrapper.findTiles(
      '[data-testid="tiles-interface"]',
    )!;
    interfaceTiles.findItemByValue("IDE")?.click();

    const categorySelect = wrapper.findSelect(
      '[data-testid="select-category"]',
    )!;
    categorySelect.openDropdown();
    categorySelect.selectOptionByValue("Chat");

    await waitFor(() =>
      wrapper.findButton('[data-testid="button-save"]')!.click(),
    );
    expect(vi.mocked(onSubmitMock)).toHaveBeenCalled();
  });

  it("not renders validation errors sdlc is empty", async () => {
    const { container } = render(
      <PromptForm
        prompt={new PromptViewModel()}
        onSubmit={onSubmitMock}
        onDelete={onDeleteMock}
      />,
    );
    const wrapper = createWrapper(container);

    await waitFor(() => {
      wrapper.findButton('[data-testid="button-save"]')!.click();
    });

    expect(
      wrapper.findFormField('[data-testid="formfield-sdlc"]')!.findError(),
    ).toBeFalsy();
  });
});
