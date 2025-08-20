import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import SubmittedDate from "@/components/common/submitted-date";

describe("SubmittedDate", () => {
  test("Renders formatted creation date", () => {
    render(<SubmittedDate createdAt="2024-01-01T00:00:00Z" />);

    expect(
      screen.getByText("Submitted on January 1, 2024"),
    ).toBeInTheDocument();
  });

  test("Prioritizes updated date over creation date", () => {
    render(
      <SubmittedDate
        createdAt="2024-01-01T00:00:00Z"
        updatedAt="2024-02-15T00:00:00Z"
      />,
    );

    expect(
      screen.getByText("Submitted on February 15, 2024"),
    ).toBeInTheDocument();
  });

  test("Shows unknown date when no dates are provided", () => {
    render(<SubmittedDate />);

    expect(screen.getByText("Submitted on Unknown date")).toBeInTheDocument();
  });

  test("Shows unknown date when createdAt is undefined", () => {
    render(<SubmittedDate createdAt={undefined} />);

    expect(screen.getByText("Submitted on Unknown date")).toBeInTheDocument();
  });

  test("Shows unknown date when createdAt is empty string", () => {
    render(<SubmittedDate createdAt="" />);

    expect(screen.getByText("Submitted on Unknown date")).toBeInTheDocument();
  });

  test("Uses creation date when updatedAt is undefined", () => {
    render(
      <SubmittedDate createdAt="2024-03-10T00:00:00Z" updatedAt={undefined} />,
    );

    expect(screen.getByText("Submitted on March 10, 2024")).toBeInTheDocument();
  });

  test("Uses creation date when updatedAt is empty string", () => {
    render(<SubmittedDate createdAt="2024-03-10T00:00:00Z" updatedAt="" />);

    expect(screen.getByText("Submitted on March 10, 2024")).toBeInTheDocument();
  });

  test("Applies custom className", () => {
    render(
      <SubmittedDate
        createdAt="2024-01-01T00:00:00Z"
        className="custom-class"
      />,
    );

    const element = screen.getByText("Submitted on January 1, 2024");
    expect(element).toHaveClass("custom-class");
  });

  test("Applies default styling when no className provided", () => {
    render(<SubmittedDate createdAt="2024-01-01T00:00:00Z" />);

    const element = screen.getByText("Submitted on January 1, 2024");
    expect(element).toHaveClass("text-sm", "text-muted-foreground");
  });
});
