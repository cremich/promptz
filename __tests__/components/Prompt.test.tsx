import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { usePrompt } from "@/hooks/usePrompt";
import Prompt from "@/components/Prompt";
import { useAuth } from "@/contexts/AuthContext";
import "@testing-library/jest-dom/vitest";
import createWrapper from "@cloudscape-design/components/test-utils/dom";

import { PromptViewModel } from "@/models/PromptViewModel";
import { UserViewModel } from "@/models/UserViewModel";

const mockUserDataPrimary = {
  id: "4304d832-1021-707b-211b-2be14c145d75",
  username: "4304d832-1021-707b-211b-2be14c145d75",
  email: "test@example.com",
  displayName: "Test User Primary",
  owner:
    "4304d832-1021-707b-211b-2be14c145d75::4304d832-1021-707b-211b-2be14c145d75",
  createdAt: "",
  updatedAt: "",
};

const primaryUserModel = UserViewModel.fromSchema(mockUserDataPrimary);

const promptViewModel = PromptViewModel.fromSchema({
  id: "test-id",
  name: "Test Prompt",
  instruction: "Test instruction",
  sdlc_phase: "DEPLOY",
  category: "CHAT",
  owner_username: mockUserDataPrimary.displayName,
  owner: mockUserDataPrimary.owner,
  description: "description",
  howto: "howto",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

// Mock the hooks
vi.mock("@/hooks/usePrompt");
vi.mock("@/contexts/AuthContext");

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mocked(useAuth).mockReturnValue({
  user: primaryUserModel,
  logout: vi.fn(),
  fetchUser: vi.fn(),
});

describe("Prompt component", () => {
  it("renders loading state", () => {
    vi.mocked(usePrompt).mockReturnValue({
      loading: true,
      error: null,
      promptViewModel: null,
    });

    const { container } = render(<Prompt promptId="test-id" />);
    const wrapper = createWrapper(container);
    expect(
      wrapper.findContainer('[data-testid="container-loading"]'),
    ).toBeTruthy();
  });

  it("renders error state", () => {
    vi.mocked(usePrompt).mockReturnValue({
      loading: false,
      error: new Error("Test error"),
      promptViewModel: null,
    });

    const { container } = render(<Prompt promptId="test-id" />);
    const wrapper = createWrapper(container).findAlert(
      '[data-testid="alert-error"]',
    )!;
    expect(wrapper.findContent().getElement().textContent).toContain(
      "Test error",
    );
  });

  it("renders prompt data", () => {
    vi.mocked(usePrompt).mockReturnValue({
      loading: false,
      error: null,
      promptViewModel: promptViewModel,
    });

    render(<Prompt promptId="test-id" />);
    expect(screen.getByText(promptViewModel.name)).toBeInTheDocument();
    expect(screen.getByText(promptViewModel.instruction)).toBeInTheDocument();
    expect(screen.getByText(promptViewModel.sdlcPhase)).toBeInTheDocument();
    expect(screen.getByText(promptViewModel.category)).toBeInTheDocument();
    expect(screen.getByText(promptViewModel.createdBy())).toBeInTheDocument();
    expect(screen.getByText(promptViewModel.howto)).toBeInTheDocument();
  });

  it("hides how to if empty", () => {
    const promptViewModel = PromptViewModel.fromSchema({
      id: "test-id",
      name: "Test Prompt",
      instruction: "Test instruction",
      sdlc_phase: "DEPLOY",
      category: "CHAT",
      owner_username: "Test User",
      owner: "user123",
      description: "description",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    vi.mocked(usePrompt).mockReturnValue({
      loading: false,
      error: null,
      promptViewModel: promptViewModel,
    });

    const { container } = render(<Prompt promptId="test-id" />);
    const wrapper = createWrapper(container);

    expect(wrapper.findBox('[data-testid="box-howto"]')).toBeFalsy();
  });

  it("renders edit button for owner", () => {
    vi.mocked(usePrompt).mockReturnValue({
      loading: false,
      error: null,
      promptViewModel: promptViewModel,
    });

    const { container } = render(<Prompt promptId="test-id" />);

    const wrapper = createWrapper(container);
    expect(wrapper.findButton('[data-testid="button-edit"]')).toBeTruthy();
  });

  it("does not render edit button for user that is owning the prompt", () => {
    vi.mocked(usePrompt).mockReturnValue({
      loading: false,
      error: null,
      promptViewModel: promptViewModel,
    });
    vi.mocked(useAuth).mockReturnValue({
      user: UserViewModel.createGuest(),
      logout: vi.fn(),
      fetchUser: vi.fn(),
    });

    const { container } = render(<Prompt promptId="test-id" />);

    const wrapper = createWrapper(container);
    expect(wrapper.findButton('[data-testid="button-edit"]')).toBeFalsy();
  });

  it("renders copy button", () => {
    vi.mocked(usePrompt).mockReturnValue({
      loading: false,
      error: null,
      promptViewModel: promptViewModel,
    });

    const { container } = render(<Prompt promptId="test-id" />);

    const wrapper = createWrapper(container);
    expect(
      wrapper.findCopyToClipboard('[data-testid="button-copy"]'),
    ).toBeTruthy();
  });
});
