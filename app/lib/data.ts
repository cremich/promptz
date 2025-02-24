import {
  PromptCategory,
  QInterface,
  SdlcActivity,
} from "@/app/lib/definitions";

function convertEnumToTags(enumObj: Record<string, string>): string[] {
  return Object.entries(enumObj)
    .filter(([key]) => isNaN(Number(key)))
    .map(([_, value]) => value);
}

export function getAllTags(): string[] {
  const sdlcTags = convertEnumToTags(SdlcActivity);
  const categoryTags = convertEnumToTags(PromptCategory);
  const interfaceTags = convertEnumToTags(QInterface);
  return [...sdlcTags, ...categoryTags, ...interfaceTags];
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
