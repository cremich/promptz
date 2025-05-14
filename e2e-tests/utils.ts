export function extractCode(message: string): string {
  const match = message.match(/\d+/);
  return match ? match[0] : "";
}
