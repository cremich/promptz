import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Submission from "@/components/common/submission";

describe("Submission", () => {
  test("Renders formatted creation date", () => {
    render(<Submission createdAt="2024-01-01T00:00:00Z" />);

    expect(
      screen.getByText("Submitted on January 1, 2024"),
    ).toBeInTheDocument();
  });

  test("Prioritizes updated date over creation date", () => {
    render(
      <Submission
        createdAt="2024-01-01T00:00:00Z"
        updatedAt="2024-02-15T00:00:00Z"
      />,
    );

    expect(
      screen.getByText("Submitted on February 15, 2024"),
    ).toBeInTheDocument();
  });

  test("Shows unknown date when no dates are provided", () => {
    render(<Submission />);

    expect(screen.getByText("Submitted on Unknown date")).toBeInTheDocument();
  });

  test("Shows unknown date when createdAt is undefined", () => {
    render(<Submission createdAt={undefined} />);

    expect(screen.getByText("Submitted on Unknown date")).toBeInTheDocument();
  });

  test("Shows unknown date when createdAt is empty string", () => {
    render(<Submission createdAt="" />);

    expect(screen.getByText("Submitted on Unknown date")).toBeInTheDocument();
  });

  test("Uses creation date when updatedAt is undefined", () => {
    render(
      <Submission createdAt="2024-03-10T00:00:00Z" updatedAt={undefined} />,
    );

    expect(screen.getByText("Submitted on March 10, 2024")).toBeInTheDocument();
  });

  test("Uses creation date when updatedAt is empty string", () => {
    render(<Submission createdAt="2024-03-10T00:00:00Z" updatedAt="" />);

    expect(screen.getByText("Submitted on March 10, 2024")).toBeInTheDocument();
  });

  test("Applies custom className", () => {
    render(
      <Submission createdAt="2024-01-01T00:00:00Z" className="custom-class" />,
    );

    const element = screen.getByText("Submitted on January 1, 2024");
    expect(element).toHaveClass("custom-class");
  });

  test("Applies default styling when no className provided", () => {
    render(<Submission createdAt="2024-01-01T00:00:00Z" />);

    const element = screen.getByText("Submitted on January 1, 2024");
    expect(element).toHaveClass("text-sm", "text-muted-foreground");
  });

  test("Displays author information when provided", () => {
    render(<Submission createdAt="2024-01-01T00:00:00Z" author="testuser" />);

    expect(
      screen.getByText("Submitted on January 1, 2024 by @testuser"),
    ).toBeInTheDocument();
  });

  test("Does not display author when not provided", () => {
    render(<Submission createdAt="2024-01-01T00:00:00Z" />);

    expect(
      screen.getByText("Submitted on January 1, 2024"),
    ).toBeInTheDocument();
    expect(screen.queryByText(/@/)).not.toBeInTheDocument();
  });

  test("Does not display scope badge when scope is undefined", () => {
    render(<Submission createdAt="2024-01-01T00:00:00Z" />);

    expect(screen.queryByText("Public")).not.toBeInTheDocument();
    expect(screen.queryByText("Private")).not.toBeInTheDocument();
  });

  test("Displays all information together when all props are provided", () => {
    render(
      <Submission
        createdAt="2024-01-01T00:00:00Z"
        updatedAt="2024-02-15T00:00:00Z"
        author="testuser"
        className="custom-class"
      />,
    );

    expect(
      screen.getByText("Submitted on February 15, 2024 by @testuser"),
    ).toBeInTheDocument();

    const dateElement = screen.getByText(
      "Submitted on February 15, 2024 by @testuser",
    );
    expect(dateElement).toHaveClass("custom-class");
  });
});
