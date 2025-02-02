import { describe, it, expect } from "vitest";
import { UserViewModel } from "@/models/UserViewModel";

describe("UserViewModel", () => {
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

  it("should create a UserViewModel instance from schema data", () => {
    const userViewModel = UserViewModel.fromSchema(mockUserData);

    expect(userViewModel.id).toBe(mockUserData.id);
    expect(userViewModel.username).toBe(mockUserData.username);
    expect(userViewModel.email).toBe(mockUserData.email);
    expect(userViewModel.displayName).toBe(mockUserData.displayName);
    expect(userViewModel.owner).toBe(mockUserData.owner);
  });
});
