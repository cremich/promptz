import { SelectProps } from "@cloudscape-design/components";

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

function getDescription(phase: string): string {
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
  };
  return descriptions[phase] || "";
}
