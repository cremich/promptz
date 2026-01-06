/**
 * Get short commit hash (first 7 characters)
 */
export function getShortHash(fullHash: string): string {
  return fullHash.substring(0, 7);
}