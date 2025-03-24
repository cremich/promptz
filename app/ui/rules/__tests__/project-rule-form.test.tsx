import { ProjectRule } from "@/app/lib/definitions";
import ProjectRuleForm from "@/app/ui/rules/project-rule-form";
import { describe, expect, test } from "@jest/globals";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";

describe("Project Rule Form", () => {
  const projectRule: ProjectRule = {
    id: "12345",
    title: "Test Project Rule",
    description: "This is a test project rule",
    content: "# Project Rule Content\nThis is the content of the project rule.",
    tags: ["NextJS", "TypeScript"],
    author: "cremich",
    authorId: "12345",
    public: true,
    sourceURL: "https://github.com/example/repo",
  };

  test("renders the project rule form component unchanged", () => {
    const { container } = render(<ProjectRuleForm projectRule={projectRule} />);
    expect(container).toMatchSnapshot();
  });
});
