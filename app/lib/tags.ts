import {
  PromptCategory,
  QInterface,
  SdlcActivity,
} from "@/app/lib/definitions";

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
