import { describe, it, expect, vi } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import StarPrompt from "@/components/StarPrompt";
import { PromptViewModel } from "@/models/PromptViewModel";
import { UserViewModel } from "@/models/UserViewModel";

vi.mock("@/repositories/StarRepository");

describe("StarPrompt", () => {
  it("renders correctly with initial unstarred state", () => {
    const prompt = new PromptViewModel();
    const user = new UserViewModel("", "", "", "", "", false);
    render(<StarPrompt prompt={prompt} user={user} />);
    const button = screen.getByTestId("button-star");
    expect(button).toHaveTextContent("Add to Favorites");
  });

  it("toggles star state when clicked", async () => {
    const prompt = new PromptViewModel();
    const user = new UserViewModel("", "", "", "", "", false);
    render(<StarPrompt prompt={prompt} user={user} />);
    const button = screen.getByTestId("button-star");

    await fireEvent.click(button);
    expect(button).toHaveTextContent("Remove from Favorites");

    await fireEvent.click(button);
    expect(button).toHaveTextContent("Add to Favorites");
  });

  it("disables button for guest users", () => {
    const prompt = new PromptViewModel();
    const user = new UserViewModel("", "", "", "", "", true);
    render(<StarPrompt prompt={prompt} user={user} />);
    const button = screen.getByTestId("button-star");
    expect(button).toBeDisabled();
  });

  it("renders with initial starred state", () => {
    const prompt = new PromptViewModel();
    prompt.star();
    const user = new UserViewModel("", "", "", "", "", false);
    render(<StarPrompt prompt={prompt} user={user} />);
    const button = screen.getByTestId("button-star");
    expect(button).toHaveTextContent("Remove from Favorites");
  });
});
