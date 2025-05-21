function convertEnumToTags(enumObj: Record<string, string>): string[] {
  return Object.values(enumObj).filter((value) => typeof value === "string");
}

export function getQInterfaceTags(): string[] {
  return convertEnumToTags(QInterface);
}

export function getCategoryTags(): string[] {
  return convertEnumToTags(PromptCategory);
}

export function getSdlcTags(): string[] {
  return convertEnumToTags(SdlcActivity);
}
export enum SdlcActivity {
  DEBUG = "Debugging",
  DEPLOY = "Deploy",
  DESIGN = "Design",
  DOCUMENT = "Documentation",
  ENHANCE = "Enhance",
  IMPLEMENT = "Implement",
  OPERATE = "Operate",
  OPTIMIZE = "Optimize",
  PATCH = "Patch Management",
  PLAN = "Plan",
  REFACTOR = "Refactoring",
  REQ = "Requirements",
  SECURITY = "Security",
  SUPPORT = "Support",
  TEST = "Test",
}
export enum PromptCategory {
  CHAT = "Chat",
  DEV_AGENT = "Dev Agent",
  DOC_AGENT = "Doc Agent",
  INLINE = "Inline",
  REVIEW_AGENT = "Review Agent",
  TEST_AGENT = "Test Agent",
  TRANSFORM = "Transform Agent",
  TRANSLATE = "Translate",
}
export enum QInterface {
  IDE = "IDE",
  CLI = "CLI",
  CONSOLE = "Management Console",
}
export enum ProjectRuleTag {
  NEXTJS = "NextJS",
  REACT = "React",
  VUE = "Vue.js",
  SWIFT = "Swift",
  KOTLIN = "Kotlin",
  TYPESCRIPT = "TypeScript",
  JAVASCRIPT = "JavaScript",
  PYTHON = "Python",
  JAVA = "Java",
  RUST = "Rust",
  GO = "Go",
  AWS = "AWS",
  AMPLIFY = "Amplify",
  CDK = "CDK",
  SAM = "SAM",
  CLOUDFORMATION = "Cloudformation",
  SECURITY = "Security",
  PERFORMANCE = "Performance",
  ACCESSIBILITY = "Accessibility",
  SEO = "SEO",
}
