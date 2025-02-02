import { describe, it, expect, vi } from "vitest";
import { render, act, RenderResult } from "@testing-library/react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { fetchUserAttributes, getCurrentUser, signOut } from "aws-amplify/auth";
import { UserGraphQLRepository } from "@/repositories/UserRepository";
import { UserViewModel } from "@/models/UserViewModel";

const mockUserData = {
  id: "4304d832-1021-707b-211b-2be14c145d75",
  username: "4304d832-1021-707b-211b-2be14c145d75",
  email: "test@example.com",
  displayName: "Test User",
  owner:
    "4304d832-1021-707b-211b-2be14c145d75::4304d832-1021-707b-211b-2be14c145d75",
  createdAt: "",
  updatedAt: "",
};

const userModel = UserViewModel.fromSchema(mockUserData);

vi.mock("aws-amplify/auth", () => ({
  getCurrentUser: vi.fn(),
  fetchUserAttributes: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock("@/repositories/UserRepository");

describe("AuthContext", () => {
  it("should fetch user on mount", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({
      userId: "4304d832-1021-707b-211b-2be14c145d75",
      username: "username",
    });
    vi.mocked(UserGraphQLRepository.prototype.getUser).mockResolvedValue(
      userModel,
    );

    const TestComponent = () => {
      const { user } = useAuth();
      return <div>{user ? user.displayName : "No user"}</div>;
    };

    let renderResult;
    await act(async () => {
      renderResult = render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>,
      );
    });

    expect(renderResult!.getByText("Test User")).toBeTruthy();
  });

  it("should fallback to guest user", async () => {
    vi.mocked(fetchUserAttributes).mockResolvedValue({
      sub: "1",
      preferred_username: "Test Fallback",
    });
    vi.mocked(UserGraphQLRepository.prototype.getUser).mockRejectedValue(
      Error(),
    );
    const TestComponent = () => {
      const { user } = useAuth();
      return <div>{user ? user.displayName : "No user"}</div>;
    };

    let renderResult;
    await act(async () => {
      renderResult = render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>,
      );
    });

    expect(renderResult!.getByText("Test Fallback")).toBeTruthy();
  });

  it("should logout user", async () => {
    vi.mocked(UserGraphQLRepository.prototype.getUser).mockResolvedValue(
      userModel,
    );

    const TestComponent = () => {
      const { user, logout } = useAuth();
      return (
        <div>
          <span>{user ? user.displayName : "No user"}</span>
          <button onClick={logout}>Logout</button>
        </div>
      );
    };

    let renderResult: RenderResult;
    await act(async () => {
      renderResult = render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>,
      );
    });

    await act(async () => {
      renderResult.getByText("Logout").click();
    });

    expect(renderResult!.getByText("Guest")).toBeTruthy();
    expect(signOut).toHaveBeenCalled();
  });

  it("should throw error when useAuth is used outside of AuthProvider", () => {
    const TestComponent = () => {
      useAuth();
      return null;
    };

    expect(() => render(<TestComponent />)).toThrow(
      "useAuth must be used within an AuthProvider",
    );
  });
});
