import { SelectProps, TilesProps } from "@cloudscape-design/components";

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

function getDescription(value: string): string {
  const descriptions: Record<string, string> = {
    Plan: "Define project scope, objectives, and feasibility while estimating resources and timelines.",
    Requirements:
      "Gather, analyze, and document detailed functional and non-functional software requirements.",
    Design:
      "Create the software architecture, user interface, and system design based on the requirements.",
    Implement:
      "Write, refactor, fix and review the actual code for the software according to design specifications.",
    Test: "Conduct various types of testing to identify and fix bugs, ensuring the software meets quality standards and requirements.",
    Deploy:
      "Release the software to the production environment, including installation, configuration, and user training.",
    Maintain:
      "Monitor, update, and support the software post-deployment and addressing operational issues.",
    IDE: "In IDEs, Amazon Q Developer includes capabilities to provide guidance and support across various aspects of software development, such as answering questions about building on AWS, generating and updating code, security scanning, and optimizing and refactoring code.",
    CLI: "In the CLI, you can let Amazon Q Developer generate CLI commands, and automate tasks using natural language queries.",
    "Management Console":
      "In the AWS Management Console, you can ask Amazon Q Developer about your AWS resources and costs, contact AWS Support directly, and diagnose common console errors.",
  };
  return descriptions[value] || "";
}
