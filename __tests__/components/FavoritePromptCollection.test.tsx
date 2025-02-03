import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import createWrapper from "@cloudscape-design/components/test-utils/dom";
import { PromptViewModel } from "@/models/PromptViewModel";
import { useFavoritePromptsCollection } from "@/hooks/useFavoritePromptCollection";
import FavoritePromptCollection from "@/components/FavoritePromptCollection";

// Mock the dependencies
const mockPush = vi.fn();
vi.mock("@/hooks/useFavoritePromptCollection");
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("FavoritePromptCollection component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders empty state", () => {
    vi.mocked(useFavoritePromptsCollection).mockReturnValue({
      prompts: [],
      error: null,
      loading: false,
    });
    const { container } = render(<FavoritePromptCollection />);
    const wrapper = createWrapper(container);
    const content = wrapper.findContainer()!.findContent()!.getElement()!;

    expect(content.textContent).contains("No prompts marked as favorites.");
    expect(wrapper.findButton('[data-testid="button-browse"]')).toBeTruthy();
  });

  it("navigates to create prompt page when 'Browse' button is clicked", () => {
    const { container } = render(<FavoritePromptCollection />);
    const wrapper = createWrapper(container);
    const createButton = wrapper.findButton('[data-testid="button-browse"]')!;

    fireEvent.click(createButton.getElement());

    expect(mockPush).toHaveBeenCalledWith("/browse");
  });

  it("renders favorite prompts", () => {
    vi.mocked(useFavoritePromptsCollection).mockReturnValue({
      prompts: [new PromptViewModel()],
      error: null,
      loading: false,
    });

    const { container } = render(<FavoritePromptCollection />);
    const wrapper = createWrapper(container);

    const cards = wrapper.findCards()!;
    const cardItems = cards.findItems()!;

    expect(cards.findItems()).toHaveLength(1);
    expect(cardItems.length).eq(1);
  });
});
