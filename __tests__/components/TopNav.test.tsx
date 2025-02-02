import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import TopNav from "@/components/TopNav";
import { useAuth } from "@/contexts/AuthContext";
import "@testing-library/jest-dom/vitest";
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

// Mock the hooks
vi.mock("@/contexts/AuthContext");

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe("TopNav component", () => {
  it("renders Browse button for all users", () => {
    vi.mocked(useAuth).mockReturnValue({
      user: primaryUserModel,
      logout: vi.fn(),
      fetchUser: vi.fn(),
    });
    render(<TopNav />);
    expect(screen.getByRole("link", { name: "Browse" })).toHaveAttribute(
      "href",
      "/browse",
    );
  });

  it("renders feedback link button for all users", () => {
    vi.mocked(useAuth).mockReturnValue({
      user: primaryUserModel,
      logout: vi.fn(),
      fetchUser: vi.fn(),
    });
    render(<TopNav />);
    expect(screen.getByRole("link", { name: "Feedback" })).toHaveAttribute(
      "href",
      "https://github.com/cremich/promptz/issues",
    );
  });

  it("renders Sign In button for guest users", () => {
    vi.mocked(useAuth).mockReturnValue({
      user: UserViewModel.createGuest(),
      logout: vi.fn(),
      fetchUser: vi.fn(),
    });

    render(<TopNav />);
    expect(screen.getByRole("link", { name: "Sign In" })).toHaveAttribute(
      "href",
      "/auth",
    );
  });

  it("renders My Prompts button for logged-in users", () => {
    vi.mocked(useAuth).mockReturnValue({
      user: primaryUserModel,
      logout: vi.fn(),
      fetchUser: vi.fn(),
    });
    render(<TopNav />);
    expect(screen.getByRole("link", { name: "My Prompts" })).toHaveAttribute(
      "href",
      "/browse/my",
    );
  });

  it("renders Sign Out button for logged-in users", () => {
    vi.mocked(useAuth).mockReturnValue({
      user: primaryUserModel,
      logout: vi.fn(),
      fetchUser: vi.fn(),
    });
    render(<TopNav />);
    expect(
      screen.getByRole("button", { name: "Sign Out" }),
    ).toBeInTheDocument();
  });

  it("renders My Drafts button for logged-in users", () => {
    vi.mocked(useAuth).mockReturnValue({
      user: primaryUserModel,
      logout: vi.fn(),
      fetchUser: vi.fn(),
    });
    render(<TopNav />);
    expect(screen.getByRole("link", { name: "My Drafts" })).toHaveAttribute(
      "href",
      "/prompt/drafts",
    );
  });
});
