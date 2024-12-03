import { QInterface, PromptCategory } from "@/models/PromptViewModel";
import { SelectProps, TilesProps } from "@cloudscape-design/components";

export enum IDEPromptCategory {
  CHAT = "Chat",
  DEV_AGENT = "Dev Agent",
  DOC_AGENT = "Doc Agent",
  INLINE = "Inline",
  REVIEW_AGENT = "Review Agent",
  TRANSFORM = "Transform Agent",
  TEST_AGENT = "Test Agent",
}

export enum CLIPromptCategory {
  CHAT = "Chat",
  TRANSLATE = "Translate",
}

export enum ConsolePromptCateogry {
  CHAT = "Chat",
}

export const createSelectOptions = <T extends string>(
  enumObject: { [key: string]: T },
  excludeValues: T[] = [],
): SelectProps.Options => {
  const options = Object.entries(enumObject)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .filter(([_, value]) => !excludeValues.includes(value))
    .map(([, value]) => ({
      label: value,
      value: value,
      description: getDescription(value),
    }));

  return options;
};

export const createTilesItems = <T extends string>(
  enumObject: { [key: string]: T },
  excludeValues: T[] = [],
): TilesProps.TilesDefinition[] => {
  const options = Object.entries(enumObject)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .filter(([_, value]) => !excludeValues.includes(value))
    .map(([, value]) => ({
      label: value,
      value: value,
      description: getDescription(value),
    }));

  return options;
};

export const switchCategories = (interfaceValue: QInterface) => {
  switch (interfaceValue) {
    case QInterface.IDE:
      return createSelectOptions(IDEPromptCategory);
    case QInterface.CLI:
      return createSelectOptions(CLIPromptCategory);
    case QInterface.CONSOLE:
      return createSelectOptions(ConsolePromptCateogry);
    default:
      return createSelectOptions(PromptCategory, [PromptCategory.UNKNOWN]);
  }
};

function getDescription(value: string): string {
  const descriptions: Record<string, string> = {
    Plan: "Define project scope, objectives, and feasibility while estimating resources and timelines.",
    Requirements:
      "Gather, analyze, and document detailed functional and non-functional software requirements.",
    Design:
      "Create the software architecture, user interface, and system design based on the requirements.",
    Implement:
      "Write and review code according to design specifications and coding standards.",
    Test: "Conduct various types of testing to identify and fix bugs, ensuring software meets quality standards.",
    Deploy:
      "Release software to production, including installation, configuration, and user training.",
    Operate:
      "Manage day-to-day running of systems, including monitoring, maintenance, and incident response.",
    Optimize:
      "Improve system performance, efficiency, and cost-effectiveness through analysis and tuning.",
    Support:
      "Provide technical assistance, troubleshoot issues, and resolve user inquiries.",
    Enhance:
      "Add new features or improve existing functionality based on user feedback and business needs.",
    Documentation:
      "Create and maintain technical, user, and process documentation for the software system.",
    Refactoring:
      "Restructure and improve existing code without changing its external behavior.",
    Debugging:
      "Identify, analyze, and fix software defects and issues in the codebase.",
    Security:
      "Implement security measures, conduct assessments, and address vulnerabilities.",
    "Patch Management":
      "Plan, test, and deploy software updates, security fixes, and system patches across your infrastructure and applications.",

    Unknown: "",
    IDE: "In IDEs, Amazon Q Developer includes capabilities to provide guidance and support across various aspects of software development, such as answering questions about building on AWS, generating and updating code, security scanning, and optimizing and refactoring code.",
    CLI: "In the CLI, you can let Amazon Q Developer generate CLI commands, and automate tasks using natural language queries.",
    "Management Console":
      "In the AWS Management Console, you can ask Amazon Q Developer about your AWS resources and costs, contact AWS Support directly, and diagnose common console errors.",
  };
  return descriptions[value] || "";
}
