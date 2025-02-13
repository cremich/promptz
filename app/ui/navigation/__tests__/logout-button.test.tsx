import { describe, expect, test } from "@jest/globals";
import LogoutButton from "@/app/ui/navigation/logout-button";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { signOut } from "aws-amplify/auth";

describe("Logout Button", () => {
  test("renders logout button unchanged", () => {
    const { container } = render(<LogoutButton />);
    expect(container).toMatchSnapshot();
  });

  test("user is logged out", async () => {
    // Arrange
    render(<LogoutButton />);
    const logoutButton = screen.getByTestId("logout-button");

    // Act
    fireEvent.click(logoutButton);

    // Assert
    expect(signOut).toHaveBeenCalledTimes(1);
  });
});
