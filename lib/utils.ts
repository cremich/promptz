import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function normalizeTags(tags: string | string[]): string[] {
  return Array.isArray(tags) ? tags : [tags];
}
